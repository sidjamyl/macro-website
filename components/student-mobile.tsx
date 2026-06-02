import { useState, type ReactNode } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  Accessibility,
  BadgeCheck,
  BedDouble,
  Bell,
  BriefcaseMedical,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  FileCheck2,
  FileText,
  HeartPulse,
  Home,
  IdCard,
  MapPin,
  MessageSquareText,
  PartyPopper,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Users,
  WalletCards,
  Wrench,
  X,
} from "lucide-react-native";

import type { Dashboard, EventItem } from "@/lib/api";
import { api } from "@/lib/api";
import { BrandLogo } from "@/components/brand-logo";
import { colors, toneBackground, type Tone } from "@/design/system";
import { CheckLine, Eyebrow, FeatureCard, PageTitle, PrimaryButton, SectionTitle, StatusPill, sharedStyles } from "@/components/shared";

type StudentSection = "home" | "housing" | "health" | "activities";
type HousingAction = "application" | "maintenance" | "complaint" | "swap" | "appeal" | "sos";
type HealthAction = "appointment" | "record" | "absence";

export function StudentMobile({ data, onRefresh }: { data: Dashboard; onRefresh: () => Promise<void> }) {
  const [section, setSection] = useState<StudentSection>("home");
  const [housingAction, setHousingAction] = useState<HousingAction | null>(null);
  const [healthAction, setHealthAction] = useState<HealthAction | null>(null);
  const firstName = data.student.name.split(" ")[0];

  return (
    <View style={styles.phone}>
      <View style={styles.mobileHeader}>
        <View style={sharedStyles.row}>
          <BrandLogo size={34} />
          <View>
            <Text style={styles.brand}>e-tqan</Text>
            <Text style={styles.brandSub}>Smart welfare, brighter students</Text>
          </View>
        </View>
        <View style={styles.headerIcon}><Bell color={colors.white} size={17} /><Text style={styles.headerBadge}>{data.notifications}</Text></View>
      </View>

      {section === "home" ? (
        <StudentHome
          data={data}
          firstName={firstName}
          openHousing={(action) => { setSection("housing"); setHousingAction(action); }}
          openHealth={(action) => { setSection("health"); setHealthAction(action); }}
          openActivities={() => setSection("activities")}
        />
      ) : null}
      {section === "housing" ? <HousingHub data={data} openAction={setHousingAction} /> : null}
      {section === "health" ? <HealthHub data={data} openAction={setHealthAction} /> : null}
      {section === "activities" ? <ActivitiesHub events={data.events} onRefresh={onRefresh} /> : null}

      <StudentNav active={section} onSelect={setSection} />
      <HousingActionModal action={housingAction} onClose={() => setHousingAction(null)} data={data} onRefresh={onRefresh} />
      <HealthActionModal action={healthAction} onClose={() => setHealthAction(null)} data={data} onRefresh={onRefresh} />
    </View>
  );
}

