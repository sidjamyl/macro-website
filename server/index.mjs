import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dataPath = join(dirname(fileURLToPath(import.meta.url)), "data.json");
const readData = async () => JSON.parse(await readFile(dataPath, "utf8"));
const saveData = (data) => writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`);
const json = (res, status, body) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(body));
};
const body = async (req) => {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
};
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}`;

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});
  const data = await readData();
  if (req.method === "GET" && req.url === "/") {
    return json(res, 200, {
      service: "e-tqan demo API",
      status: "ok",
      routes: ["/health", "/api/dashboard"],
    });
  }
  if (req.url === "/health") return json(res, 200, { status: "ok", service: "etqan-demo-api" });
  if (req.method === "GET" && req.url === "/api/dashboard") return json(res, 200, data);
  if (req.method === "POST" && req.url === "/api/appointments") {
    const input = await body(req);
    const appointment = {
      id: uid("apt"),
      practitioner: input.specialty === "Psychology" ? "Mme. Lina Kaci" : "Dr. Nabil Ait Ali",
      specialty: input.specialty,
      date: input.mode === "immediate" ? "Today" : "09 Jun",
      time: input.mode === "immediate" ? "11:00" : "14:30",
      mode: input.mode,
    };
    data.appointments.unshift(appointment);
    await saveData(data);
    return json(res, 201, appointment);
  }
  if (req.method === "POST" && req.url === "/api/incidents") {
    const input = await body(req);
    const incident = { id: uid("inc"), ...input, status: "Sent", createdAt: "Today" };
    data.incidents.unshift(incident);
    await saveData(data);
    return json(res, 201, incident);
  }
  const eventMatch = req.url?.match(/^\/api\/events\/([^/]+)\/register$/);
  if (req.method === "POST" && eventMatch) {
    const event = data.events.find((item) => item.id === eventMatch[1]);
    if (!event) return json(res, 404, { error: "Event not found" });
    event.registered = true;
    event.seats = Math.max(0, event.seats - 1);
    await saveData(data);
    return json(res, 200, event);
  }
  if (req.method === "POST" && req.url === "/api/sos") {
    return json(res, 201, { reference: `SOS-${Date.now().toString().slice(-6)}` });
  }
  return json(res, 404, { error: "Not found" });
}).listen(4000, "0.0.0.0", () => {
  console.log("e-tqan demo API listening on http://localhost:4000");
});
