import { useState, type ReactNode } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Activity,
  BadgeCheck,
  BedDouble,
  Bell,
  BriefcaseMedical,
  Building2,
  CalendarClock,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Megaphone,
  PackageCheck,
  PartyPopper,
  ShieldCheck,
  Trophy,
  UserRoundCheck,
  Users,
  Wrench,
} from "lucide-react-native";

import type { Dashboard } from "@/lib/api";
import { colors, toneBackground, type Tone } from "@/design/system";
import { CheckLine, Eyebrow, PageTitle, PrimaryButton, SectionTitle, StatCard, StatusPill, TableHeader, sharedStyles } from "@/components/shared";

type AdminTab = "overview" | "housing" | "maintenance" | "health" | "activities";
type DoctorTab = "today" | "availability" | "records" | "campaigns";
type ClubTab = "overview" | "planning" | "resources" | "partners" | "certificates";

export function AdminPortal({ data }: { data: Dashboard }) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [scope, setScope] = useState("ONOU · National");
  return (
    <WebLayout
      eyebrow="ADMINISTRATION WEB PORTAL"
      title="National welfare supervision"
      subtitle="Role-based dashboard for ONOU, DOUs, establishments and residences."
      nav={[
        ["overview", "Overview", <LayoutDashboard size={18} />],
        ["housing", "Accommodation", <BedDouble size={18} />],
        ["maintenance", "Maintenance", <Wrench size={18} />],
        ["health", "Healthcare", <HeartPulse size={18} />],
        ["activities", "Activities", <PartyPopper size={18} />],
      ]}
      active={tab}
      onNavigate={(id) => setTab(id as AdminTab)}
      headerExtra={<ScopeSelect value={scope} onPress={() => setScope(scope === "ONOU · National" ? "DOUs · Regional" : "ONOU · National")} />}
    >
      {tab === "overview" ? <AdminOverview data={data} scope={scope} /> : null}
      {tab === "housing" ? <AdminHousing /> : null}
      {tab === "maintenance" ? <AdminMaintenance /> : null}
      {tab === "health" ? <AdminHealthcare /> : null}
      {tab === "activities" ? <AdminActivities /> : null}
    </WebLayout>
  );
}

function AdminOverview({ data, scope }: { data: Dashboard; scope: string }) {
  return (
    <Content>
      <Eyebrow>{scope.toUpperCase()}</Eyebrow>
      <PageTitle title="Administration console" text="Measure service performance, supervise escalations and open the workflows that require attention." />
      <View style={sharedStyles.grid}>
        {data.operations.onou.metrics.map((metric, index) => <StatCard key={metric.label} {...metric} tone={(["blue", "orange", "green", "purple"] as Tone[])[index]} />)}
      </View>
      <SectionTitle title="Priority alerts" text="Cases surfaced automatically by operational rules and SLA monitoring." />
      <View style={styles.twoColumns}>
        {data.operations.onou.alerts.map((alert) => <AlertCard key={alert.id} title={alert.title} text={alert.text} tone={alert.tone === "danger" ? "red" : "orange"} />)}
      </View>
      <SectionTitle title="Validation queue" text="National decisions and cross-level coordination." />
      <TableHeader columns={["Workflow", "Request", "Level", "Status"]} />
      {data.operations.onou.approvals.map((approval) => <TableRow key={approval.id} cells={[approval.title, approval.text, "ONOU", approval.status]} />)}
    </Content>
  );
}

