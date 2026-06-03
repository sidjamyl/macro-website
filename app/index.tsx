import { useRef } from "react";
import type { ReactNode } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  DraftingCompass,
  Layers3,
  LineChart,
  MonitorCog,
  Palette,
  Rocket,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react-native";

import { BrandLogo } from "@/components/brand-logo";
import { colors } from "@/design/system";

type SectionKey = "expertise" | "method" | "references" | "contact";

const navigation: { label: string; target: SectionKey }[] = [
  { label: "Expertises", target: "expertise" },
  { label: "Méthode", target: "method" },
  { label: "Références", target: "references" },
  { label: "Contact", target: "contact" },
];

const mosaic = [
  colors.navy,
  colors.orange,
  colors.white,
  colors.navySoft,
  colors.creamSoft,
  colors.white,
  colors.navyDark,
  colors.navyDark,
  colors.white,
  colors.orangeSoft,
  colors.navy,
  colors.navySoft,
  colors.white,
  colors.greenSoft,
  colors.white,
  colors.white,
  colors.cream,
  colors.orange,
  colors.white,
  colors.navyDark,
  colors.navyDark,
  colors.white,
  colors.white,
  colors.creamSoft,
  colors.navySoft,
];

const metrics = [
  { value: "40", label: "collaborateurs", note: "design, développement, data, QA et DevOps" },
  { value: "2016", label: "année de création", note: "une trajectoire construite sur la livraison" },
  { value: "88,6M", label: "DZD de CA 2025", note: "croissance stable et maîtrisée" },
  { value: "5", label: "secteurs couverts", note: "éducation, santé, immobilier, industrie, services" },
];

const expertise = [
  {
    title: "Software engineering",
    eyebrow: "Produit & plateformes",
    text: "Applications web et mobiles, portails métier, API, back-office, expériences publiques et outils internes.",
    icon: Code2,
    tone: colors.navy,
  },
  {
    title: "Cloud & DevOps",
    eyebrow: "Exploitation",
    text: "CI/CD, déploiement cloud, observabilité, sauvegarde, sécurité, durcissement et continuité de service.",
    icon: ServerCog,
    tone: colors.green,
  },
  {
    title: "Data & ERP",
    eyebrow: "Intégration",
    text: "Flux de données, reporting, tableaux de bord, migration, ERP Wavesoft et synchronisation opérationnelle.",
    icon: Database,
    tone: colors.orange,
  },
];

const methodSteps = [
  {
    number: "01",
    title: "Cadrer clairement",
    text: "On clarifie les objectifs, les utilisateurs, les contraintes métier et les indicateurs qui permettront de mesurer la réussite.",
    icon: DraftingCompass,
  },
  {
    number: "02",
    title: "Concevoir avec les équipes",
    text: "Les parcours, interfaces, règles de gestion et décisions d'architecture sont posés tôt pour éviter les zones floues.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Construire par lots maîtrisés",
    text: "Design, développement, QA et DevOps avancent en cycles courts avec des validations visibles et des livrables exploitables.",
    icon: Workflow,
  },
  {
    number: "04",
    title: "Déployer et maintenir",
    text: "La mise en production s'accompagne de supervision, documentation, transfert de connaissance et amélioration continue.",
    icon: Rocket,
  },
];

const references = [
  "HIS - conception et développement d'une plateforme institutionnelle d'enseignement supérieur",
  "Elite Real Estate Promotion - vitrine digitale et parcours de conversion immobilière",
  "Rayan Healthcare - plateforme clinique et intégration Wavesoft aux processus internes",
  "Atlas Industrial Services - ERP, flux opérationnels, achats, facturation et dashboarding",
  "Moveo Fleet Portal - portail client pour demandes, suivi d'interventions et reporting flotte",
];

function SectionBadge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <View style={[styles.badge, dark && styles.badgeDark]}>
      <Text style={[styles.badgeText, dark && styles.badgeTextDark]}>{children}</Text>
    </View>
  );
}

function ActionButton({
  children,
  onPress,
  variant = "primary",
}: {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "light";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.actionButton,
        variant === "secondary" && styles.actionButtonSecondary,
        variant === "light" && styles.actionButtonLight,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          variant === "secondary" && styles.actionButtonSecondaryText,
          variant === "light" && styles.actionButtonLightText,
        ]}
      >
        {children}
      </Text>
      <ArrowRight
        size={16}
        color={variant === "secondary" ? colors.navy : variant === "light" ? colors.ink : colors.white}
      />
    </Pressable>
  );
}

