import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  BedDouble,
  BriefcaseMedical,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  HeartPulse,
  Home,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  PartyPopper,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  UserCog,
  Users,
  Wrench,
  X,
} from "lucide-react-native";

import { api, type Dashboard, type EventItem } from "@/lib/api";

const colors = {
  navy: "#14496F",
  cream: "#F0E3CA",
  brown: "#602705",
  orange: "#E18B01",
  ink: "#183044",
  muted: "#6D7C86",
  paleBlue: "#EAF3F8",
  white: "#FFFFFF",
  line: "#E7E3DC",
  success: "#2C8061",
  danger: "#C73D3D",
};

type Tab = "home" | "housing" | "health" | "activities";
type ModalName = "appointment" | "incident" | "sos" | null;
type Role = "student" | "onou" | "maintenance";

const fallback: Dashboard = {
  student: {
    name: "Amel Bensalem",
    establishment: "ESI Alger",
    residence: "Cite universitaire El Alia",
    room: "B-214",
  },
  notifications: 3,
  housing: {
    status: "Room assigned",
    completion: 100,
    nextStep: "Your accommodation is active for 2026/2027",
  },
  appointments: [
    { id: "apt-1", practitioner: "Dr. Sara Belkacem", specialty: "General medicine", date: "05 Jun", time: "10:30", mode: "planned" },
  ],
  incidents: [
    { id: "inc-1", title: "Heating issue", location: "Room B-214", status: "Assigned", createdAt: "01 Jun" },
  ],
  events: [
    { id: "evt-1", title: "University Robotics Challenge", category: "Scientific", date: "12 Jun", location: "ESI Auditorium", seats: 34, registered: false },
    { id: "evt-2", title: "Inter-residence Football Cup", category: "Sport", date: "18 Jun", location: "El Alia Stadium", seats: 18, registered: false },
    { id: "evt-3", title: "Digital Art Evening", category: "Cultural", date: "23 Jun", location: "Bab Ezzouar Campus", seats: 62, registered: true },
  ],
  operations: {
    onou: {
      metrics: [
        { label: "Housing occupancy", value: "91%", note: "Across 18 residences" },
        { label: "Open incidents", value: "27", note: "6 require attention" },
        { label: "Appointments today", value: "146", note: "84% planned" },
        { label: "Active events", value: "32", note: "This month" },
      ],
      alerts: [
        { id: "alert-1", title: "6 maintenance SLA alerts", text: "El Alia and Bouraoui residences require follow-up.", tone: "danger" },
        { id: "alert-2", title: "Room assignment campaign", text: "842 validated applications are ready for automatic assignment.", tone: "warning" },
      ],
      approvals: [
        { id: "approval-1", title: "Inter-university tournament", text: "National university basketball cup", status: "Review" },
        { id: "approval-2", title: "Residence appeal batch", text: "18 accommodation appeals pending", status: "Review" },
      ],
    },
    maintenance: {
      agent: "Karim Haddad",
      residence: "Cite universitaire El Alia",
      tasks: [
        { id: "task-1", title: "Heating issue", location: "Building B - Room 214", priority: "High", status: "Assigned", deadline: "Today, 16:00" },
        { id: "task-2", title: "Water leak", location: "Building A - Floor 2", priority: "High", status: "In progress", deadline: "Today, 14:30" },
      ],
    },
  },
};

export default function App() {
  const [data, setData] = useState<Dashboard>(fallback);
  const [tab, setTab] = useState<Tab>("home");
  const [role, setRole] = useState<Role>("student");
  const [modal, setModal] = useState<ModalName>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setData(await api.dashboard());
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const content = useMemo(() => {
    if (role === "onou") return <OnouDashboard data={data} />;
    if (role === "maintenance") return <MaintenanceDashboard data={data} onRefresh={refresh} />;
    if (tab === "housing") return <Housing data={data} onIncident={() => setModal("incident")} onSos={() => setModal("sos")} />;
    if (tab === "health") return <Healthcare data={data} onBook={() => setModal("appointment")} />;
    if (tab === "activities") return <Activities data={data} onRefresh={refresh} />;
    return <DashboardHome data={data} goTo={setTab} onBook={() => setModal("appointment")} />;
  }, [data, role, tab]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.shell}>
        <Header data={data} connected={connected} role={role} />
        <RoleSwitcher role={role} onSelect={(nextRole) => { setRole(nextRole); setTab("home"); }} />
        {loading ? (
          <View style={styles.loader}><ActivityIndicator color={colors.orange} size="large" /></View>
        ) : (
          content
        )}
        {role === "student" && <BottomNav active={tab} onSelect={setTab} />}
      </View>
      <AppointmentModal open={modal === "appointment"} onClose={() => setModal(null)} onDone={refresh} />
      <IncidentModal open={modal === "incident"} room={data.student.room} onClose={() => setModal(null)} onDone={refresh} />
      <SosModal open={modal === "sos"} onClose={() => setModal(null)} />
    </SafeAreaView>
  );
}

