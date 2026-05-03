import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  const colors = useColors();
  return (
    <View style={[styles.badge, { borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.grayText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