function StudentHome({
  data,
  firstName,
  openHousing,
  openHealth,
  openActivities,
}: {
  data: Dashboard;
  firstName: string;
  openHousing: (action: HousingAction) => void;
  openHealth: (action: HealthAction) => void;
  openActivities: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={sharedStyles.spread}>
          <View style={{ gap: 4 }}>
            <Text style={styles.heroOverline}>GOOD EVENING</Text>
            <Text style={styles.heroTitle}>Hello, {firstName}</Text>
            <Text style={styles.heroText}>{data.student.establishment}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>{firstName[0]}</Text></View>
        </View>
        <View style={styles.heroDetail}><MapPin color={colors.cream} size={14} /><Text style={styles.heroDetailText}>{data.student.residence} · Room {data.student.room}</Text></View>
      </View>

      <SectionTitle title="What do you need?" text="Access every student welfare service from one place." />
      <View style={sharedStyles.grid}>
        <FeatureCard icon={<FileText color={colors.navy} size={22} />} title="Housing application" text="Inclusive form, OCR documents and eligibility check." tone="blue" badge="SMART" onPress={() => openHousing("application")} />
        <FeatureCard icon={<Stethoscope color={colors.brown} size={22} />} title="Book healthcare" text="Doctor or psychologist, planned or immediate slot." tone="cream" onPress={() => openHealth("appointment")} />
        <FeatureCard icon={<Wrench color={colors.orange} size={22} />} title="Report an incident" text="Send a photo and track the maintenance SLA." tone="orange" onPress={() => openHousing("maintenance")} />
        <FeatureCard icon={<PartyPopper color={colors.purple} size={22} />} title="Campus activities" text="Events, clubs, registrations and certificates." tone="purple" onPress={openActivities} />
        <FeatureCard icon={<RefreshCw color={colors.green} size={22} />} title="Room swap" text="Request another room or a roommate change." tone="green" onPress={() => openHousing("swap")} />
        <FeatureCard icon={<ShieldAlert color={colors.red} size={22} />} title="Emergency SOS" text="Alert residence security for urgent situations." tone="red" onPress={() => openHousing("sos")} />
      </View>

      <SectionTitle title="Your status" text="A quick view of your active services." />
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}><BedDouble color={colors.navy} size={20} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>Accommodation confirmed</Text>
          <Text style={styles.statusText}>{data.student.residence} · {data.student.room}</Text>
        </View>
        <StatusPill text="Active" />
      </View>
      <View style={styles.statusCard}>
        <View style={[styles.statusIcon, { backgroundColor: colors.orangeSoft }]}><HeartPulse color={colors.orange} size={20} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>Next consultation</Text>
          <Text style={styles.statusText}>{data.appointments[0]?.practitioner} · {data.appointments[0]?.date} {data.appointments[0]?.time}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function HousingHub({ data, openAction }: { data: Dashboard; openAction: (action: HousingAction) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Eyebrow>ACCOMMODATION</Eyebrow>
      <PageTitle title="Housing services" text="From the inclusive application to daily residence life, every step is traceable." />
      <View style={styles.assignmentCard}>
        <View style={sharedStyles.spread}>
          <View><Text style={styles.assignmentOverline}>ACTIVE ASSIGNMENT</Text><Text style={styles.assignmentRoom}>Room {data.student.room}</Text></View>
          <StatusPill text="Confirmed" />
        </View>
        <Text style={styles.assignmentText}>{data.student.residence}</Text>
        <View style={styles.progress}><View style={styles.progressFill} /></View>
        <Text style={styles.assignmentFoot}>2026/2027 assignment complete · Algérie Poste payment verified</Text>
      </View>
      <SectionTitle title="Housing journey" text="Explore each feature included in the platform." />
      <View style={sharedStyles.grid}>
        <FeatureCard icon={<FileCheck2 color={colors.navy} size={21} />} title="Apply for housing" text="OCR, eligibility rules, disability priority and payment." tone="blue" badge="START" onPress={() => openAction("application")} />
        <FeatureCard icon={<Wrench color={colors.orange} size={21} />} title="Maintenance" text="Report incidents with photos and follow resolution." tone="orange" onPress={() => openAction("maintenance")} />
        <FeatureCard icon={<MessageSquareText color={colors.brown} size={21} />} title="Complaints" text="Noise, hygiene or behavior with escalation tracking." tone="cream" onPress={() => openAction("complaint")} />
        <FeatureCard icon={<RefreshCw color={colors.green} size={21} />} title="Room swap" text="Match with another student or an available room." tone="green" onPress={() => openAction("swap")} />
        <FeatureCard icon={<ClipboardList color={colors.purple} size={21} />} title="Appeals" text="Submit a recours after rejection with audit trail." tone="purple" onPress={() => openAction("appeal")} />
        <FeatureCard icon={<ShieldAlert color={colors.red} size={21} />} title="SOS security" text="Priority alert to security and local administration." tone="red" onPress={() => openAction("sos")} />
      </View>
      <SectionTitle title="Recent maintenance" text="SLA-tracked interventions in your room." />
      {data.incidents.map((incident) => (
        <View key={incident.id} style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: colors.orangeSoft }]}><Wrench color={colors.orange} size={18} /></View>
          <View style={{ flex: 1 }}><Text style={styles.statusTitle}>{incident.title}</Text><Text style={styles.statusText}>{incident.location} · {incident.createdAt}</Text></View>
          <StatusPill text={incident.status} tone="orange" />
        </View>
      ))}
    </ScrollView>
  );
}

