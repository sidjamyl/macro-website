import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, Camera, CheckCircle2, ClipboardCheck, MapPin, ShieldAlert, UserCheck, Wrench } from "lucide-react-native";

import type { Dashboard, MaintenanceTask } from "@/lib/api";
import { api } from "@/lib/api";
import { colors } from "@/design/system";
import { Eyebrow, PageTitle, PrimaryButton, SectionTitle, StatusPill, sharedStyles } from "@/components/shared";

type OpsTab = "tasks" | "security" | "checks";

export function OperationsMobile({ data, onRefresh }: { data: Dashboard; onRefresh: () => Promise<void> }) {
  const [tab, setTab] = useState<OpsTab>("tasks");
  const operations = data.operations.maintenance;
  const updateTask = async (task: MaintenanceTask) => {
    const status = task.status === "Assigned" ? "In progress" : "Completed";
    await api.updateTask(task.id, status);
    await onRefresh();
    Alert.alert("Intervention updated", status === "Completed" ? "Proof can now be reviewed by the residence administrator." : "The task timer has started.");
  };
  return (
    <View style={styles.phone}>
      <View style={styles.header}>
        <View><Text style={styles.brand}>e-tqan ops</Text><Text style={styles.brandSub}>Field operations mobile app</Text></View>
        <View style={styles.headerIcon}><Bell color={colors.white} size={17} /></View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Eyebrow>ON-SITE OPERATIONS</Eyebrow>
        <PageTitle title={`Hello, ${operations.agent.split(" ")[0]}`} text={`${operations.residence} · Mobile intervention console`} />
        <View style={styles.segment}>
          <Segment label="Tasks" active={tab === "tasks"} onPress={() => setTab("tasks")} />
          <Segment label="Security" active={tab === "security"} onPress={() => setTab("security")} />
          <Segment label="Checks" active={tab === "checks"} onPress={() => setTab("checks")} />
        </View>
        {tab === "tasks" ? (
          <>
            <View style={styles.summary}>
              <MiniStat value={`${operations.tasks.filter((task) => task.status !== "Completed").length}`} label="Open tasks" />
              <MiniStat value={`${operations.tasks.filter((task) => task.priority === "High").length}`} label="High priority" />
              <MiniStat value="02:10" label="Avg. SLA left" />
            </View>
            <SectionTitle title="Assigned interventions" text="Start tasks on-site, submit proof and close the intervention." />
            {operations.tasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={sharedStyles.spread}><StatusPill text={task.priority} tone={task.priority === "High" ? "red" : "blue"} /><Text style={styles.deadline}>{task.deadline}</Text></View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={sharedStyles.row}><MapPin color={colors.muted} size={14} /><Text style={styles.taskText}>{task.location}</Text></View>
                <View style={styles.taskFooter}>
                  <Text style={styles.taskStatus}>{task.status}</Text>
                  {task.status !== "Completed" ? <Pressable style={styles.taskButton} onPress={() => void updateTask(task)}><Text style={styles.taskButtonText}>{task.status === "Assigned" ? "Start task" : "Submit proof"}</Text></Pressable> : <CheckCircle2 color={colors.green} size={21} />}
                </View>
              </View>
            ))}
          </>
        ) : null}
        {tab === "security" ? (
          <>
            <SectionTitle title="Priority alerts" text="SOS events dispatched from student residences." />
            <View style={[styles.taskCard, { borderColor: "#F0BBBB" }]}>
              <View style={sharedStyles.spread}><StatusPill text="SOS · MEDICAL" tone="red" /><Text style={styles.deadline}>2 min ago</Text></View>
              <Text style={styles.taskTitle}>Student requested urgent assistance</Text>
              <View style={sharedStyles.row}><MapPin color={colors.red} size={14} /><Text style={styles.taskText}>Building B · Room 118</Text></View>
              <PrimaryButton label="Acknowledge and dispatch" tone="red" onPress={() => Alert.alert("Alert acknowledged", "Security dispatch has been recorded.")} />
            </View>
            <View style={styles.taskCard}>
              <View style={sharedStyles.spread}><StatusPill text="SECURITY" tone="orange" /><Text style={styles.deadline}>18 min ago</Text></View>
              <Text style={styles.taskTitle}>Residence access assistance</Text>
              <View style={sharedStyles.row}><MapPin color={colors.orange} size={14} /><Text style={styles.taskText}>Main entrance · El Alia</Text></View>
            </View>
          </>
        ) : null}
        {tab === "checks" ? (
          <>
            <SectionTitle title="Field verifications" text="Tasks for residence welfare agents." />
            <Verification icon={<UserCheck color={colors.navy} size={20} />} title="Resident identity check" text="6 arrivals require identity and room verification." />
            <Verification icon={<ClipboardCheck color={colors.orange} size={20} />} title="Room inventory inspection" text="Building C · Floor 2 preventive inspection." />
            <Verification icon={<Camera color={colors.green} size={20} />} title="Maintenance proof review" text="3 completed interventions need photo evidence." />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentActive]}><Text style={[styles.segmentText, active && { color: colors.white }]}>{label}</Text></Pressable>;
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return <View style={{ alignItems: "center", gap: 3 }}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function Verification({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <View style={styles.verifyCard}><View style={styles.verifyIcon}>{icon}</View><View style={{ flex: 1 }}><Text style={styles.taskTitle}>{title}</Text><Text style={styles.taskText}>{text}</Text></View></View>;
}

const styles = StyleSheet.create({
  phone: { flex: 1, width: "100%", maxWidth: 430, minHeight: 0, backgroundColor: "#FCFBF8", alignSelf: "center", overflow: "hidden" },
  header: { height: 64, backgroundColor: colors.navy, paddingHorizontal: 17, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: colors.white, fontSize: 20, fontWeight: "800" },
  brandSub: { color: "#BFD2DF", fontSize: 9 },
  headerIcon: { width: 35, height: 35, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  scroll: { padding: 15, gap: 14, paddingBottom: 30 },
  segment: { flexDirection: "row", padding: 4, gap: 4, backgroundColor: "#EDF1F3", borderRadius: 12 },
  segmentButton: { flex: 1, borderRadius: 9, paddingVertical: 9, alignItems: "center" },
  segmentActive: { backgroundColor: colors.navy },
  segmentText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  summary: { backgroundColor: colors.navy, borderRadius: 15, padding: 14, flexDirection: "row", justifyContent: "space-around" },
  statValue: { color: colors.white, fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#BFD2DF", fontSize: 9, fontWeight: "700" },
  taskCard: { borderColor: colors.line, borderWidth: 1, backgroundColor: colors.white, borderRadius: 14, padding: 12, gap: 9 },
  deadline: { color: colors.muted, fontSize: 10, fontWeight: "700" },
  taskTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  taskText: { color: colors.muted, flex: 1, fontSize: 10, lineHeight: 14 },
  taskFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopColor: colors.line, borderTopWidth: 1, paddingTop: 9 },
  taskStatus: { color: colors.orange, fontSize: 10, fontWeight: "800" },
  taskButton: { backgroundColor: colors.navy, borderRadius: 9, paddingVertical: 8, paddingHorizontal: 11 },
  taskButtonText: { color: colors.white, fontSize: 10, fontWeight: "800" },
  verifyCard: { flexDirection: "row", gap: 10, alignItems: "center", borderColor: colors.line, borderWidth: 1, backgroundColor: colors.white, borderRadius: 14, padding: 12 },
  verifyIcon: { height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: colors.navySoft },
});
