import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown, Monitor, Smartphone, UserCog, Users, Wrench } from "lucide-react-native";

import { StudentMobile } from "@/components/student-mobile";
import { OperationsMobile } from "@/components/operations-mobile";
import { AdminPortal, ClubPortal, DoctorPortal } from "@/components/web-portals";
import { colors, shadow } from "@/design/system";
import { api, type Dashboard } from "@/lib/api";

type DemoRole = "student" | "operations" | "admin" | "doctor" | "club";

const roles: { id: DemoRole; label: string; surface: string; icon: ReactNode }[] = [
  { id: "student", label: "Student", surface: "Mobile app", icon: <Smartphone size={16} /> },
  { id: "operations", label: "Operations staff", surface: "Mobile app", icon: <Wrench size={16} /> },
  { id: "admin", label: "ONOU administrator", surface: "Web portal", icon: <UserCog size={16} /> },
  { id: "doctor", label: "Doctor / psychologist", surface: "Web portal", icon: <Monitor size={16} /> },
  { id: "club", label: "Club representative", surface: "Web portal", icon: <Users size={16} /> },
];

const fallback: Dashboard = {
  student: { name: "Amel Bensalem", establishment: "ESI Alger", residence: "Cite universitaire El Alia", room: "B-214" },
  notifications: 3,
  housing: { status: "Room assigned", completion: 100, nextStep: "Your accommodation is active for 2026/2027" },
  appointments: [{ id: "apt-1", practitioner: "Dr. Sara Belkacem", specialty: "General medicine", date: "05 Jun", time: "10:30", mode: "planned" }],
  incidents: [{ id: "inc-1", title: "Heating issue", location: "Room B-214", status: "Assigned", createdAt: "01 Jun" }],
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
        { id: "approval-3", title: "Awareness campaign", text: "Mental health week publication", status: "Ready" },
      ],
    },
    maintenance: {
      agent: "Karim Haddad",
      residence: "Cite universitaire El Alia",
      tasks: [
        { id: "task-1", title: "Heating issue", location: "Building B - Room 214", priority: "High", status: "Assigned", deadline: "Today, 16:00" },
        { id: "task-2", title: "Water leak", location: "Building A - Floor 2", priority: "High", status: "In progress", deadline: "Today, 14:30" },
        { id: "task-3", title: "Replace corridor light", location: "Building C - Floor 1", priority: "Low", status: "Assigned", deadline: "Tomorrow, 10:00" },
      ],
    },
  },
};

export default function Demo() {
  const [data, setData] = useState<Dashboard>(fallback);
  const [role, setRole] = useState<DemoRole>("student");
  const [selectOpen, setSelectOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setData(await api.dashboard());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const selectedRole = roles.find((item) => item.id === role) ?? roles[0];
  const mobile = role === "student" || role === "operations";

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.demoBar}>
        <View style={styles.demoIdentity}>
          <View style={styles.logoMark}><Text style={styles.logoText}>e</Text></View>
          <View>
            <Text style={styles.demoTitle}>e-tqan interactive prototype</Text>
            <Text style={styles.demoSubtitle}>Switch roles to explore each dedicated interface</Text>
          </View>
        </View>
        <View style={{ zIndex: 30 }}>
          <Pressable style={styles.roleSelect} onPress={() => setSelectOpen(!selectOpen)}>
            <View style={styles.roleIcon}>{selectedRole.icon}</View>
            <View>
              <Text style={styles.roleLabel}>{selectedRole.label}</Text>
              <Text style={styles.roleSurface}>{selectedRole.surface}</Text>
            </View>
            <ChevronDown color={colors.muted} size={16} />
          </Pressable>
          {selectOpen ? (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownTitle}>DEMO PERSONA</Text>
              {roles.map((item) => (
                <Pressable
                  key={item.id}
                  style={[styles.dropdownItem, item.id === role && styles.dropdownItemActive]}
                  onPress={() => { setRole(item.id); setSelectOpen(false); }}
                >
                  <View style={[styles.dropdownIcon, item.id === role && { backgroundColor: colors.orange }]}>{item.icon}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dropdownLabel, item.id === role && { color: colors.navy }]}>{item.label}</Text>
                    <Text style={styles.dropdownSurface}>{item.surface}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View style={[styles.stage, mobile && styles.mobileStage]}>
        {loading ? <ActivityIndicator color={colors.orange} size="large" /> : null}
        {!loading && role === "student" ? <StudentMobile data={data} onRefresh={refresh} /> : null}
        {!loading && role === "operations" ? <OperationsMobile data={data} onRefresh={refresh} /> : null}
        {!loading && role === "admin" ? <AdminPortal data={data} /> : null}
        {!loading && role === "doctor" ? <DoctorPortal /> : null}
        {!loading && role === "club" ? <ClubPortal /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  demoBar: { height: 70, zIndex: 20, backgroundColor: colors.white, borderBottomColor: colors.line, borderBottomWidth: 1, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  demoIdentity: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoMark: { height: 38, width: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy },
  logoText: { color: colors.orange, fontSize: 25, fontWeight: "800" },
  demoTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  demoSubtitle: { color: colors.muted, fontSize: 10, marginTop: 2 },
  roleSelect: { minWidth: 205, borderColor: colors.line, borderWidth: 1, borderRadius: 11, backgroundColor: colors.white, paddingHorizontal: 9, paddingVertical: 8, flexDirection: "row", gap: 8, alignItems: "center" },
  roleIcon: { color: colors.navy, height: 28, width: 28, borderRadius: 8, backgroundColor: colors.navySoft, alignItems: "center", justifyContent: "center" },
  roleLabel: { color: colors.ink, fontSize: 11, fontWeight: "800" },
  roleSurface: { color: colors.muted, fontSize: 9, marginTop: 1 },
  dropdown: { ...shadow, position: "absolute", top: 53, right: 0, width: 260, backgroundColor: colors.white, borderRadius: 12, borderColor: colors.line, borderWidth: 1, padding: 8, gap: 3 },
  dropdownTitle: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1, paddingHorizontal: 7, paddingVertical: 5 },
  dropdownItem: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 9, padding: 7 },
  dropdownItemActive: { backgroundColor: colors.orangeSoft },
  dropdownIcon: { color: colors.navy, height: 30, width: 30, borderRadius: 8, backgroundColor: colors.navySoft, alignItems: "center", justifyContent: "center" },
  dropdownLabel: { color: colors.ink, fontSize: 11, fontWeight: "800" },
  dropdownSurface: { color: colors.muted, fontSize: 9, marginTop: 1 },
  stage: { flex: 1, justifyContent: "center" },
  mobileStage: { paddingHorizontal: 12 },
});