function HealthHub({ data, openAction }: { data: Dashboard; openAction: (action: HealthAction) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Eyebrow>STUDENT HEALTHCARE</Eyebrow>
      <PageTitle title="Campus healthcare" text="University doctors and psychologists, with confidential medical records hosted at CERIST." />
      <View style={styles.insuranceCard}><BadgeCheck color={colors.green} size={22} /><View><Text style={styles.statusTitle}>CNAS coverage verified</Text><Text style={styles.statusText}>Checked securely when booking an appointment</Text></View></View>
      <View style={sharedStyles.grid}>
        <FeatureCard icon={<CalendarDays color={colors.navy} size={21} />} title="Book appointment" text="Planned, immediate or walk-in availability." tone="blue" badge="3 MODES" onPress={() => openAction("appointment")} />
        <FeatureCard icon={<BriefcaseMedical color={colors.purple} size={21} />} title="Medical record" text="Encrypted continuous record, updated by practitioners." tone="purple" onPress={() => openAction("record")} />
        <FeatureCard icon={<CircleAlert color={colors.orange} size={21} />} title="Report absence" text="Signal a missing practitioner and trigger escalation." tone="orange" onPress={() => openAction("absence")} />
        <FeatureCard icon={<Sparkles color={colors.green} size={21} />} title="Awareness" text="Prevention articles and linked healthcare events." tone="green" />
      </View>
      <SectionTitle title="Upcoming consultations" />
      {data.appointments.map((appointment) => (
        <View key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.dateBox}><Text style={styles.dateMain}>{appointment.date}</Text><Text style={styles.dateSub}>{appointment.time}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.statusTitle}>{appointment.practitioner}</Text><Text style={styles.statusText}>{appointment.specialty}</Text><StatusPill text={appointment.mode === "immediate" ? "Immediate" : "Planned"} tone="blue" /></View>
        </View>
      ))}
    </ScrollView>
  );
}

