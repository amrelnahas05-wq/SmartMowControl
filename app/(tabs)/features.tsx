import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

type Tab = "features" | "specs" | "safety";

const FEATURES = [
  {
    icon: "cpu",
    title: "ESP32 Dual-Core",
    desc: "240MHz processor with built-in WiFi and Bluetooth for real-time control and sensor fusion.",
  },
  {
    icon: "wifi",
    title: "WiFi Remote Control",
    desc: "Control your mower from anywhere on the network via a responsive HTTP command interface.",
  },
  {
    icon: "eye",
    title: "Obstacle Avoidance",
    desc: "360° ultrasonic sensor array detects and navigates around obstacles in real time.",
  },
  {
    icon: "map",
    title: "Perimeter Mapping",
    desc: "Wire-based boundary system ensures the mower stays within your defined lawn area.",
  },
  {
    icon: "battery-charging",
    title: "Auto Return & Charge",
    desc: "Low battery triggers automatic return to the charging base using encoded position memory.",
  },
  {
    icon: "zap",
    title: "Autonomous Mowing",
    desc: "AI-planned mowing paths optimize coverage and minimize overlap across the lawn area.",
  },
];

const SPECS = [
  { group: "Performance", items: [
    { key: "Processor", value: "ESP32 Dual-Core 240MHz" },
    { key: "RAM", value: "520KB SRAM" },
    { key: "Flash", value: "4MB" },
    { key: "Range", value: "100 meters" },
    { key: "Coverage", value: "500 m²" },
    { key: "Runtime", value: "6 hours" },
  ]},
  { group: "Connectivity", items: [
    { key: "WiFi", value: "802.11 b/g/n (2.4GHz)" },
    { key: "Control Protocol", value: "HTTP REST API" },
    { key: "Update", value: "OTA via WiFi" },
  ]},
  { group: "Mechanical", items: [
    { key: "Blade Diameter", value: "20cm" },
    { key: "Cutting Height", value: "20–60mm (adj.)" },
    { key: "Max Slope", value: "25°" },
    { key: "Weight", value: "3.8kg" },
    { key: "Motors", value: "4× DC 12V" },
  ]},
  { group: "Power", items: [
    { key: "Battery", value: "Li-Ion 14.4V 5Ah" },
    { key: "Charge Time", value: "90 minutes" },
    { key: "Idle Current", value: "120mA" },
  ]},
];

const SAFETY = [
  {
    icon: "alert-triangle",
    title: "Tilt Detection",
    desc: "IMU sensor detects abnormal tilt angles and immediately halts all motors.",
  },
  {
    icon: "zap-off",
    title: "Lift Kill Switch",
    desc: "Mechanical switch cuts power to the blade motor instantly when the unit is lifted.",
  },
  {
    icon: "shield",
    title: "Perimeter Enforcement",
    desc: "Wire signal loss triggers safe-stop behavior with audible and LED alert.",
  },
  {
    icon: "clock",
    title: "Watchdog Timer",
    desc: "Onboard hardware watchdog resets the controller if the firmware becomes unresponsive.",
  },
  {
    icon: "battery",
    title: "Low Battery Protocol",
    desc: "At 15% charge the mower enters return-to-base mode — no field shutdown risk.",
  },
  {
    icon: "radio",
    title: "Connection Loss Handler",
    desc: "WiFi disconnect in manual mode triggers a controlled stop after 2 seconds.",
  },
];

export default function FeaturesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("features");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const tabs: { id: Tab; label: string }[] = [
    { id: "features", label: "FEATURES" },
    { id: "specs", label: "SPECS" },
    { id: "safety", label: "SAFETY" },
  ];

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
      <Text style={[styles.pageTitle, { color: colors.white }]}>TECHNICAL</Text>
      <Text style={[styles.pageTitleGold, { color: colors.gold }]}>OVERVIEW</Text>

      <View style={[styles.tabBar, { borderColor: colors.border }]}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.tab,
              {
                borderBottomColor: activeTab === t.id ? colors.gold : "transparent",
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab(t.id)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === t.id ? colors.gold : colors.mutedForeground,
                },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "features" && (
        <View style={styles.list}>
          {FEATURES.map((f) => (
            <View
              key={f.title}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name={f.icon as any} size={20} color={colors.gold} style={{ marginBottom: 8 }} />
              <Text style={[styles.cardTitle, { color: colors.white }]}>{f.title}</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      )}

      {activeTab === "specs" && (
        <View style={styles.list}>
          {SPECS.map((group) => (
            <View key={group.group}>
              <Text style={[styles.groupTitle, { color: colors.gold }]}>
                {group.group.toUpperCase()}
              </Text>
              <View style={[styles.specTable, { borderColor: colors.border }]}>
                {group.items.map((item, idx) => (
                  <View
                    key={item.key}
                    style={[
                      styles.specRow,
                      {
                        borderTopWidth: idx > 0 ? 1 : 0,
                        borderTopColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.specKey, { color: colors.mutedForeground }]}>
                      {item.key}
                    </Text>
                    <Text style={[styles.specValue, { color: colors.white }]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === "safety" && (
        <View style={styles.list}>
          <View
            style={[
              styles.safetyBanner,
              { backgroundColor: "#1a0a0a", borderColor: colors.danger },
            ]}
          >
            <Feather name="alert-triangle" size={16} color={colors.danger} />
            <Text style={[styles.safetyBannerText, { color: colors.danger }]}>
              Always follow local regulations. Keep children and pets away from operating area.
            </Text>
          </View>
          {SAFETY.map((s) => (
            <View
              key={s.title}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.safetyHeader}>
                <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                  <Feather name={s.icon as any} size={16} color={colors.gold} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.white }]}>{s.title}</Text>
              </View>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 40,
  },
  pageTitleGold: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
  list: { gap: 12 },
  card: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  groupTitle: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 8,
  },
  specTable: {
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  specKey: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  specValue: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
  },
  safetyBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
  },
  safetyBannerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  safetyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