function AdminHousing() {
  return (
    <Content>
      <Eyebrow>ACCOMMODATION SERVICE</Eyebrow>
      <PageTitle title="Smart housing operations" text="Automatic eligibility checks and FIFO room assignment with manual review only for flagged cases." />
      <View style={sharedStyles.grid}>
        <StatCard label="Applications" value="2,842" note="2026/2027 campaign" />
        <StatCard label="OCR auto-validated" value="89%" note="Manual review reduced" tone="green" />
        <StatCard label="Priority cases" value="146" note="Disability accommodations" tone="purple" />
        <StatCard label="Pending appeals" value="18" note="Manual decision required" tone="orange" />
      </View>
      <SectionTitle title="Smart validation engine" text="OCR extraction, eligibility rules and Ministry of Interior address verification." />
      <View style={styles.twoColumns}>
        <FeaturePanel title="Automatic eligibility rules" icon={<ShieldCheck color={colors.green} size={21} />} checks={["Enrollment status verified", "Age under 28 checked", "Distance threshold applied: 50 km / 30 km", "Academic record extracted", "Address checked through Ministry of Interior"]} />
        <FeaturePanel title="Inclusive assignment" icon={<UserRoundCheck color={colors.purple} size={21} />} checks={["Disability priority applied by the engine", "Individual / shared preference honored", "Mutual binôme confirmation", "FIFO queue maintained", "Fallback decision returned when unavailable"]} />
      </View>
      <SectionTitle title="Flagged applications" text="Agents review ambiguous documents and special cases." />
      <TableHeader columns={["Student", "OCR review", "Eligibility", "Preference", "Decision"]} />
      <TableRow cells={["Lina Kaci", "Verified", "Disability priority", "Accessible single room", "Assign"]} />
      <TableRow cells={["Samir Toumi", "Residence scan", "Manual review", "Shared · binôme", "Review"]} />
      <TableRow cells={["Yasmine Hadj", "Verified", "Eligible", "Shared · auto-match", "Queue"]} />
      <SectionTitle title="Post-assignment workflows" />
      <View style={sharedStyles.grid}>
        <WorkflowCard title="Appeals management" text="Manual review with complete audit trail." icon={<ClipboardList color={colors.purple} size={20} />} />
        <WorkflowCard title="Room swap matching" text="Compatible requests and available inventory." icon={<BedDouble color={colors.green} size={20} />} />
        <WorkflowCard title="Algérie Poste payment" text="Payment verification before room attribution." icon={<BadgeCheck color={colors.orange} size={20} />} />
      </View>
    </Content>
  );
}

function AdminMaintenance() {
  return (
    <Content>
      <Eyebrow>MAINTENANCE & COMPLAINTS</Eyebrow>
      <PageTitle title="Residence operations" text="Assign technicians, monitor deadlines and escalate overdue cases without mixing incidents and grievances." />
      <View style={sharedStyles.grid}>
        <StatCard label="Open incidents" value="27" note="Across residences" tone="orange" />
        <StatCard label="SLA alerts" value="6" note="Automatic escalation" tone="red" />
        <StatCard label="Proofs to review" value="9" note="Technician submissions" tone="blue" />
        <StatCard label="Open complaints" value="14" note="Noise, hygiene, behavior" tone="purple" />
      </View>
      <SectionTitle title="Maintenance lifecycle" text="Student report → admin review → technician assignment → proof → closure." />
      <TableHeader columns={["Ticket", "Location", "Technician", "SLA", "Status"]} />
      <TableRow cells={["MT-204 · Water leak", "El Alia · A-205", "K. Haddad", "42 min", "In progress"]} />
      <TableRow cells={["MT-211 · Heating", "El Alia · B-214", "Unassigned", "2h 10", "Assign"]} />
      <TableRow cells={["MT-190 · Lighting", "Bouraoui · C-101", "S. Merabet", "Overdue", "Escalated"]} tone="red" />
      <SectionTitle title="Separate grievance queue" text="Residence complaints follow their own triage and deadline-based DOUs escalation." />
      <TableHeader columns={["Complaint", "Category", "Residence", "Deadline", "Level"]} />
      <TableRow cells={["CP-081", "Noise", "El Alia", "Today 18:00", "Local"]} />
      <TableRow cells={["CP-074", "Hygiene", "Bouraoui", "Overdue", "DOUs"]} tone="orange" />
    </Content>
  );
}

function AdminHealthcare() {
  return (
    <Content>
      <Eyebrow>HEALTHCARE SERVICE</Eyebrow>
      <PageTitle title="Healthcare monitoring" text="Supervise appointment capacity and escalation indicators without accessing confidential clinical content." />
      <View style={sharedStyles.grid}>
        <StatCard label="Appointments today" value="146" note="84% planned" tone="green" />
        <StatCard label="Walk-in capacity" value="18" note="Available slots" />
        <StatCard label="Absence cases" value="4" note="1 escalated to DOUs" tone="orange" />
        <StatCard label="Campaign reach" value="8.2k" note="Students notified" tone="purple" />
      </View>
      <View style={styles.twoColumns}>
        <FeaturePanel title="Scheduling supervision" icon={<CalendarClock color={colors.navy} size={21} />} checks={["Doctor and psychologist availability", "Fixed 30-minute practitioner slots", "Planned, immediate and walk-in modes", "CNAS integration status", "No access to clinical medical content"]} />
        <FeaturePanel title="Absence escalation" icon={<CircleAlert color={colors.orange} size={21} />} checks={["Student absence signal received", "Local administrator acknowledgment", "Replacement or schedule adjustment", "Automatic DOUs escalation after deadline", "Full history available for audit"]} />
      </View>
      <SectionTitle title="Awareness campaigns" text="Prevention content can publish directly into the activities catalogue." />
      <TableHeader columns={["Campaign", "Publisher", "Format", "Linked event", "Reach"]} />
      <TableRow cells={["Mental health week", "ONOU", "Article + push", "Campus workshop", "4,210"]} />
      <TableRow cells={["Blood donation day", "ESI", "Event", "18 Jun · Auditorium", "1,842"]} />
    </Content>
  );
}

