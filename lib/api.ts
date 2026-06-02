export type Appointment = {
  id: string;
  practitioner: string;
  specialty: string;
  date: string;
  time: string;
  mode: "planned" | "immediate";
};

export type Incident = {
  id: string;
  title: string;
  location: string;
  status: "Sent" | "Assigned" | "Resolved";
  createdAt: string;
};

export type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  seats: number;
  registered: boolean;
};

export type Dashboard = {
  student: { name: string; establishment: string; residence: string; room: string };
  notifications: number;
  housing: { status: string; completion: number; nextStep: string };
  appointments: Appointment[];
  incidents: Incident[];
  events: EventItem[];
};

declare const process: { env: { EXPO_PUBLIC_API_URL?: string } };

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error("API unavailable");
  return response.json() as Promise<T>;
}

export const api = {
  dashboard: () => request<Dashboard>("/api/dashboard"),
  bookAppointment: (body: { specialty: string; mode: "planned" | "immediate" }) =>
    request<Appointment>("/api/appointments", { method: "POST", body: JSON.stringify(body) }),
  reportIncident: (body: { title: string; location: string }) =>
    request<Incident>("/api/incidents", { method: "POST", body: JSON.stringify(body) }),
  registerEvent: (id: string) =>
    request<EventItem>(`/api/events/${id}/register`, { method: "POST" }),
  triggerSos: () => request<{ reference: string }>("/api/sos", { method: "POST" }),
};