function Header({ data, connected, role }: { data: Dashboard; connected: boolean; role: Role }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>e-tqan</Text>
        <Text style={styles.brandSub}>{role === "student" ? "Student welfare, simply connected" : role === "onou" ? "ONOU supervision console" : "Field operations mobile app"}</Text>
      </View>
      <View style={styles.headerActions}>
        <View style={[styles.onlineDot, { backgroundColor: connected ? "#6ED6A3" : colors.orange }]} />
        <Pressable style={styles.iconButton}>
          <Bell color={colors.white} size={19} />
          <View style={styles.badge}><Text style={styles.badgeText}>{data.notifications}</Text></View>
        </Pressable>
      </View>
    </View>
  );
}

function DashboardHome({ data, goTo, onBook }: { data: Dashboard; goTo: (tab: Tab) => void; onBook: () => void }) {
  const firstName = data.student.name.split(" ")[0];
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.kicker}>GOOD EVENING</Text>
            <Text style={styles.heroTitle}>Hello, {firstName}</Text>
            <Text style={styles.heroText}>{data.student.establishment}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>{firstName[0]}</Text></View>
        </View>
        <View style={styles.roomStrip}>
          <MapPin size={16} color={colors.cream} />
          <Text style={styles.roomStripText}>{data.student.residence}  |  Room {data.student.room}</Text>
        </View>
      </View>

      <SectionTitle title="What do you need?" subtitle="Choose a service to get started" />
      <View style={styles.serviceGrid}>
        <ServiceCard icon={<BedDouble color={colors.navy} size={22} />} label="My housing" text="Room, requests and appeals" tone="blue" onPress={() => goTo("housing")} />
        <ServiceCard icon={<Stethoscope color={colors.brown} size={22} />} label="Book a doctor" text="Planned or immediate care" tone="cream" onPress={onBook} />
        <ServiceCard icon={<PartyPopper color={colors.orange} size={22} />} label="Campus events" text="Activities, clubs and sport" tone="orange" onPress={() => goTo("activities")} />
        <ServiceCard icon={<Wrench color={colors.success} size={22} />} label="Report an issue" text="Send a maintenance request" tone="green" onPress={() => goTo("housing")} />
        <ServiceCard icon={<MessageSquareText color={colors.brown} size={22} />} label="Complaint" text="Submit or track a complaint" tone="cream" onPress={() => goTo("housing")} />
        <ServiceCard icon={<ShieldAlert color={colors.danger} size={22} />} label="Emergency SOS" text="Alert residence security" tone="red" onPress={() => goTo("housing")} />
      </View>

      <SectionTitle title="Coming up" subtitle="Campus life around you" action="View all" onPress={() => goTo("activities")} />
      <EventCard event={data.events[0]} compact />

      <View style={styles.notice}>
        <Sparkles color={colors.orange} size={18} />
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeTitle}>Accommodation confirmed</Text>
          <Text style={styles.noticeText}>{data.housing.nextStep}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function RoleSwitcher({ role, onSelect }: { role: Role; onSelect: (role: Role) => void }) {
  const roles: { id: Role; label: string }[] = [
    { id: "student", label: "Student" },
    { id: "onou", label: "ONOU admin" },
    { id: "maintenance", label: "Maintenance" },
  ];
  return (
    <View style={styles.roleBar}>
      {roles.map((item) => (
        <Pressable key={item.id} onPress={() => onSelect(item.id)} style={[styles.roleChip, role === item.id && styles.roleChipActive]}>
          <Text style={[styles.roleChipText, role === item.id && styles.roleChipTextActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function OnouDashboard({ data }: { data: Dashboard }) {
  return (
    <ScrollView contentContainerStyle={styles.opsScroll} showsVerticalScrollIndicator={false}>
      <PageIntro eyebrow="ONOU ADMINISTRATION" title="National overview" text="Supervise welfare services and identify the actions that need attention." />
      <View style={styles.metricGrid}>
        {data.operations.onou.metrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricNote}>{metric.note}</Text>
          </View>
        ))}
      </View>
      <SectionTitle title="Priority alerts" subtitle="Cases that need intervention" />
      {data.operations.onou.alerts.map((alert) => (
        <View key={alert.id} style={[styles.alertCard, alert.tone === "danger" ? styles.alertDanger : styles.alertWarning]}>
          <CircleAlert color={alert.tone === "danger" ? colors.danger : colors.orange} size={20} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{alert.title}</Text>
            <Text style={styles.listMeta}>{alert.text}</Text>
          </View>
          <ChevronRight color={colors.muted} size={18} />
        </View>
      ))}
      <SectionTitle title="Validation queue" subtitle="Review and approve pending requests" />
      {data.operations.onou.approvals.map((approval) => (
        <View key={approval.id} style={styles.listCard}>
          <View style={[styles.listIcon, { backgroundColor: colors.paleBlue }]}><FileCheck2 color={colors.navy} size={18} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{approval.title}</Text>
            <Text style={styles.listMeta}>{approval.text}</Text>
          </View>
          <Text style={styles.stateText}>{approval.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function MaintenanceDashboard({ data, onRefresh }: { data: Dashboard; onRefresh: () => Promise<void> }) {
  const updateTask = async (id: string, status: "In progress" | "Completed") => {
    try {
      await api.updateTask(id, status);
      await onRefresh();
    } catch {
      Alert.alert("Demo mode", "Start the local API to update interventions.");
    }
  };
  const tasks = data.operations.maintenance.tasks;
  return (
    <ScrollView contentContainerStyle={styles.opsScroll} showsVerticalScrollIndicator={false}>
      <PageIntro eyebrow="FIELD OPERATIONS" title={`Hello, ${data.operations.maintenance.agent.split(" ")[0]}`} text={`${data.operations.maintenance.residence} | ${tasks.length} assigned interventions`} />
      <View style={styles.techSummary}>
        <View><Text style={styles.techCount}>{tasks.filter((task) => task.status !== "Completed").length}</Text><Text style={styles.techLabel}>Open tasks</Text></View>
        <View><Text style={styles.techCount}>{tasks.filter((task) => task.priority === "High").length}</Text><Text style={styles.techLabel}>High priority</Text></View>
        <View><Text style={styles.techCount}>{tasks.filter((task) => task.status === "Completed").length}</Text><Text style={styles.techLabel}>Completed</Text></View>
      </View>
      <SectionTitle title="Today's interventions" subtitle="Work through your assigned tasks" />
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskCard}>
          <View style={styles.taskTop}>
            <View style={[styles.priorityPill, task.priority === "High" ? styles.priorityHigh : styles.priorityLow]}><Text style={[styles.priorityText, task.priority === "High" && { color: colors.danger }]}>{task.priority}</Text></View>
            <Text style={styles.taskDeadline}>{task.deadline}</Text>
          </View>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.inlineMeta}><MapPin size={14} color={colors.muted} /><Text style={styles.listMeta}>{task.location}</Text></View>
          <View style={styles.taskBottom}>
            <Text style={styles.taskStatus}>{task.status}</Text>
            {task.status !== "Completed" && (
              <Pressable style={styles.smallButton} onPress={() => updateTask(task.id, task.status === "Assigned" ? "In progress" : "Completed")}>
                <Text style={styles.smallButtonText}>{task.status === "Assigned" ? "Start task" : "Mark completed"}</Text>
              </Pressable>
            )}
            {task.status === "Completed" && <CheckCircle2 color={colors.success} size={20} />}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Housing({ data, onIncident, onSos }: { data: Dashboard; onIncident: () => void; onSos: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <PageIntro eyebrow="ACCOMMODATION" title="Your residence" text="Track your room, maintenance requests and resident services." />
      <View style={styles.housingCard}>
        <View style={styles.housingTop}>
          <View>
            <Text style={styles.cardKicker}>ACTIVE ASSIGNMENT</Text>
            <Text style={styles.housingRoom}>Room {data.student.room}</Text>
            <Text style={styles.housingResidence}>{data.student.residence}</Text>
          </View>
          <View style={styles.statusPill}><Text style={styles.statusPillText}>Confirmed</Text></View>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${data.housing.completion}%` }]} /></View>
        <Text style={styles.housingFoot}>Academic year 2026/2027  |  Assignment complete</Text>
      </View>

      <View style={styles.actionRow}>
        <ActionTile icon={<Wrench size={22} color={colors.orange} />} title="Report issue" text="Maintenance request" onPress={onIncident} />
        <ActionTile icon={<ShieldAlert size={22} color={colors.danger} />} title="Emergency SOS" text="Alert security" onPress={onSos} />
      </View>

      <SectionTitle title="Maintenance follow-up" subtitle="Your recent requests" />
      {data.incidents.map((incident) => (
        <View key={incident.id} style={styles.listCard}>
          <View style={[styles.listIcon, { backgroundColor: "#FFF5E2" }]}><Wrench color={colors.orange} size={18} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{incident.title}</Text>
            <Text style={styles.listMeta}>{incident.location}  |  {incident.createdAt}</Text>
          </View>
          <Text style={styles.stateText}>{incident.status}</Text>
        </View>
      ))}
      <View style={styles.serviceLine}><Text style={styles.serviceText}>Also available: room swap, complaints and appeals</Text></View>
    </ScrollView>
  );
}

function Healthcare({ data, onBook }: { data: Dashboard; onBook: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <PageIntro eyebrow="HEALTHCARE" title="Campus healthcare" text="Access university practitioners and keep your appointments in one place." />
      <Pressable style={styles.primaryAction} onPress={onBook}>
        <View style={styles.primaryActionIcon}><CalendarDays color={colors.white} size={24} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.primaryActionTitle}>Book an appointment</Text>
          <Text style={styles.primaryActionText}>Planned care or first available slot</Text>
        </View>
        <ChevronRight color={colors.white} size={20} />
      </Pressable>

      <SectionTitle title="Your appointments" subtitle="Upcoming consultations" />
      {data.appointments.map((appointment) => (
        <View key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.dateBox}>
            <Text style={styles.dateMain}>{appointment.date}</Text>
            <Text style={styles.dateSub}>{appointment.time}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{appointment.practitioner}</Text>
            <Text style={styles.listMeta}>{appointment.specialty}</Text>
            <Text style={styles.modeText}>{appointment.mode === "immediate" ? "Immediate appointment" : "Planned appointment"}</Text>
          </View>
        </View>
      ))}

      <View style={styles.healthNotice}>
        <CircleAlert color={colors.navy} size={19} />
        <Text style={styles.healthNoticeText}>For urgent situations, use the residence SOS button or call the national emergency number.</Text>
      </View>
    </ScrollView>
  );
}

function Activities({ data, onRefresh }: { data: Dashboard; onRefresh: () => Promise<void> }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <PageIntro eyebrow="CAMPUS LIFE" title="Activities & clubs" text="Discover scientific, cultural and sporting events across your campus." />
      <View style={styles.categoryRow}>
        {["All", "Scientific", "Cultural", "Sport"].map((category, index) => (
          <View key={category} style={[styles.categoryPill, index === 0 && styles.categoryPillActive]}>
            <Text style={[styles.categoryText, index === 0 && styles.categoryTextActive]}>{category}</Text>
          </View>
        ))}
      </View>
      <SectionTitle title="Recommended for you" subtitle={`${data.events.length} upcoming events`} />
      {data.events.map((event) => <EventCard key={event.id} event={event} onRefresh={onRefresh} />)}
    </ScrollView>
  );
}

function EventCard({ event, compact = false, onRefresh }: { event: EventItem; compact?: boolean; onRefresh?: () => Promise<void> }) {
  const register = async () => {
    if (event.registered) return;
    try {
      await api.registerEvent(event.id);
      await onRefresh?.();
      Alert.alert("Registration confirmed", `You are registered for ${event.title}.`);
    } catch {
      Alert.alert("Demo mode", "Start the local API to persist event registrations.");
    }
  };
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventAccent} />
      <View style={{ flex: 1, gap: 7 }}>
        <View style={styles.eventTop}>
          <Text style={styles.eventCategory}>{event.category.toUpperCase()}</Text>
          <Text style={styles.eventDate}>{event.date}</Text>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.inlineMeta}>
          <MapPin size={14} color={colors.muted} />
          <Text style={styles.listMeta}>{event.location}</Text>
        </View>
        {!compact && (
          <View style={styles.eventBottom}>
            <View style={styles.inlineMeta}><Users size={14} color={colors.muted} /><Text style={styles.listMeta}>{event.seats} seats left</Text></View>
            <Pressable onPress={register} style={[styles.smallButton, event.registered && styles.smallButtonDone]}>
              <Text style={[styles.smallButtonText, event.registered && styles.smallButtonTextDone]}>{event.registered ? "Registered" : "Register"}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function AppointmentModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => Promise<void> }) {
  const [specialty, setSpecialty] = useState("General medicine");
  const [mode, setMode] = useState<"planned" | "immediate">("planned");
  const submit = async () => {
    try {
      const appointment = await api.bookAppointment({ specialty, mode });
      await onDone();
      onClose();
      Alert.alert("Appointment confirmed", `${appointment.practitioner}, ${appointment.date} at ${appointment.time}.`);
    } catch {
      Alert.alert("Demo mode", "Start the local API to persist appointments.");
    }
  };
  return (
    <Sheet open={open} title="Book an appointment" onClose={onClose}>
      <Text style={styles.formLabel}>Practitioner</Text>
      <View style={styles.optionRow}>
        {["General medicine", "Psychology"].map((item) => <Option key={item} active={specialty === item} label={item} onPress={() => setSpecialty(item)} />)}
      </View>
      <Text style={styles.formLabel}>Appointment mode</Text>
      <View style={styles.optionRow}>
        <Option active={mode === "planned"} label="Planned slot" onPress={() => setMode("planned")} />
        <Option active={mode === "immediate"} label="First available" onPress={() => setMode("immediate")} />
      </View>
      <Pressable style={styles.submit} onPress={submit}><Text style={styles.submitText}>Confirm appointment</Text></Pressable>
    </Sheet>
  );
}

function IncidentModal({ open, room, onClose, onDone }: { open: boolean; room: string; onClose: () => void; onDone: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const submit = async () => {
    if (!title.trim()) return Alert.alert("Add a short description", "Tell the maintenance team what needs attention.");
    try {
      await api.reportIncident({ title, location: `Room ${room}` });
      setTitle("");
      await onDone();
      onClose();
      Alert.alert("Request sent", "The residence team has received your maintenance request.");
    } catch {
      Alert.alert("Demo mode", "Start the local API to persist maintenance requests.");
    }
  };
  return (
    <Sheet open={open} title="Report a maintenance issue" onClose={onClose}>
      <Text style={styles.formLabel}>What needs attention?</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Example: water leak under the sink" placeholderTextColor="#9CA8AE" style={styles.input} />
      <Text style={styles.inputHint}>Location: Room {room}. A residence agent will review and assign a technician.</Text>
      <Pressable style={styles.submit} onPress={submit}><Text style={styles.submitText}>Send request</Text></Pressable>
    </Sheet>
  );
}

function SosModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const trigger = async () => {
    try {
      const result = await api.triggerSos();
      onClose();
      Alert.alert("Alert dispatched", `Security has been notified. Reference ${result.reference}.`);
    } catch {
      Alert.alert("Demo mode", "Start the local API to dispatch a simulated alert.");
    }
  };
  return (
    <Sheet open={open} title="Emergency SOS" onClose={onClose}>
      <View style={styles.sosIcon}><ShieldAlert color={colors.white} size={35} /></View>
      <Text style={styles.sosTitle}>Alert residence security?</Text>
      <Text style={styles.sosText}>Use this only for an urgent medical or security situation inside the residence.</Text>
      <Pressable style={[styles.submit, { backgroundColor: colors.danger }]} onPress={trigger}><Text style={styles.submitText}>Send SOS alert</Text></Pressable>
    </Sheet>
  );
}

function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable onPress={onClose} style={styles.close}><X color={colors.ink} size={20} /></Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

function Option({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable style={[styles.option, active && styles.optionActive]} onPress={onPress}><Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text></Pressable>;
}

function BottomNav({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  const items: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "housing", label: "Housing", icon: Building2 },
    { id: "health", label: "Health", icon: HeartPulse },
    { id: "activities", label: "Activities", icon: CalendarDays },
  ];
  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const Icon = item.icon;
        const selected = item.id === active;
        return (
          <Pressable key={item.id} style={styles.navItem} onPress={() => onSelect(item.id)}>
            <Icon size={20} color={selected ? colors.orange : "#8B989F"} strokeWidth={selected ? 2.8 : 2} />
            <Text style={[styles.navText, selected && styles.navTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <View style={{ gap: 4 }}><Text style={styles.kickerOrange}>{eyebrow}</Text><Text style={styles.pageTitle}>{title}</Text><Text style={styles.pageText}>{text}</Text></View>;
}

function SectionTitle({ title, subtitle, action, onPress }: { title: string; subtitle: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionTitle}><View><Text style={styles.sectionHeading}>{title}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text></View>{action && <Pressable onPress={onPress}><Text style={styles.sectionAction}>{action}</Text></Pressable>}</View>;
}

function QuickCard({ icon, label, value, tone, onPress }: { icon: React.ReactNode; label: string; value: string; tone: "blue" | "cream"; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.quickCard, { backgroundColor: tone === "blue" ? colors.paleBlue : "#F8F1E4" }]}>{icon}<Text style={styles.quickLabel}>{label}</Text><Text style={styles.quickValue}>{value}</Text><ChevronRight color={colors.muted} size={17} /></Pressable>;
}

function ServiceCard({ icon, label, text, tone, onPress }: { icon: React.ReactNode; label: string; text: string; tone: "blue" | "cream" | "orange" | "green" | "red"; onPress: () => void }) {
  const backgrounds = { blue: colors.paleBlue, cream: "#F8F1E4", orange: "#FFF4DF", green: "#EAF7F0", red: "#FDEEEE" };
  return (
    <Pressable onPress={onPress} style={[styles.serviceCard, { backgroundColor: backgrounds[tone] }]}>
      {icon}
      <Text style={styles.serviceCardTitle}>{label}</Text>
      <Text style={styles.serviceCardText}>{text}</Text>
    </Pressable>
  );
}

function ActionTile({ icon, title, text, onPress }: { icon: React.ReactNode; title: string; text: string; onPress: () => void }) {
  return <Pressable style={styles.actionTile} onPress={onPress}>{icon}<Text style={styles.tileTitle}>{title}</Text><Text style={styles.tileText}>{text}</Text></Pressable>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.navy },
  shell: { flex: 1, width: "100%", maxWidth: 520, alignSelf: "center", backgroundColor: "#FCFBF8" },
  header: { height: 68, backgroundColor: colors.navy, paddingHorizontal: 19, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { color: colors.white, fontSize: 25, fontWeight: "800", letterSpacing: -1 },
  brandSub: { color: "#BFD2DF", fontSize: 10, letterSpacing: 0.4 },
  headerActions: { flexDirection: "row", gap: 11, alignItems: "center" },
  onlineDot: { width: 8, height: 8, borderRadius: 8 },
  iconButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center" },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "800" },
  roleBar: { backgroundColor: colors.white, borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: "row", gap: 7, paddingHorizontal: 13, paddingVertical: 9 },
  roleChip: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center", backgroundColor: "#F3F5F5" },
  roleChipActive: { backgroundColor: colors.navy },
  roleChipText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  roleChipTextActive: { color: colors.white },
  scroll: { padding: 17, paddingBottom: 96, gap: 17 },
  opsScroll: { padding: 17, paddingBottom: 30, gap: 15 },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: { backgroundColor: colors.navy, borderRadius: 22, padding: 18, gap: 18, overflow: "hidden" },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  kicker: { color: "#A9C6D8", fontWeight: "800", letterSpacing: 1.2, fontSize: 10 },
  kickerOrange: { color: colors.orange, fontWeight: "800", letterSpacing: 1.1, fontSize: 10 },
  heroTitle: { color: colors.white, fontWeight: "800", fontSize: 27, letterSpacing: -0.8, marginTop: 3 },
  heroText: { color: "#D4E1E8", fontSize: 13, marginTop: 2 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.white, fontSize: 20, fontWeight: "800" },
  roomStrip: { backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 12, padding: 11, flexDirection: "row", gap: 7, alignItems: "center" },
  roomStripText: { color: colors.cream, fontSize: 11, fontWeight: "600", flex: 1 },
  sectionTitle: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 2 },
  sectionHeading: { color: colors.ink, fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  sectionSubtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },
  sectionAction: { color: colors.orange, fontSize: 12, fontWeight: "800" },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  serviceCard: { width: "48%", minHeight: 122, borderRadius: 16, padding: 13, gap: 7 },
  serviceCardTitle: { color: colors.ink, fontSize: 14, fontWeight: "800", marginTop: 2 },
  serviceCardText: { color: colors.muted, fontSize: 11, lineHeight: 15 },
  twoColumns: { flexDirection: "row", gap: 11 },
  quickCard: { flex: 1, minHeight: 146, padding: 14, borderRadius: 17, gap: 8 },
  quickLabel: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  quickValue: { color: colors.ink, fontSize: 15, fontWeight: "800", flex: 1 },
  appointmentBanner: { backgroundColor: colors.brown, borderRadius: 18, padding: 15, flexDirection: "row", alignItems: "center", gap: 11 },
  bannerIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  bannerTitle: { color: colors.white, fontSize: 14, fontWeight: "800" },
  bannerText: { color: "#E7CBAE", fontSize: 11, marginTop: 3 },
  notice: { backgroundColor: "#FFF7E8", borderColor: "#F4D99C", borderWidth: 1, borderRadius: 14, padding: 13, flexDirection: "row", gap: 10, alignItems: "center" },
  noticeTitle: { color: colors.brown, fontSize: 13, fontWeight: "800" },
  noticeText: { color: "#866C52", fontSize: 11, marginTop: 2 },
  pageTitle: { color: colors.ink, fontSize: 27, fontWeight: "800", letterSpacing: -0.8 },
  pageText: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  housingCard: { backgroundColor: colors.navy, borderRadius: 19, padding: 17, gap: 14 },
  housingTop: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  cardKicker: { color: "#A9C6D8", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  housingRoom: { color: colors.white, fontSize: 23, fontWeight: "800", marginTop: 5 },
  housingResidence: { color: "#D4E1E8", fontSize: 12, marginTop: 4 },
  statusPill: { alignSelf: "flex-start", backgroundColor: "rgba(110,214,163,0.18)", paddingVertical: 6, paddingHorizontal: 9, borderRadius: 10 },
  statusPillText: { color: "#9CE8BE", fontSize: 10, fontWeight: "800" },
  progressTrack: { height: 6, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 5, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.orange, borderRadius: 5 },
  housingFoot: { color: "#C6D6DF", fontSize: 11 },
  actionRow: { flexDirection: "row", gap: 11 },
  actionTile: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 16, backgroundColor: colors.white, padding: 14, gap: 7 },
  tileTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  tileText: { color: colors.muted, fontSize: 11 },
  listCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 15, padding: 12, flexDirection: "row", alignItems: "center", gap: 11 },
  listIcon: { width: 39, height: 39, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  listTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  listMeta: { color: colors.muted, fontSize: 11, marginTop: 2 },
  stateText: { color: colors.orange, fontSize: 10, fontWeight: "800" },
  serviceLine: { borderRadius: 12, backgroundColor: colors.paleBlue, padding: 12 },
  serviceText: { textAlign: "center", color: colors.navy, fontSize: 11, fontWeight: "700" },
  primaryAction: { backgroundColor: colors.orange, borderRadius: 18, padding: 15, flexDirection: "row", gap: 12, alignItems: "center" },
  primaryActionIcon: { width: 45, height: 45, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.18)" },
  primaryActionTitle: { color: colors.white, fontSize: 15, fontWeight: "800" },
  primaryActionText: { color: "#FFF3D7", fontSize: 11, marginTop: 4 },
  appointmentCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 15, padding: 12, flexDirection: "row", gap: 12 },
  dateBox: { backgroundColor: colors.paleBlue, width: 59, height: 59, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dateMain: { color: colors.navy, fontSize: 13, fontWeight: "800" },
  dateSub: { color: colors.muted, fontSize: 11, marginTop: 3 },
  modeText: { color: colors.orange, fontSize: 10, fontWeight: "700", marginTop: 6 },
  healthNotice: { backgroundColor: colors.paleBlue, borderRadius: 14, flexDirection: "row", gap: 9, padding: 13 },
  healthNoticeText: { flex: 1, color: colors.navy, fontSize: 11, lineHeight: 16 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  categoryPill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1 },
  categoryPillActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  categoryText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  categoryTextActive: { color: colors.white },
  eventCard: { flexDirection: "row", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: "hidden", minHeight: 116 },
  eventAccent: { width: 5, backgroundColor: colors.orange },
  eventTop: { flexDirection: "row", justifyContent: "space-between", paddingTop: 13, paddingRight: 13 },
  eventCategory: { color: colors.orange, fontSize: 9, fontWeight: "800", letterSpacing: 0.7, paddingLeft: 12 },
  eventDate: { color: colors.navy, fontSize: 11, fontWeight: "800" },
  eventTitle: { color: colors.ink, paddingHorizontal: 12, fontSize: 14, fontWeight: "800" },
  inlineMeta: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12 },
  eventBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 12, paddingBottom: 12 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: { width: "48%", borderRadius: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 13, gap: 4 },
  metricValue: { color: colors.navy, fontSize: 25, fontWeight: "800" },
  metricLabel: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  metricNote: { color: colors.muted, fontSize: 10 },
  alertCard: { borderRadius: 14, borderWidth: 1, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  alertDanger: { backgroundColor: "#FDEEEE", borderColor: "#F3CACA" },
  alertWarning: { backgroundColor: "#FFF6E5", borderColor: "#F4D99C" },
  techSummary: { backgroundColor: colors.navy, borderRadius: 17, flexDirection: "row", justifyContent: "space-around", paddingVertical: 16 },
  techCount: { color: colors.white, fontSize: 23, fontWeight: "800", textAlign: "center" },
  techLabel: { color: "#BFD2DF", fontSize: 10, fontWeight: "700", marginTop: 3 },
  taskCard: { backgroundColor: colors.white, borderRadius: 16, borderColor: colors.line, borderWidth: 1, padding: 13, gap: 9 },
  taskTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priorityPill: { borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5 },
  priorityHigh: { backgroundColor: "#FDEEEE" },
  priorityLow: { backgroundColor: colors.paleBlue },
  priorityText: { color: colors.navy, fontSize: 10, fontWeight: "800" },
  taskDeadline: { color: colors.muted, fontSize: 10, fontWeight: "700" },
  taskTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  taskBottom: { borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskStatus: { color: colors.orange, fontSize: 11, fontWeight: "800" },
  smallButton: { backgroundColor: colors.orange, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  smallButtonDone: { backgroundColor: "#EDF8F2" },
  smallButtonText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  smallButtonTextDone: { color: colors.success },
  nav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 69, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", paddingHorizontal: 4 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { color: "#8B989F", fontSize: 10, fontWeight: "700" },
  navTextActive: { color: colors.orange },
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(10,28,40,0.45)" },
  sheet: { width: "100%", maxWidth: 520, alignSelf: "center", backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 19, paddingBottom: 28, gap: 14 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  sheetTitle: { color: colors.ink, fontSize: 19, fontWeight: "800" },
  close: { width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "#F1F4F5" },
  formLabel: { color: colors.ink, fontSize: 12, fontWeight: "800", marginTop: 3 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { borderColor: colors.line, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  optionActive: { backgroundColor: colors.paleBlue, borderColor: colors.navy },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  optionTextActive: { color: colors.navy },
  input: { borderColor: colors.line, borderWidth: 1, borderRadius: 12, padding: 13, color: colors.ink, fontSize: 13, backgroundColor: "#FCFBF8" },
  inputHint: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  submit: { backgroundColor: colors.navy, borderRadius: 13, padding: 15, alignItems: "center", marginTop: 5 },
  submitText: { color: colors.white, fontSize: 13, fontWeight: "800" },
  sosIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", alignSelf: "center" },
  sosTitle: { color: colors.ink, fontSize: 18, fontWeight: "800", textAlign: "center" },
  sosText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