function AdminActivities() {
  return (
    <Content>
      <Eyebrow>ACTIVITIES & CLUBS SERVICE</Eyebrow>
      <PageTitle title="Activity planning" text="Coordinate local clubs, resources and national tournaments through a smart annual calendar." />
      <View style={sharedStyles.grid}>
        <StatCard label="Active clubs" value="124" note="National scope" />
        <StatCard label="Annual plans" value="42" note="7 need review" tone="orange" />
        <StatCard label="Resource conflicts" value="11" note="Alternatives suggested" tone="red" />
        <StatCard label="Engagement" value="12.4k" note="Student registrations" tone="green" />
      </View>
      <SectionTitle title="Smart annual planning" text="Historical learning, priority ranking, conflict detection and optimal alternative slots." />
      <TableHeader columns={["Event request", "Club", "Resources", "Smart planning", "Decision"]} />
      <TableRow cells={["AI & Robotics Hackathon", "ETIC", "Auditorium · projectors", "Optimal slot", "Approve"]} />
      <TableRow cells={["Inter-residence cup", "ONOU", "Stadium · transport", "No conflict", "Published"]} />
      <TableRow cells={["Cultural evening", "CSE", "Auditorium · sound", "Room conflict", "View alternatives"]} tone="orange" />
      <SectionTitle title="National tournament management" text="ONOU creates inter-university tournaments directly, without a validation chain." />
      <View style={styles.highlightCard}><Trophy color={colors.orange} size={25} /><View style={{ flex: 1 }}><Text style={styles.panelTitle}>National university basketball cup</Text><Text style={styles.panelText}>16 universities · 4 regional pools · registrations open</Text></View><PrimaryButton label="Supervise tournament" /></View>
    </Content>
  );
}

export function DoctorPortal() {
  const [tab, setTab] = useState<DoctorTab>("today");
  return (
    <WebLayout
      eyebrow="DOCTOR / PSYCHOLOGIST WEB PORTAL"
      title="Clinical workspace"
      subtitle="Practitioner interface with secure role-based access to medical records."
      nav={[
        ["today", "Today's consultations", <CalendarDays size={18} />],
        ["availability", "Availability", <CalendarClock size={18} />],
        ["records", "Medical records", <BriefcaseMedical size={18} />],
        ["campaigns", "Awareness", <Megaphone size={18} />],
      ]}
      active={tab}
      onNavigate={(id) => setTab(id as DoctorTab)}
      headerExtra={<StatusPill text="Encrypted zone" tone="green" />}
    >
      <Content>
        <Eyebrow>DR. SARA BELKACEM · ESI HEALTH UNIT</Eyebrow>
        <PageTitle title={tab === "today" ? "Today's consultations" : tab === "availability" ? "Availability planning" : tab === "records" ? "Secure medical records" : "Awareness campaigns"} text="Medical data remains physically separated, encrypted at rest and restricted to qualified healthcare personnel." />
        {tab === "today" ? <DoctorToday /> : null}
        {tab === "availability" ? <DoctorAvailability /> : null}
        {tab === "records" ? <DoctorRecords /> : null}
        {tab === "campaigns" ? <DoctorCampaigns /> : null}
      </Content>
    </WebLayout>
  );
}

function DoctorToday() {
  return (
    <>
      <View style={sharedStyles.grid}>
        <StatCard label="Planned" value="12" note="30-minute slots" />
        <StatCard label="Immediate" value="3" note="First available" tone="orange" />
        <StatCard label="Walk-ins" value="2" note="Accepted between slots" tone="green" />
      </View>
      <SectionTitle title="Consultation schedule" text="Open a patient record after identity verification." />
      <TableHeader columns={["Time", "Student", "Mode", "Reason", "Action"]} />
      <TableRow cells={["09:00", "Amel Bensalem", "Planned", "General consultation", "Open record"]} />
      <TableRow cells={["09:30", "Karim Saadi", "Immediate", "Acute pain", "Open record"]} tone="orange" />
      <TableRow cells={["10:00", "Walk-in buffer", "Walk-in", "Available", "Accept student"]} tone="green" />
      <View style={styles.secureNote}><ShieldCheck color={colors.green} size={21} /><Text style={styles.panelText}>Administrators can monitor capacity and performance, but never access clinical consultation content.</Text></View>
    </>
  );
}

