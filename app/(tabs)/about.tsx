import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const TEAM = [
  {
    name: "Lead Engineer",
    role: "Hardware & Firmware",
    icon: "cpu",
    note: "ESP32 architecture & sensor integration",
  },
  {
    name: "Software Dev",
    role: "Control Systems",
    icon: "code",
    note: "WiFi API & autonomous navigation algorithms",
  },
  {
    name: "Mechanical",
    role: "Chassis & Drive",
    icon: "tool",
    note: "Blade system, motor mounts & weatherproofing",
  },
];

const ROADMAP = [
  {
    phase: "PHASE 1",
    title: "Foundation",
    status: "done",
    items: ["ESP32 firmware base", "WiFi HTTP control API", "Basic obstacle avoidance", "Manual drive mode"],
  },
  {
    phase: "PHASE 2",
    title: "Autonomy",
    status: "active",
    items: ["Perimeter wire system", "Auto return to base", "Coverage path planning", "OTA firmware updates"],
  },
  {
    phase: "PHASE 3",
    title: "Intelligence",
    status: "planned",
    items: ["Camera vision integration", "Machine learning obstacles", "Multi-zone scheduling", "Mobile app (this app)"],
  },
  {
    phase: "PHASE 4",
    title: "Ecosystem",
    status: "planned",
    items: ["Cloud dashboard", "Multi-mower fleet", "Weather API integration", "Voice control"],
  },
];

const STATUS_COLORS: Record<string, string> = {
  done: "#4caf50",
  active: "#c8a000",
  planned: "#6b8c6b",
};

const STATUS_LABELS: Record<string, string> = {
  done: "COMPLETE",
  active: "IN PROGRESS",
  planned: "PLANNED",
};

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPad + 16,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.brand, { color: colors.gold }]}>DA3POLES™</Text>
      <Text style={[styles.pageTitle, { color: colors.white }]}>TEAM &</Text>
      <Text style={[styles.pageTitleMuted, { color: colors.mutedForeground }]}>ROADMAP</Text>

      <Text style={[styles.intro, { color: colors.grayText }]}>
        A student engineering team building autonomous outdoor robotics. SmartMow is our first
        production-grade project — engineered for durability, safety, and real-world performance.
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text style={[styles.sectionTitle, { color: colors.gold }]}>THE TEAM</Text>

      <View style={styles.teamList}>
        {TEAM.map((m) => (
          <View
            key={m.name}
            style={[styles.teamCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.teamIcon, { backgroundColor: colors.surface }]}>
              <Feather name={m.icon as any} size={18} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.teamName, { color: colors.white }]}>{m.name}</Text>
              <Text style={[styles.teamRole, { color: colors.gold }]}>{m.role}</Text>
              <Text style={[styles.teamNote, { color: colors.mutedForeground }]}>{m.note}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text style={[styles.sectionTitle, { color: colors.gold }]}>ROADMAP</Text>

      <View style={styles.roadmapList}>
        {ROADMAP.map((phase, idx) => (
          <View key={phase.phase} style={styles.phaseRow}>
            <View style={styles.timelineCol}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: STATUS_COLORS[phase.status] },
                ]}
              />
              {idx < ROADMAP.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor:
                        phase.status === "done" ? STATUS_COLORS.done : colors.border,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.phaseCard,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    phase.status === "active" ? colors.gold : colors.border,
                  borderWidth: phase.status === "active" ? 1 : 1,
                },
              ]}
            >
              <View style={styles.phaseHeader}>
                <Text style={[styles.phaseLabel, { color: colors.mutedForeground }]}>
                  {phase.phase}
                </Text>
                <Text
                  style={[
                    styles.phaseStatus,
                    { color: STATUS_COLORS[phase.status] },
                  ]}
                >
                  {STATUS_LABELS[phase.status]}
                </Text>
              </View>
              <Text style={[styles.phaseTitle, { color: colors.white }]}>
                {phase.title}
              </Text>
              <View style={styles.phaseItems}>
                {phase.items.map((item) => (
                  <View key={item} style={styles.phaseItem}>
                    <Feather
                      name={phase.status === "done" ? "check" : "chevron-right"}
                      size={12}
                      color={
                        phase.status === "done"
                          ? STATUS_COLORS.done
                          : colors.mutedForeground
                      }
                    />
                    <Text style={[styles.phaseItemText, { color: colors.mutedForeground }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.buildBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="git-branch" size={14} color={colors.gold} />
        <Text style={[styles.buildText, { color: colors.mutedForeground }]}>
          SmartMow v1.0 · Built by DA3POLES™
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  brand: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 40,
  },
  pageTitleMuted: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 16,
    opacity: 0.5,
  },
  intro: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  divider: { height: 1, marginBottom: 20 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    marginBottom: 14,
  },
  teamList: { gap: 10, marginBottom: 24 },
  teamCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
  },
  teamIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  teamName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  teamRole: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  teamNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    lineHeight: 16,
  },
  roadmapList: { gap: 0, marginBottom: 24 },
  phaseRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },
  timelineCol: {
    alignItems: "center",
    width: 16,
    paddingTop: 18,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginTop: 4,
  },
  phaseCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    marginBottom: 10,
  },
  phaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  phaseLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
  },
  phaseStatus: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  phaseTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  phaseItems: { gap: 6 },
  phaseItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  phaseItemText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  buildBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
  },
  buildText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
});
