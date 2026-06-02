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

export type MaintenanceTask = {
  id: string;
  title: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "Assigned" | "In progress" | "Completed";
  deadline: string;
};

export type OnouMetric = {
  label: string;
  value: string;
  note: string;
};

export type Dashboard = {
  student: { name: string; establishment: string; residence: string; room: string };
  notifications: number;
  housing: { status: string; completion: number; nextStep: string };
  appointments: Appointment[];
  incidents: Incident[];
  events: EventItem[];
  operations: {
    onou: {
      metrics: OnouMetric[];
      alerts: { id: string; title: string; text: string; tone: "warning" | "danger" | "info" }[];
      approvals: { id: string; title: string; text: string; status: string }[];
    };
    maintenance: {
      agent: string;
      residence: string;
      tasks: MaintenanceTask[];
    };
  };
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
  updateTask: (id: string, status: MaintenanceTask["status"]) =>
    request<MaintenanceTask>(`/api/tasks/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
};