function DoctorAvailability() {
  return (
    <>
      <SectionTitle title="Weekly slot configuration" text="Availability is divided into fixed 30-minute consultation slots." />
      <View style={styles.slotGrid}>
        {["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00"].map((slot, index) => <Text key={slot} style={[styles.slot, index === 3 && styles.slotBuffer]}>{slot}{index === 3 ? "\nWalk-in buffer" : ""}</Text>)}
      </View>
      <PrimaryButton label="Save weekly availability" />
    </>
  );
}

function DoctorRecords() {
  return (
    <>
      <SectionTitle title="Patient records" text="Read and write access follows the practitioner's authorized scope." />
      <TableHeader columns={["Student", "Scope", "Last consultation", "Record status", "Action"]} />
      <TableRow cells={["Amel Bensalem", "ESI Alger", "12 May 2026", "Encrypted", "Open record"]} />
      <TableRow cells={["Karim Saadi", "ESI Alger", "02 Apr 2026", "Encrypted", "Open record"]} />
      <TableRow cells={["Lina Kaci", "ESI Alger", "New patient", "Create securely", "Open record"]} />
    </>
  );
}

function DoctorCampaigns() {
  return (
    <>
      <SectionTitle title="Prevention content" text="Prepare articles, push notifications and healthcare events linked to the activities catalogue." />
      <View style={sharedStyles.grid}>
        <WorkflowCard title="Create article" text="Publish prevention advice within your authorized scope." icon={<FileText color={colors.navy} size={20} />} />
        <WorkflowCard title="Link an event" text="Blood donation, vaccination or workshop in the unified calendar." icon={<CalendarDays color={colors.orange} size={20} />} />
        <WorkflowCard title="Notify students" text="Dispatch in-app and push communication." icon={<Bell color={colors.green} size={20} />} />
      </View>
    </>
  );
}

export function ClubPortal() {
  const [tab, setTab] = useState<ClubTab>("overview");
  return (
    <WebLayout
      eyebrow="CLUB WEB PORTAL"
      title="Club planning workspace"
      subtitle="Annual plans, resources, partnerships and automatic certificates."
      nav={[
        ["overview", "Club overview", <LayoutDashboard size={18} />],
        ["planning", "Annual plan", <CalendarDays size={18} />],
        ["resources", "Resources", <PackageCheck size={18} />],
        ["partners", "Partners", <Users size={18} />],
        ["certificates", "Certificates", <FileCheck2 size={18} />],
      ]}
      active={tab}
      onNavigate={(id) => setTab(id as ClubTab)}
      headerExtra={<StatusPill text="Recognized club" tone="green" />}
    >
      <Content>
        <Eyebrow>ETIC CLUB · ESI ALGER</Eyebrow>
        <PageTitle title={tab === "overview" ? "Club overview" : tab === "planning" ? "Annual activity plan" : tab === "resources" ? "Resources & logistics" : tab === "partners" ? "Partners & speakers" : "Generated certificates"} text="Manage the full club lifecycle and coordinate events with the establishment administration." />
        {tab === "overview" ? <ClubOverview /> : null}
        {tab === "planning" ? <ClubPlanning /> : null}
        {tab === "resources" ? <ClubResources /> : null}
        {tab === "partners" ? <ClubPartners /> : null}
        {tab === "certificates" ? <ClubCertificates /> : null}
      </Content>
    </WebLayout>
  );
}

function ClubOverview() {
  return (
    <>
      <View style={sharedStyles.grid}>
        <StatCard label="Members" value="84" note="12 organizers" />
        <StatCard label="Planned events" value="8" note="2026/2027 plan" tone="orange" />
        <StatCard label="Registrations" value="642" note="This semester" tone="green" />
        <StatCard label="Certificates" value="184" note="Generated PDFs" tone="purple" />
      </View>
      <SectionTitle title="Upcoming milestones" />
      <TableHeader columns={["Event", "Date", "Planning", "Resources", "Status"]} />
      <TableRow cells={["AI & Robotics Hackathon", "12 Jun", "Optimal slot", "Approved", "Published"]} />
      <TableRow cells={["Career readiness workshop", "22 Jun", "Submitted", "Pending", "Review"]} tone="orange" />
    </>
  );
}