function ActivitiesHub({ events, onRefresh }: { events: EventItem[]; onRefresh: () => Promise<void> }) {
  const register = async (event: EventItem) => {
    if (event.registered) return;
    try {
      await api.registerEvent(event.id);
      await onRefresh();
      Alert.alert("Registration confirmed", `You are registered for ${event.title}.`);
    } catch {
      Alert.alert("Demo mode", "Start the local API to persist registrations.");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Eyebrow>SCIENTIFIC · CULTURAL · SPORTING</Eyebrow>
      <PageTitle title="Activities & clubs" text="Discover events, register in one tap and retrieve your participation certificates." />
      <View style={sharedStyles.grid}>
        <FeatureCard icon={<PartyPopper color={colors.purple} size={21} />} title="Event catalogue" text="Validated local and inter-university events." tone="purple" badge="LIVE" />
        <FeatureCard icon={<Users color={colors.navy} size={21} />} title="Explore clubs" text="Discover missions, members and club activities." tone="blue" />
        <FeatureCard icon={<FileCheck2 color={colors.green} size={21} />} title="Certificates" text="Download participation certificates as PDFs." tone="green" badge="PDF" />
        <FeatureCard icon={<CalendarDays color={colors.orange} size={21} />} title="My registrations" text="Your event calendar and reminders." tone="orange" />
      </View>
      <SectionTitle title="Recommended events" text="Validated events open for registration." />
      {events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={sharedStyles.spread}><Text style={styles.eventCategory}>{event.category.toUpperCase()}</Text><Text style={styles.eventDate}>{event.date}</Text></View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={sharedStyles.row}><MapPin color={colors.muted} size={14} /><Text style={styles.statusText}>{event.location}</Text></View>
          <View style={sharedStyles.spread}>
            <Text style={styles.statusText}><Users size={12} /> {event.seats} seats left</Text>
            <Pressable style={[styles.miniButton, event.registered && styles.miniButtonDone]} onPress={() => register(event)}>
              <Text style={[styles.miniButtonText, event.registered && { color: colors.green }]}>{event.registered ? "Registered" : "Register"}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function HousingActionModal({ action, onClose, data, onRefresh }: { action: HousingAction | null; onClose: () => void; data: Dashboard; onRefresh: () => Promise<void> }) {
  if (!action) return null;
  if (action === "application") return <HousingApplicationModal open onClose={onClose} />;
  if (action === "maintenance") return <IncidentModal open onClose={onClose} room={data.student.room} onRefresh={onRefresh} />;
  const content = {
    complaint: { title: "File a residence complaint", text: "Complaints are separate from maintenance. Report noise, hygiene or behavior issues and track deadline-based escalation.", icon: <MessageSquareText color={colors.brown} size={28} />, button: "Submit complaint" },
    swap: { title: "Request a room swap", text: "Choose a residence or roommate change. The matching engine checks compatible outstanding requests and available rooms.", icon: <RefreshCw color={colors.green} size={28} />, button: "Find a compatible swap" },
    appeal: { title: "Submit an appeal", text: "If an application is rejected, add supporting information for a manual administrative review with a complete audit trail.", icon: <ClipboardList color={colors.purple} size={28} />, button: "Create appeal" },
    sos: { title: "Emergency SOS", text: "Send a priority medical or security alert to on-duty residence security and the local administrator.", icon: <ShieldAlert color={colors.red} size={30} />, button: "Dispatch SOS alert" },
  }[action];
  return (
    <BottomSheet open title={content.title} onClose={onClose}>
      <View style={[styles.sheetHero, { backgroundColor: action === "sos" ? colors.redSoft : colors.navySoft }]}>{content.icon}<Text style={styles.sheetHeroText}>{content.text}</Text></View>
      {action === "complaint" ? <TextInput style={sharedStyles.input} placeholder="Describe the issue: noise, hygiene or behavior..." placeholderTextColor={colors.muted} multiline /> : null}
      {action === "swap" ? <><SelectBox label="Requested change" value="Roommate change" /><SelectBox label="Preferred residence" value="Cite universitaire El Alia" /></> : null}
      {action === "appeal" ? <><TextInput style={sharedStyles.input} placeholder="Add supporting information..." placeholderTextColor={colors.muted} multiline /><CheckLine text="Supporting documents can be attached securely" /></> : null}
      <PrimaryButton label={content.button} tone={action === "sos" ? "red" : "navy"} onPress={() => { onClose(); Alert.alert("Demo action recorded", "The workflow is ready for the demonstration."); }} />
    </BottomSheet>
  );
}

function HousingApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [hasDisability, setHasDisability] = useState(true);
  const [roomPreference, setRoomPreference] = useState("Shared room");
  const [roommateMode, setRoommateMode] = useState("Choose my roommate");
  const steps = ["Profile", "Inclusion", "Documents", "Preferences", "Review"];

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.applicationSheet}>
          <View style={sharedStyles.spread}>
            <View><Eyebrow>SMART VALIDATION ENGINE</Eyebrow><Text style={styles.sheetTitle}>Housing application</Text></View>
            <Pressable style={styles.close} onPress={onClose}><X color={colors.ink} size={19} /></Pressable>
          </View>
          <View style={styles.steps}>
            {steps.map((item, index) => <View key={item} style={[styles.stepDot, index <= step && styles.stepDotActive]}><Text style={[styles.stepText, index <= step && { color: colors.white }]}>{index + 1}</Text></View>)}
          </View>
          <Text style={styles.stepLabel}>Step {step + 1} · {steps[step]}</Text>
          <ScrollView contentContainerStyle={{ gap: 11 }} showsVerticalScrollIndicator={false}>
            {step === 0 ? (
              <>
                <CheckLine text="Enrollment status retrieved from your university profile" />
                <CheckLine text="Age eligibility: under 28 years old" />
                <CheckLine text="Declared address ready for Ministry of Interior verification" />
                <SelectBox label="Academic year" value="2026 / 2027" />
                <SelectBox label="Current establishment" value="ESI Alger" />
              </>
            ) : null}
            {step === 1 ? (
              <>
                <View style={styles.inclusiveBanner}><Accessibility color={colors.navy} size={24} /><View style={{ flex: 1 }}><Text style={styles.statusTitle}>Inclusion by design</Text><Text style={styles.statusText}>Disability priority is applied directly by the eligibility and assignment engines.</Text></View></View>
                <Choice label="I have a disability situation to declare" selected={hasDisability} onPress={() => setHasDisability(true)} />
                <Choice label="No disability situation to declare" selected={!hasDisability} onPress={() => setHasDisability(false)} />
                {hasDisability ? <><SelectBox label="Required accommodation" value="Accessible room · Reduced mobility" /><CheckLine text="Supporting medical certificate attached securely" /></> : null}
              </>
            ) : null}
            {step === 2 ? (
              <>
                <DocumentRow icon={<IdCard color={colors.navy} size={18} />} title="Enrollment certificate" status="OCR extracted" />
                <DocumentRow icon={<MapPin color={colors.orange} size={18} />} title="Residence certificate" status="Address verified" />
                <DocumentRow icon={<FileText color={colors.purple} size={18} />} title="Academic record" status="OCR extracted" />
                {hasDisability ? <DocumentRow icon={<Accessibility color={colors.green} size={18} />} title="Disability certificate" status="Priority applied" /> : null}
                <View style={styles.ocrBox}><Camera color={colors.orange} size={19} /><Text style={styles.ocrText}>OCR extraction complete · ambiguous scans are routed to manual review.</Text></View>
              </>
            ) : null}
            {step === 3 ? (
              <>
                <Text style={sharedStyles.label}>Room preference</Text>
                <View style={styles.choiceRow}>
                  <Choice label="Individual room" selected={roomPreference === "Individual room"} onPress={() => setRoomPreference("Individual room")} />
                  <Choice label="Shared room" selected={roomPreference === "Shared room"} onPress={() => setRoomPreference("Shared room")} />
                </View>
                {roomPreference === "Shared room" ? (
                  <>
                    <Text style={sharedStyles.label}>Roommate (binôme) matching</Text>
                    <Choice label="Choose my roommate" selected={roommateMode === "Choose my roommate"} onPress={() => setRoommateMode("Choose my roommate")} />
                    <Choice label="Let e-tqan find a compatible roommate" selected={roommateMode !== "Choose my roommate"} onPress={() => setRoommateMode("Automatic matching")} />
                    {roommateMode === "Choose my roommate" ? <TextInput style={sharedStyles.input} placeholder="Roommate student ID" placeholderTextColor={colors.muted} /> : null}
                  </>
                ) : null}
              </>
            ) : null}
            {step === 4 ? (
              <>
                <CheckLine text="OCR documents extracted and checked" />
                <CheckLine text="Address verified through Ministry of Interior integration" />
                <CheckLine text="Distance eligibility: above the applicable threshold" />
                {hasDisability ? <CheckLine text="Disability priority enabled for assignment" /> : null}
                <CheckLine text={`Preference recorded: ${roomPreference}${roomPreference === "Shared room" ? ` · ${roommateMode}` : ""}`} />
                <View style={styles.paymentBox}><WalletCards color={colors.green} size={21} /><View><Text style={styles.statusTitle}>Algérie Poste payment</Text><Text style={styles.statusText}>Secure payment requested before final room attribution.</Text></View></View>
              </>
            ) : null}
          </ScrollView>
          <View style={styles.sheetFooter}>
            {step > 0 ? <Pressable style={styles.secondaryButton} onPress={() => setStep(step - 1)}><ChevronLeft color={colors.navy} size={17} /><Text style={styles.secondaryText}>Back</Text></Pressable> : <View />}
            <Pressable style={styles.nextButton} onPress={() => step < steps.length - 1 ? setStep(step + 1) : Alert.alert("Application ready", "The dossier enters the smart validation workflow.")}>
              <Text style={styles.nextText}>{step < steps.length - 1 ? "Continue" : "Submit dossier"}</Text><ChevronRight color={colors.white} size={17} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function IncidentModal({ open, onClose, room, onRefresh }: { open: boolean; onClose: () => void; room: string; onRefresh: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const submit = async () => {
    if (!title.trim()) return Alert.alert("Add a description", "Tell the residence team what needs attention.");
    await api.reportIncident({ title, location: `Room ${room}` });
    await onRefresh();
    onClose();
    Alert.alert("Incident reported", "An administrator can now assign a technician and track the SLA.");
  };
  return (
    <BottomSheet open={open} title="Report maintenance incident" onClose={onClose}>
      <TextInput value={title} onChangeText={setTitle} style={sharedStyles.input} placeholder="Example: water leak under the sink" placeholderTextColor={colors.muted} />
      <View style={styles.photoBox}><Camera color={colors.orange} size={20} /><Text style={styles.ocrText}>Attach a photo as evidence</Text></View>
      <CheckLine text={`Location pre-filled: Room ${room}`} />
      <CheckLine text="SLA tracking and automatic escalation enabled" />
      <PrimaryButton label="Send maintenance request" onPress={() => void submit()} />
    </BottomSheet>
  );
}

function HealthActionModal({ action, onClose, data, onRefresh }: { action: HealthAction | null; onClose: () => void; data: Dashboard; onRefresh: () => Promise<void> }) {
  const [mode, setMode] = useState<"planned" | "immediate" | "walk-in">("planned");
  const [specialty, setSpecialty] = useState("General medicine");
  if (!action) return null;
  if (action === "record") {
    return <BottomSheet open title="My medical record" onClose={onClose}><CheckLine text="Encrypted medical record hosted at CERIST" /><CheckLine text="Clinical content updated by qualified practitioners only" /><DocumentRow icon={<BriefcaseMedical color={colors.purple} size={18} />} title="Last consultation" status="General medicine · 12 May" /><DocumentRow icon={<FileText color={colors.navy} size={18} />} title="Medical certificate" status="Available securely" /><PrimaryButton label="Close record" onPress={onClose} /></BottomSheet>;
  }
  if (action === "absence") {
    return <BottomSheet open title="Report practitioner absence" onClose={onClose}><View style={styles.sheetHero}><CircleAlert color={colors.orange} size={25} /><Text style={styles.sheetHeroText}>The responsible local administrator is notified first. Unresolved cases are automatically escalated to DOUs.</Text></View><SelectBox label="Concerned appointment" value={`${data.appointments[0]?.practitioner} · ${data.appointments[0]?.date}`} /><TextInput style={sharedStyles.input} placeholder="Optional details" placeholderTextColor={colors.muted} /><PrimaryButton label="Signal absence" tone="orange" onPress={() => { onClose(); Alert.alert("Absence reported", "The escalation workflow has been opened."); }} /></BottomSheet>;
  }
  const book = async () => {
    if (mode !== "walk-in") {
      await api.bookAppointment({ specialty, mode });
      await onRefresh();
    }
    onClose();
    Alert.alert("Healthcare request confirmed", mode === "walk-in" ? "Current walk-in availability has been checked." : "Your appointment has been recorded securely.");
  };
  return (
    <BottomSheet open title="Book campus healthcare" onClose={onClose}>
      <View style={styles.insuranceCard}><BadgeCheck color={colors.green} size={20} /><View><Text style={styles.statusTitle}>CNAS coverage verified</Text><Text style={styles.statusText}>Secure insurance integration</Text></View></View>
      <Text style={sharedStyles.label}>Practitioner type</Text>
      <View style={styles.choiceRow}><Choice label="General medicine" selected={specialty === "General medicine"} onPress={() => setSpecialty("General medicine")} /><Choice label="Psychology" selected={specialty === "Psychology"} onPress={() => setSpecialty("Psychology")} /></View>
      <Text style={sharedStyles.label}>Booking mode</Text>
      <Choice label="Planned · choose a future 30-minute slot" selected={mode === "planned"} onPress={() => setMode("planned")} />
      <Choice label="Immediate · first available slot" selected={mode === "immediate"} onPress={() => setMode("immediate")} />
      <Choice label="Walk-in · check availability between slots" selected={mode === "walk-in"} onPress={() => setMode("walk-in")} />
      {mode === "planned" ? <SelectBox label="Available slot" value="09 Jun · 14:30 — 15:00" /> : null}
      {mode === "immediate" ? <CheckLine text="Next available slot found: Today · 11:00 — 11:30" /> : null}
      {mode === "walk-in" ? <CheckLine text="Walk-in currently available at the ESI health unit" /> : null}
      <PrimaryButton label={mode === "walk-in" ? "Confirm walk-in request" : "Confirm appointment"} onPress={() => void book()} />
    </BottomSheet>
  );
}

function BottomSheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={sharedStyles.spread}><Text style={styles.sheetTitle}>{title}</Text><Pressable style={styles.close} onPress={onClose}><X color={colors.ink} size={19} /></Pressable></View>
          <ScrollView contentContainerStyle={{ gap: 11 }} showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}><View style={[styles.radio, selected && styles.radioSelected]} /> <Text style={[styles.choiceText, selected && { color: colors.navy }]}>{label}</Text></Pressable>;
}

function SelectBox({ label, value }: { label: string; value: string }) {
  return <View style={{ gap: 5 }}><Text style={sharedStyles.label}>{label}</Text><View style={styles.selectBox}><Text style={styles.selectText}>{value}</Text><ChevronRight color={colors.muted} size={15} /></View></View>;
}

function DocumentRow({ icon, title, status }: { icon: ReactNode; title: string; status: string }) {
  return <View style={styles.documentRow}><View style={styles.documentIcon}>{icon}</View><View style={{ flex: 1 }}><Text style={styles.statusTitle}>{title}</Text><Text style={styles.statusText}>{status}</Text></View><BadgeCheck color={colors.green} size={17} /></View>;
}

function StudentNav({ active, onSelect }: { active: StudentSection; onSelect: (section: StudentSection) => void }) {
  const items: { id: StudentSection; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "housing", label: "Housing", icon: BedDouble },
    { id: "health", label: "Health", icon: HeartPulse },
    { id: "activities", label: "Activities", icon: CalendarDays },
  ];
  return <View style={styles.nav}>{items.map((item) => { const Icon = item.icon; const selected = item.id === active; return <Pressable key={item.id} style={styles.navItem} onPress={() => onSelect(item.id)}><Icon color={selected ? colors.orange : colors.muted} size={19} /><Text style={[styles.navText, selected && { color: colors.orange }]}>{item.label}</Text></Pressable>; })}</View>;
}

const styles = StyleSheet.create({
  phone: { flex: 1, width: "100%", maxWidth: 430, minHeight: 0, backgroundColor: "#FCFBF8", alignSelf: "center", overflow: "hidden" },
  mobileHeader: { height: 64, backgroundColor: colors.navy, paddingHorizontal: 17, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: colors.white, fontSize: 23, fontWeight: "800", letterSpacing: -1 },
  brandSub: { color: "#BFD2DF", fontSize: 9 },
  headerIcon: { width: 35, height: 35, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)" },
  headerBadge: { position: "absolute", top: -3, right: -3, backgroundColor: colors.orange, color: colors.white, fontSize: 8, fontWeight: "800", borderRadius: 8, minWidth: 16, textAlign: "center", paddingVertical: 3 },
  scroll: { padding: 15, gap: 15, paddingBottom: 78 },
  hero: { backgroundColor: colors.navy, borderRadius: 19, padding: 16, gap: 14 },
  heroOverline: { color: "#A9C6D8", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: "800" },
  heroText: { color: "#D7E4EA", fontSize: 11 },
  avatar: { height: 43, width: 43, borderRadius: 22, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: "800" },
  heroDetail: { backgroundColor: "rgba(255,255,255,0.10)", flexDirection: "row", gap: 7, padding: 10, borderRadius: 11 },
  heroDetailText: { color: colors.cream, fontSize: 10, fontWeight: "700", flex: 1 },
  statusCard: { borderColor: colors.line, borderWidth: 1, backgroundColor: colors.white, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  statusIcon: { height: 39, width: 39, borderRadius: 11, backgroundColor: colors.navySoft, alignItems: "center", justifyContent: "center" },
  statusTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  statusText: { color: colors.muted, fontSize: 10, lineHeight: 14, marginTop: 2 },
  assignmentCard: { backgroundColor: colors.navy, borderRadius: 16, padding: 15, gap: 9 },
  assignmentOverline: { color: "#A9C6D8", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  assignmentRoom: { color: colors.white, fontSize: 23, fontWeight: "800", marginTop: 3 },
  assignmentText: { color: "#D7E4EA", fontSize: 11 },
  progress: { height: 5, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", width: "100%", backgroundColor: colors.orange },
  assignmentFoot: { color: "#BFD2DF", fontSize: 9 },
  insuranceCard: { flexDirection: "row", alignItems: "center", gap: 9, padding: 12, borderRadius: 13, backgroundColor: colors.greenSoft },
  appointmentCard: { borderColor: colors.line, borderWidth: 1, backgroundColor: colors.white, borderRadius: 14, flexDirection: "row", gap: 10, padding: 11 },
  dateBox: { width: 57, height: 57, backgroundColor: colors.navySoft, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  dateMain: { color: colors.navy, fontSize: 12, fontWeight: "800" },
  dateSub: { color: colors.muted, fontSize: 10, marginTop: 3 },
  eventCard: { borderColor: colors.line, borderWidth: 1, backgroundColor: colors.white, borderRadius: 14, padding: 12, gap: 8 },
  eventCategory: { color: colors.orange, fontSize: 9, fontWeight: "800", letterSpacing: 0.7 },
  eventDate: { color: colors.navy, fontSize: 11, fontWeight: "800" },
  eventTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  miniButton: { backgroundColor: colors.orange, borderRadius: 9, paddingVertical: 7, paddingHorizontal: 11 },
  miniButtonDone: { backgroundColor: colors.greenSoft },
  miniButtonText: { color: colors.white, fontSize: 10, fontWeight: "800" },
  nav: { position: "absolute", left: 0, right: 0, bottom: 0, height: 64, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row" },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { color: colors.muted, fontSize: 9, fontWeight: "700" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(13,53,84,0.48)" },
  bottomSheet: { alignSelf: "center", width: "100%", maxWidth: 500, maxHeight: "86%", backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 17, gap: 13 },
  applicationSheet: { alignSelf: "center", width: "100%", maxWidth: 540, height: "92%", backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 17, gap: 12 },
  sheetTitle: { color: colors.ink, fontSize: 18, fontWeight: "800" },
  close: { height: 33, width: 33, borderRadius: 17, backgroundColor: "#F1F4F5", alignItems: "center", justifyContent: "center" },
  sheetHero: { borderRadius: 13, backgroundColor: colors.navySoft, padding: 13, gap: 9, flexDirection: "row", alignItems: "center" },
  sheetHeroText: { color: colors.ink, flex: 1, fontSize: 11, lineHeight: 16 },
  choice: { flexDirection: "row", gap: 7, alignItems: "center", borderColor: colors.line, borderWidth: 1, padding: 10, borderRadius: 10, flexGrow: 1 },
  choiceSelected: { borderColor: colors.navy, backgroundColor: colors.navySoft },
  choiceText: { color: colors.muted, fontSize: 11, flexShrink: 1 },
  choiceRow: { flexDirection: "row", gap: 8 },
  radio: { height: 13, width: 13, borderRadius: 7, borderWidth: 1, borderColor: colors.muted },
  radioSelected: { borderWidth: 4, borderColor: colors.navy, backgroundColor: colors.white },
  selectBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderColor: colors.line, borderWidth: 1, borderRadius: 10, padding: 11 },
  selectText: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  documentRow: { flexDirection: "row", alignItems: "center", gap: 9, borderColor: colors.line, borderWidth: 1, borderRadius: 11, padding: 10 },
  documentIcon: { height: 35, width: 35, borderRadius: 9, backgroundColor: colors.navySoft, alignItems: "center", justifyContent: "center" },
  inclusiveBanner: { borderRadius: 13, flexDirection: "row", gap: 9, alignItems: "center", padding: 12, backgroundColor: colors.navySoft },
  ocrBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.orangeSoft, borderRadius: 11, padding: 11 },
  photoBox: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.orangeSoft, borderRadius: 11, padding: 16, borderStyle: "dashed", borderWidth: 1, borderColor: colors.orange },
  ocrText: { color: colors.brown, fontSize: 11, lineHeight: 15, flex: 1 },
  paymentBox: { flexDirection: "row", alignItems: "center", gap: 9, padding: 12, borderRadius: 11, backgroundColor: colors.greenSoft },
  steps: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 3 },
  stepDot: { height: 25, width: 25, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF1F2" },
  stepDotActive: { backgroundColor: colors.orange },
  stepText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  stepLabel: { color: colors.navy, fontSize: 11, fontWeight: "800" },
  sheetFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
  secondaryButton: { flexDirection: "row", gap: 3, alignItems: "center", padding: 11 },
  secondaryText: { color: colors.navy, fontSize: 11, fontWeight: "800" },
  nextButton: { flexDirection: "row", gap: 4, alignItems: "center", backgroundColor: colors.navy, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10 },
  nextText: { color: colors.white, fontSize: 11, fontWeight: "800" },
});
