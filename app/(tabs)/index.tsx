import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";

const FEATURES = [
  { icon: "cpu", label: "ESP32 Powered", desc: "Dual-core 240MHz processor" },
  { icon: "wifi", label: "WiFi Control", desc: "Real-time remote operation" },
  { icon: "eye", label: "Obstacle Avoidance", desc: "Ultrasonic sensor array" },
  { icon: "shield", label: "Safety Protocols", desc: "Auto-stop on tilt/lift" },
  { icon: "battery-charging", label: "6 Hour Runtime", desc: "Auto return to base" },
  { icon: "map", label: "500M² Coverage", desc: "Perimeter wire mapping" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad =
    Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPad + 16,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 80,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.badgeRow}>
        <Badge label="ESP32" />
        <Badge label="Autonomous" />
        <Badge label="AI-Powered" />
      </View>

      <View style={styles.heroText}>
        <Text style={[styles.heroSmart, { color: colors.white }]}>SMART</Text>
        <Text style={[styles.heroLawn, { color: colors.gold }]}>LAWN</Text>
        <Text style={[styles.heroMower, { color: colors.mutedForeground }]}>MOWER</Text>
      </View>

      <Text style={[styles.tagline, { color: colors.grayText }]}>
        An autonomous ESP32-powered lawn mower with real-time obstacle avoidance,
        ESP WiFi control, and intelligent safety protocols.
      </Text>

      <View style={styles.statsRow}>
        <StatCard label="Range" value="100" unit="Meters" />
        <StatCard label="Coverage" value="500" unit="m²" />
        <StatCard label="Runtime" value="6" unit="Hours" />
      </View>

      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: colors.danger }]}
        onPress={() => router.push("/(tabs)/control")}
        activeOpacity={0.8}
      >
        <Feather name="sliders" size={16} color="#fff" />
        <Text style={styles.ctaText}>CONTROL PANEL</Text>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text style={[styles.sectionTitle, { color: colors.gold }]}>
        KEY FEATURES
      </Text>

      <View style={styles.featureGrid}>
        {FEATURES.map((f) => (
          <View
            key={f.label}
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name={f.icon as any} size={20} color={colors.gold} />
            <Text style={[styles.featureLabel, { color: colors.white }]}>
              {f.label}
            </Text>
            <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>
              {f.desc}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  heroText: { marginBottom: 16 },
  heroSmart: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 56,
  },
  heroLawn: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 56,
  },
  heroMower: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 56,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 24,
    marginHorizontal: -4,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 4,
    marginBottom: 32,
  },
  ctaText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 2,
  },
  divider: { height: 1, marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featureCard: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    gap: 6,
  },
  featureLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  featureDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
});