function Mosaic({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.mosaic, compact && styles.mosaicCompact]}>
      {mosaic.map((backgroundColor, index) => (
        <View key={`${backgroundColor}-${index}`} style={[styles.mosaicTile, { backgroundColor }]}>
          {index === 12 && !compact ? <BrandLogo size={58} framed /> : null}
        </View>
      ))}
    </View>
  );
}

function AgencySurface() {
  return (
    <View style={styles.productSurface}>
      <View style={styles.productTop}>
        <View>
          <Text style={styles.productKicker}>Delivery cockpit</Text>
          <Text style={styles.productTitle}>Projet digital en cours</Text>
        </View>
        <View style={styles.livePill}>
          <Text style={styles.livePillText}>TRACKED</Text>
        </View>
      </View>

      <View style={styles.productStats}>
        <MiniStat label="Sprints livrés" value="18" />
        <MiniStat label="Tests validés" value="96%" />
        <MiniStat label="Uptime cible" value="99.9%" />
      </View>

      <View style={styles.productFlow}>
        <FlowLine icon={<Layers3 size={17} color={colors.navy} />} title="Architecture" text="Modules, API et données structurés" />
        <FlowLine icon={<ShieldCheck size={17} color={colors.orange} />} title="Qualité" text="Tests, validation et traçabilité" />
        <FlowLine icon={<LineChart size={17} color={colors.green} />} title="Pilotage" text="Indicateurs et support décisionnel" />
      </View>
    </View>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function FlowLine({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <View style={styles.flowLine}>
      <View style={styles.flowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.flowTitle}>{title}</Text>
        <Text style={styles.flowText}>{text}</Text>
      </View>
      <CheckCircle2 size={17} color={colors.green} />
    </View>
  );
}

export default function MacroLanding() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 960;
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<SectionKey, number>>({
    expertise: 0,
    method: 0,
    references: 0,
    contact: 0,
  });

  const setSection = (key: SectionKey) => (event: LayoutChangeEvent) => {
    sectionY.current[key] = event.nativeEvent.layout.y;
  };

  const goTo = (key: SectionKey) => {
    scrollRef.current?.scrollTo({ y: Math.max(sectionY.current[key] - 8, 0), animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollRef} style={styles.page} contentContainerStyle={styles.pageContent}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <BrandLogo size={38} framed />
              <View>
                <Text style={styles.brandName}>MACRO</Text>
                <Text style={styles.brandSub}>Software engineering</Text>
              </View>
            </View>

            {isDesktop ? (
              <View style={styles.nav}>
                {navigation.map((item) => (
                  <Pressable key={item.label} onPress={() => goTo(item.target)}>
                    <Text style={styles.navText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <ActionButton variant="secondary" onPress={() => goTo("contact")}>
              Contact
            </ActionButton>
          </View>

          <View style={[styles.heroGrid, !isDesktop && styles.heroGridMobile]}>
            <View style={[styles.heroCopy, !isDesktop && styles.heroCopyMobile]}>
              <SectionBadge>Agence d'ingénierie logicielle et transformation digitale</SectionBadge>
              <Text style={[styles.heroTitle, !isDesktop && styles.heroTitleMobile]}>
                MACRO conçoit, construit et exploite des plateformes digitales sur mesure.
              </Text>
              <Text style={styles.heroLead}>
                Une équipe algérienne orientée livraison, capable d'accompagner un projet de la découverte jusqu'à la
                production: produit, architecture, design, cloud, data, ERP et qualité logicielle.
              </Text>
              <View style={styles.heroActions}>
                <ActionButton onPress={() => goTo("expertise")}>Voir les expertises</ActionButton>
                <ActionButton variant="secondary" onPress={() => goTo("references")}>Nos références</ActionButton>
              </View>
            </View>

            <View style={[styles.heroVisual, !isDesktop && styles.heroVisualMobile]}>
              {isDesktop ? <Mosaic /> : <Mosaic compact />}
              <AgencySurface />
            </View>
          </View>
        </View>

        <View style={styles.darkBand}>
          <View style={[styles.darkBandInner, !isDesktop && styles.darkBandInnerMobile]}>
            <View style={styles.darkIntro}>
              <SectionBadge dark>Entreprise algérienne, delivery sérieux</SectionBadge>
              <Text style={styles.darkTitle}>Du cadrage au déploiement, MACRO agit comme un partenaire produit.</Text>
              <Text style={styles.darkText}>
                La société accompagne des institutions et organisations privées qui cherchent des solutions fiables,
                maintenables et alignées sur leurs opérations réelles.
              </Text>
            </View>
            <View style={styles.metricGrid}>
              {metrics.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricNote}>{metric.note}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View onLayout={setSection("expertise")} style={[styles.section, styles.sectionSoft]}>
          <View style={styles.sectionIntro}>
            <SectionBadge>Expertises</SectionBadge>
            <Text style={styles.sectionTitle}>Des compétences qui couvrent tout le cycle de vie d'une plateforme.</Text>
            <Text style={styles.sectionLead}>
              MACRO réunit les profils nécessaires pour passer d'un besoin métier à une solution digitale robuste:
              conception, développement, intégration, infrastructure, données et support.
            </Text>
          </View>

          <View style={[styles.moduleGrid, !isDesktop && styles.moduleGridMobile]}>
            {expertise.map(({ title, eyebrow, text, icon: Icon, tone }) => (
              <View key={title} style={styles.moduleCard}>
                <View style={[styles.moduleIcon, { backgroundColor: tone }]}>
                  <Icon size={22} color={colors.white} />
                </View>
                <Text style={styles.moduleEyebrow}>{eyebrow}</Text>
                <Text style={styles.moduleTitle}>{title}</Text>
                <Text style={styles.moduleText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View onLayout={setSection("method")} style={styles.section}>
          <View style={styles.sectionIntro}>
            <SectionBadge>Méthode</SectionBadge>
            <Text style={styles.sectionTitle}>Une logique de livraison claire, sans bruit inutile.</Text>
            <Text style={styles.sectionLead}>
              L'organisation de MACRO est simple au sommet et spécialisée dans l'exécution: direction projet, design,
              qualité, DevOps, développement et data travaillent avec des points de validation courts.
            </Text>
          </View>

          <View style={[styles.timelineFrame, !isDesktop && styles.timelineFrameMobile]}>
            <View style={[styles.timelineSide, !isDesktop && styles.timelineSideMobile]}>
              <Text style={styles.timelineKicker}>Façon de travailler</Text>
              <Text style={styles.timelineTitle}>Des projets cadrés, visibles et prêts à évoluer.</Text>
              <Text style={styles.timelineText}>
                Chaque livrable est produit, revu, corrigé et validé avec une traçabilité suffisante pour garder le
                rythme sans perdre la mémoire des décisions.
              </Text>
            </View>
            <View style={styles.steps}>
              {methodSteps.map(({ number, title, text, icon: Icon }) => (
                <View key={title} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{number}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepIcon}>
                      <Icon size={18} color={colors.navy} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>{title}</Text>
                      <Text style={styles.stepText}>{text}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View onLayout={setSection("references")} style={styles.splitSection}>
          <View style={[styles.splitGrid, !isDesktop && styles.splitGridMobile]}>
            <View style={[styles.splitCopy, !isDesktop && styles.splitCopyMobile]}>
              <SectionBadge dark>Références & secteurs</SectionBadge>
              <Text style={styles.splitTitle}>Une équipe qui a déjà livré dans l'éducation, la santé, l'immobilier et l'industrie.</Text>
              <Text style={styles.splitText}>
                Le portefeuille de MACRO illustre une capacité à construire de zéro, moderniser des plateformes publiques
                et connecter les systèmes métier aux flux opérationnels.
              </Text>
              <ActionButton variant="light" onPress={() => goTo("contact")}>Parler du projet</ActionButton>
            </View>
            <View style={styles.referenceList}>
              {references.map((reference, index) => (
                <View key={reference} style={styles.referenceItem}>
                  <Text style={styles.referenceNumber}>{String(index + 1).padStart(2, "0")}</Text>
                  <Text style={styles.referenceText}>{reference}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View onLayout={setSection("contact")} style={styles.contactSection}>
          <View style={[styles.contactGrid, !isDesktop && styles.contactGridMobile]}>
            <View style={styles.contactCopy}>
              <SectionBadge>Gouvernance projet</SectionBadge>
              <Text style={styles.contactTitle}>MACRO garde le rythme: ateliers, validation, QA et livraison contrôlée.</Text>
              <Text style={styles.contactText}>
                Canaux rapides pour la coordination quotidienne, réunions de jalon, email pour les validations officielles
                et espaces partagés pour garder chaque version accessible et auditable.
              </Text>
            </View>
            <View style={styles.contactPanel}>
              <InfoLine icon={<BriefcaseBusiness size={18} color={colors.orange} />} title="Direction projet" text="Cadrage, planning, arbitrage et validation des livrables." />
              <InfoLine icon={<MonitorCog size={18} color={colors.navy} />} title="Architecture & delivery" text="Design, DevOps, QA, data, développement et intégration." />
              <InfoLine icon={<Database size={18} color={colors.green} />} title="Capacité d'intégration" text="Cloud, ERP, API, reporting, analytics et sécurité." />
              <InfoLine icon={<Cloud size={18} color={colors.purple} />} title="Exploitation" text="CI/CD, observabilité, sauvegarde et continuité de service." />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.brandLockup}>
            <BrandLogo size={34} framed />
            <View>
              <Text style={styles.footerBrand}>MACRO</Text>
              <Text style={styles.footerText}>Custom software, digital transformation, cloud, data and ERP integration.</Text>
            </View>
          </View>
          <View style={styles.footerPills}>
            <FooterPill icon={<Building2 size={14} color={colors.navy} />} text="SARL algérienne" />
            <FooterPill icon={<BadgeCheck size={14} color={colors.green} />} text="20M DZD capital" />
            <FooterPill icon={<UsersRound size={14} color={colors.orange} />} text="40 employés" />
            <FooterPill icon={<Sparkles size={14} color={colors.purple} />} text="Solutions sur mesure" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoLine({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <View style={styles.infoLine}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

function FooterPill({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View style={styles.footerPill}>
      {icon}
      <Text style={styles.footerPillText}>{text}</Text>
    </View>
  );
}

const border = "rgba(24, 48, 68, 0.10)";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  page: { flex: 1, backgroundColor: colors.white },
  pageContent: { alignItems: "center" },
  shell: { width: "100%", maxWidth: 1440, borderColor: border, borderWidth: 1, backgroundColor: colors.white },
  header: {
    minHeight: 82,
    borderBottomColor: border,
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    zIndex: 5,
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandName: { color: colors.ink, fontSize: 23, fontWeight: "900" },
  brandSub: { color: colors.muted, fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  nav: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 26 },
  navText: { color: colors.muted, fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  heroGrid: { minHeight: 650, flexDirection: "row" },
  heroGridMobile: { minHeight: 0, flexDirection: "column" },
  heroCopy: { flex: 1.12, backgroundColor: colors.creamSoft, paddingHorizontal: 48, paddingVertical: 58, justifyContent: "center", gap: 22 },
  heroCopyMobile: { flex: 0, minHeight: 520, paddingHorizontal: 28, paddingTop: 42, paddingBottom: 34 },
  badge: { alignSelf: "flex-start", borderColor: border, borderWidth: 1, backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 8 },
  badgeDark: { borderColor: "rgba(255,255,255,0.16)", backgroundColor: "rgba(255,255,255,0.06)" },
  badgeText: { color: colors.navy, fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  badgeTextDark: { color: colors.cream },
  heroTitle: { maxWidth: 780, color: colors.ink, fontSize: 68, lineHeight: 68, fontWeight: "900" },
  heroTitleMobile: { fontSize: 34, lineHeight: 37 },
  heroLead: { maxWidth: 690, color: colors.muted, fontSize: 18, lineHeight: 29 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionButton: {
    minHeight: 46,
    backgroundColor: colors.navy,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 0,
  },
  actionButtonSecondary: { backgroundColor: colors.white, borderColor: border, borderWidth: 1 },
  actionButtonLight: { backgroundColor: colors.cream },
  actionButtonText: { color: colors.white, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  actionButtonSecondaryText: { color: colors.navy },
  actionButtonLightText: { color: colors.ink },
  heroVisual: { position: "relative", flex: 0.88, borderLeftColor: border, borderLeftWidth: 1, backgroundColor: colors.white },
  heroVisualMobile: { flex: 0, minHeight: 390, borderLeftWidth: 0, borderTopColor: border, borderTopWidth: 1 },
  mosaic: { height: 650, flexDirection: "row", flexWrap: "wrap", backgroundColor: border },
  mosaicCompact: { height: 390 },
  mosaicTile: { width: "20%", height: "20%", borderColor: border, borderWidth: 0.5, alignItems: "center", justifyContent: "center" },
  productSurface: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 28,
    borderColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.94)",
    padding: 18,
    gap: 14,
  },
  productTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  productKicker: { color: colors.muted, fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  productTitle: { color: colors.ink, fontSize: 22, fontWeight: "900", marginTop: 2 },
  livePill: { backgroundColor: colors.greenSoft, paddingHorizontal: 10, paddingVertical: 6 },
  livePillText: { color: colors.green, fontSize: 9, fontWeight: "900" },
  productStats: { flexDirection: "row", gap: 8 },
  miniStat: { flex: 1, backgroundColor: colors.navySoft, padding: 11 },
  miniStatValue: { color: colors.navy, fontSize: 20, fontWeight: "900" },
  miniStatLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
  productFlow: { gap: 8 },
  flowLine: { flexDirection: "row", alignItems: "center", gap: 10, borderColor: border, borderWidth: 1, backgroundColor: colors.white, padding: 10 },
  flowIcon: { width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.creamSoft },
  flowTitle: { color: colors.ink, fontSize: 12, fontWeight: "900" },
  flowText: { color: colors.muted, fontSize: 10, marginTop: 2 },
  darkBand: { width: "100%", alignItems: "center", backgroundColor: colors.navyDark, paddingHorizontal: 20, paddingVertical: 28 },
  darkBandInner: { width: "100%", maxWidth: 1390, borderColor: "rgba(255,255,255,0.12)", borderWidth: 1, flexDirection: "row" },
  darkBandInnerMobile: { flexDirection: "column" },
  darkIntro: { flex: 0.48, padding: 32, gap: 18, borderRightColor: "rgba(255,255,255,0.12)", borderRightWidth: 1 },
  darkTitle: { color: colors.white, fontSize: 42, lineHeight: 43, fontWeight: "900" },
  darkText: { color: "rgba(255,255,255,0.74)", fontSize: 15, lineHeight: 24 },
  metricGrid: { flex: 0.52, flexDirection: "row", flexWrap: "wrap" },
  metricCard: { width: "50%", minHeight: 150, borderColor: "rgba(255,255,255,0.12)", borderWidth: 1, padding: 24, justifyContent: "center" },
  metricValue: { color: colors.orange, fontSize: 38, fontWeight: "900" },
  metricLabel: { color: colors.white, fontSize: 14, fontWeight: "900", marginTop: 6 },
  metricNote: { color: "rgba(255,255,255,0.60)", fontSize: 12, lineHeight: 18, marginTop: 4 },
  section: { width: "100%", maxWidth: 1440, borderLeftColor: border, borderRightColor: border, borderBottomColor: border, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingHorizontal: 32, paddingVertical: 78, gap: 34 },
  sectionSoft: { backgroundColor: colors.canvas },
  sectionIntro: { gap: 16 },
  sectionTitle: { maxWidth: 880, color: colors.ink, fontSize: 46, lineHeight: 48, fontWeight: "900" },
  sectionLead: { maxWidth: 740, color: colors.muted, fontSize: 16, lineHeight: 26 },
  moduleGrid: { flexDirection: "row", gap: 14 },
  moduleGridMobile: { flexDirection: "column" },
  moduleCard: { flex: 1, minHeight: 285, borderColor: border, borderWidth: 1, backgroundColor: colors.white, padding: 24, gap: 12 },
  moduleIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  moduleEyebrow: { color: colors.orange, fontSize: 11, fontWeight: "900", textTransform: "uppercase", marginTop: 8 },
  moduleTitle: { color: colors.ink, fontSize: 30, fontWeight: "900" },
  moduleText: { color: colors.muted, fontSize: 15, lineHeight: 24 },
  timelineFrame: { borderColor: border, borderWidth: 1, backgroundColor: colors.white, flexDirection: "row" },
  timelineFrameMobile: { flexDirection: "column" },
  timelineSide: { flex: 0.34, padding: 28, borderRightColor: border, borderRightWidth: 1, backgroundColor: colors.creamSoft },
  timelineSideMobile: { borderRightWidth: 0, borderBottomColor: border, borderBottomWidth: 1 },
  timelineKicker: { color: colors.orange, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  timelineTitle: { color: colors.ink, fontSize: 32, lineHeight: 34, fontWeight: "900", marginTop: 12 },
  timelineText: { color: colors.muted, fontSize: 14, lineHeight: 23, marginTop: 12 },
  steps: { flex: 0.66, padding: 28, gap: 22 },
  stepRow: { flexDirection: "row", gap: 16 },
  stepNumber: { width: 48, height: 48, borderRadius: 24, borderColor: border, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  stepNumberText: { color: colors.navy, fontSize: 15, fontWeight: "900" },
  stepContent: { flex: 1, borderBottomColor: border, borderBottomWidth: 1, paddingBottom: 22, flexDirection: "row", gap: 14 },
  stepIcon: { width: 40, height: 40, backgroundColor: colors.navySoft, alignItems: "center", justifyContent: "center" },
  stepTitle: { color: colors.ink, fontSize: 18, fontWeight: "900" },
  stepText: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 6 },
  splitSection: { width: "100%", backgroundColor: colors.ink, alignItems: "center", paddingHorizontal: 20, paddingVertical: 40 },
  splitGrid: { width: "100%", maxWidth: 1390, borderColor: "rgba(255,255,255,0.12)", borderWidth: 1, flexDirection: "row" },
  splitGridMobile: { flexDirection: "column" },
  splitCopy: { flex: 0.44, padding: 34, gap: 18, borderRightColor: "rgba(255,255,255,0.12)", borderRightWidth: 1 },
  splitCopyMobile: { borderRightWidth: 0, borderBottomColor: "rgba(255,255,255,0.12)", borderBottomWidth: 1 },
  splitTitle: { color: colors.white, fontSize: 42, lineHeight: 43, fontWeight: "900" },
  splitText: { color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 24 },
  referenceList: { flex: 0.56 },
  referenceItem: { minHeight: 92, borderBottomColor: "rgba(255,255,255,0.12)", borderBottomWidth: 1, paddingHorizontal: 28, paddingVertical: 22, flexDirection: "row", alignItems: "center", gap: 18 },
  referenceNumber: { color: colors.orange, fontSize: 24, fontWeight: "900" },
  referenceText: { flex: 1, color: colors.white, fontSize: 17, lineHeight: 25, fontWeight: "800" },
  contactSection: { width: "100%", maxWidth: 1440, borderLeftColor: border, borderRightColor: border, borderBottomColor: border, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingHorizontal: 32, paddingVertical: 72, backgroundColor: colors.creamSoft },
  contactGrid: { flexDirection: "row", gap: 18 },
  contactGridMobile: { flexDirection: "column" },
  contactCopy: { flex: 0.48, gap: 16 },
  contactTitle: { color: colors.ink, fontSize: 42, lineHeight: 44, fontWeight: "900" },
  contactText: { color: colors.muted, fontSize: 16, lineHeight: 26 },
  contactPanel: { flex: 0.52, borderColor: border, borderWidth: 1, backgroundColor: colors.white },
  infoLine: { flexDirection: "row", gap: 12, padding: 18, borderBottomColor: border, borderBottomWidth: 1 },
  infoIcon: { width: 38, height: 38, backgroundColor: colors.creamSoft, alignItems: "center", justifyContent: "center" },
  infoTitle: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  infoText: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 3 },
  footer: { width: "100%", maxWidth: 1440, padding: 28, borderLeftColor: border, borderRightColor: border, borderBottomColor: border, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" },
  footerBrand: { color: colors.ink, fontSize: 16, fontWeight: "900" },
  footerText: { color: colors.muted, fontSize: 12, marginTop: 2 },
  footerPills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  footerPill: { borderColor: border, borderWidth: 1, backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  footerPillText: { color: colors.ink, fontSize: 11, fontWeight: "800" },
});
