import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.gold }]}>{value}</Text>
      {unit && <Text style={[styles.unit, { color: colors.grayText }]}>{unit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  label: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  value: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