function ClubPlanning() {
  return (
    <>
      <View style={styles.highlightCard}><ChartNoAxesCombined color={colors.purple} size={25} /><View style={{ flex: 1 }}><Text style={styles.panelTitle}>Smart annual planning assistant</Text><Text style={styles.panelText}>Historical popularity, attendance per slot and priority ranking are used to propose the best calendar.</Text></View><PrimaryButton label="Add event request" /></View>
      <SectionTitle title="Annual activity plan" text="Conflicts are detected before submission and alternative slots are suggested." />
      <TableHeader columns={["Requested event", "Preferred date", "Priority", "Conflict analysis", "Status"]} />
      <TableRow cells={["AI & Robotics Hackathon", "12 Jun · 09:00", "High", "Optimal slot", "Validated"]} />
      <TableRow cells={["Cultural tech night", "23 Jun · 18:00", "Medium", "Auditorium conflict", "Choose alternative"]} tone="orange" />
      <TableRow cells={["Open-source workshop", "28 Jun · 14:00", "Medium", "No conflict", "Ready"]} />
    </>
  );
}

function ClubResources() {
  return (
    <>
      <SectionTitle title="Resources & logistics" text="Rooms, equipment and transport are checked against the academic calendar and existing reservations." />
      <TableHeader columns={["Request", "Event", "Resource", "Conflict detection", "Alternative"]} />
      <TableRow cells={["RS-210", "AI Hackathon", "Auditorium + projectors", "No conflict", "Confirmed"]} />
      <TableRow cells={["RS-218", "Tech night", "Auditorium + sound", "Room unavailable", "Room B12 · 18:30"]} tone="orange" />
      <TableRow cells={["RS-221", "Tournament visit", "Transport · 45 seats", "No conflict", "Confirmed"]} />
    </>
  );
}

function ClubPartners() {
  return (
    <>
      <SectionTitle title="External partners and speakers" text="Declare sponsors, associations and invited speakers for administrative traceability." />
      <TableHeader columns={["Partner", "Type", "Linked event", "Convention", "Status"]} />
      <TableRow cells={["CERIST", "Institutional partner", "AI Hackathon", "Convention attached", "Approved"]} />
      <TableRow cells={["Women in Tech DZ", "Association", "Career workshop", "Under review", "Review"]} tone="orange" />
    </>
  );
}

function ClubCertificates() {
  return (
    <>
      <SectionTitle title="Automatic certificates" text="Participation and organization certificates are generated as PDFs after attendance validation." />
      <View style={sharedStyles.grid}>
        <WorkflowCard title="Participation PDFs" text="164 certificates generated for the coding olympiad." icon={<FileCheck2 color={colors.green} size={21} />} />
        <WorkflowCard title="Organization PDFs" text="20 organizer certificates generated automatically." icon={<BadgeCheck color={colors.purple} size={21} />} />
      </View>
      <TableHeader columns={["Event", "Attendance validated", "Participant PDFs", "Organizer PDFs", "Action"]} />
      <TableRow cells={["National Coding Olympiad", "184 attendees", "164 ready", "20 ready", "Download archive"]} />
      <TableRow cells={["AI & Robotics Hackathon", "Upcoming", "After execution", "After execution", "View event"]} />
    </>
  );
}

function WebLayout({
  eyebrow,
  title,
  subtitle,
  nav,
  active,
  onNavigate,
  headerExtra,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  nav: [string, string, ReactNode][];
  active: string;
  onNavigate: (id: string) => void;
  headerExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.webShell}>
      <View style={styles.webBody}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>{title}</Text>
          <Text style={styles.sidebarText}>{subtitle}</Text>
          {headerExtra ? <View style={styles.sidebarContext}>{headerExtra}</View> : null}
          <View style={{ gap: 5, marginTop: 12 }}>
            {nav.map(([id, label, icon]) => <Pressable key={id} onPress={() => onNavigate(id)} style={[styles.sideItem, active === id && styles.sideItemActive]}>{icon}<Text style={[styles.sideText, active === id && { color: colors.white }]}>{label}</Text></Pressable>)}
          </View>
          <View style={styles.sovereign}><ShieldCheck color={colors.green} size={18} /><Text style={styles.sovereignText}>Sovereign hosting{"\n"}CERIST infrastructure</Text></View>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }} showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </View>
    </View>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <View style={{ gap: 17, maxWidth: 1100, width: "100%", alignSelf: "center" }}>{children}</View>;
}

