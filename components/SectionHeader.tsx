import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.gold }]} />
      <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  line: {
    width: 32,
    height: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
