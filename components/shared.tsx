import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, CircleCheck, CircleAlert } from "lucide-react-native";

import { colors, shadow, toneBackground, type Tone } from "@/design/system";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function PageTitle({ title, text }: { title: string; text: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.pageText}>{text}</Text>
    </View>
  );
}

export function SectionTitle({ title, text, action }: { title: string; text?: string; action?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionHeading}>{title}</Text>
        {text ? <Text style={styles.sectionText}>{text}</Text> : null}
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function FeatureCard({
  icon,
  title,
  text,
  tone = "blue",
  badge,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone?: Tone;
  badge?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={[styles.featureCard, { backgroundColor: toneBackground[tone] }]} onPress={onPress}>
      <View style={styles.featureTop}>
        <View style={styles.featureIcon}>{icon}</View>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
      {onPress ? <ChevronRight color={colors.muted} size={16} /> : null}
    </Pressable>
  );
}

export function StatCard({ label, value, note, tone = "blue" }: { label: string; value: string; note: string; tone?: Tone }) {
  return (
    <View style={[styles.statCard, { backgroundColor: toneBackground[tone] }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statNote}>{note}</Text>
    </View>
  );
}

export function StatusPill({ text, tone = "green" }: { text: string; tone?: Tone }) {
  const textColor = tone === "red" ? colors.red : tone === "orange" ? colors.orange : tone === "purple" ? colors.purple : colors.green;
  return <Text style={[styles.statusPill, { backgroundColor: toneBackground[tone], color: textColor }]}>{text}</Text>;
}

export function PrimaryButton({ label, onPress, tone = "navy" }: { label: string; onPress?: () => void; tone?: "navy" | "orange" | "red" }) {
  const backgroundColor = tone === "orange" ? colors.orange : tone === "red" ? colors.red : colors.navy;
  return (
    <Pressable style={[styles.primaryButton, { backgroundColor }]} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function CheckLine({ text, warning }: { text: string; warning?: boolean }) {
  return (
    <View style={styles.checkLine}>
      {warning ? <CircleAlert color={colors.orange} size={17} /> : <CircleCheck color={colors.green} size={17} />}
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

export function TableHeader({ columns }: { columns: string[] }) {
  return (
    <View style={styles.tableHeader}>
      {columns.map((column) => <Text key={column} style={styles.tableHeaderText}>{column}</Text>)}
    </View>
  );
}

export const sharedStyles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 15, gap: 10 },
  softCard: { borderRadius: 16, padding: 15, gap: 9, backgroundColor: colors.navySoft },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  spread: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  input: { borderColor: colors.line, borderWidth: 1, borderRadius: 11, backgroundColor: colors.white, padding: 12, color: colors.ink, fontSize: 12 },
  label: { color: colors.ink, fontSize: 11, fontWeight: "800" },
  muted: { color: colors.muted, fontSize: 11, lineHeight: 16 },
});

const styles = StyleSheet.create({
  eyebrow: { color: colors.orange, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  pageTitle: { color: colors.ink, fontSize: 25, fontWeight: "800", letterSpacing: -0.8 },
  pageText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  sectionTitle: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  sectionHeading: { color: colors.ink, fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  sectionText: { color: colors.muted, fontSize: 11, marginTop: 3 },
  sectionAction: { color: colors.orange, fontSize: 11, fontWeight: "800" },
  featureCard: { width: "48.4%", minHeight: 132, padding: 13, borderRadius: 15, gap: 7 },
  featureTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  featureIcon: { height: 28, justifyContent: "center" },
  badge: { color: colors.orange, backgroundColor: colors.white, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, fontSize: 8, fontWeight: "800" },
  featureTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  featureText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 14 },
  statCard: { flexGrow: 1, flexBasis: 150, borderRadius: 14, padding: 14, gap: 4 },
  statValue: { color: colors.navy, fontSize: 24, fontWeight: "800" },
  statLabel: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  statNote: { color: colors.muted, fontSize: 10 },
  statusPill: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, fontSize: 9, fontWeight: "800" },
  primaryButton: { alignItems: "center", justifyContent: "center", borderRadius: 11, paddingHorizontal: 14, paddingVertical: 12 },
  primaryButtonText: { color: colors.white, fontSize: 12, fontWeight: "800" },
  checkLine: { flexDirection: "row", alignItems: "center", gap: 7 },
  checkText: { color: colors.ink, fontSize: 11, flex: 1 },
  tableHeader: { borderRadius: 10, backgroundColor: colors.navySoft, flexDirection: "row", padding: 11, gap: 8 },
  tableHeaderText: { color: colors.navy, flex: 1, fontSize: 10, fontWeight: "800" },
});