function ScopeSelect({ value, onPress }: { value: string; onPress: () => void }) {
  return <Pressable style={styles.scopeSelect} onPress={onPress}><Building2 color={colors.navy} size={16} /><Text style={styles.scopeText}>{value}</Text><ChevronDown color={colors.muted} size={15} /></Pressable>;
}

function AlertCard({ title, text, tone }: { title: string; text: string; tone: Tone }) {
  return <View style={[styles.alertCard, { backgroundColor: toneBackground[tone] }]}><CircleAlert color={tone === "red" ? colors.red : colors.orange} size={21} /><View style={{ flex: 1 }}><Text style={styles.panelTitle}>{title}</Text><Text style={styles.panelText}>{text}</Text></View><ChevronRight color={colors.muted} size={17} /></View>;
}

function FeaturePanel({ title, icon, checks }: { title: string; icon: ReactNode; checks: string[] }) {
  return <View style={styles.panel}><View style={sharedStyles.row}>{icon}<Text style={styles.panelTitle}>{title}</Text></View>{checks.map((check) => <CheckLine key={check} text={check} />)}</View>;
}

function WorkflowCard({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return <View style={styles.workflowCard}><View style={styles.workflowIcon}>{icon}</View><Text style={styles.panelTitle}>{title}</Text><Text style={styles.panelText}>{text}</Text></View>;
}

function TableRow({ cells, tone }: { cells: string[]; tone?: Tone }) {
  return <View style={[styles.tableRow, tone ? { backgroundColor: toneBackground[tone] } : null]}>{cells.map((cell, index) => <Text key={`${cell}-${index}`} style={[styles.tableCell, index === cells.length - 1 && styles.tableLast]}>{cell}</Text>)}</View>;
}

const styles = StyleSheet.create({
  webShell: { flex: 1, minHeight: 0, backgroundColor: colors.canvas },
  webBody: { flex: 1, minHeight: 0, flexDirection: "row" },
  sidebar: { width: 222, backgroundColor: colors.navyDark, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 22, gap: 6 },
  sidebarTitle: { color: colors.white, fontSize: 15, fontWeight: "800" },
  sidebarText: { color: "#BFD2DF", fontSize: 10, lineHeight: 15 },
  sidebarContext: { marginTop: 8 },
  sideItem: { flexDirection: "row", gap: 9, alignItems: "center", padding: 10, borderRadius: 9 },
  sideItemActive: { backgroundColor: colors.orange },
  sideText: { color: "#BFD2DF", fontSize: 11, fontWeight: "700" },
  sovereign: { marginTop: "auto", padding: 11, gap: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 10, flexDirection: "row", alignItems: "center" },
  sovereignText: { color: "#D7E4EA", fontSize: 9, lineHeight: 14, fontWeight: "700" },
  scopeSelect: { flexDirection: "row", gap: 7, alignItems: "center", backgroundColor: colors.navySoft, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8 },
  scopeText: { color: colors.navy, fontSize: 11, fontWeight: "800" },
  twoColumns: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  alertCard: { flex: 1, minWidth: 260, borderRadius: 13, padding: 13, gap: 10, flexDirection: "row", alignItems: "center" },
  panel: { flex: 1, minWidth: 280, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 14, padding: 14, gap: 9 },
  panelTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  panelText: { color: colors.muted, fontSize: 10, lineHeight: 15 },
  workflowCard: { flexGrow: 1, flexBasis: 190, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 13, padding: 12, gap: 7 },
  workflowIcon: { height: 37, width: 37, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: colors.navySoft },
  tableRow: { flexDirection: "row", gap: 8, paddingVertical: 11, paddingHorizontal: 10, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 9 },
  tableCell: { flex: 1, color: colors.ink, fontSize: 10, lineHeight: 14 },
  tableLast: { color: colors.orange, fontWeight: "800" },
  highlightCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, backgroundColor: colors.orangeSoft },
  secureNote: { flexDirection: "row", alignItems: "center", gap: 9, borderRadius: 12, padding: 13, backgroundColor: colors.greenSoft },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { minWidth: 104, textAlign: "center", color: colors.navy, backgroundColor: colors.navySoft, borderRadius: 10, paddingVertical: 13, paddingHorizontal: 8, fontSize: 11, fontWeight: "800" },
  slotBuffer: { color: colors.orange, backgroundColor: colors.orangeSoft },
});
