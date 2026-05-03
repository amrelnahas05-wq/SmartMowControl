import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface DpadButtonProps {
  label: string;
  icon: string;
  onPressIn: () => void;
  onPressOut: () => void;
  size?: "normal" | "stop";
}

export function DpadButton({ label, icon, onPressIn, onPressOut, size = "normal" }: DpadButtonProps) {
  const colors = useColors();
  const isStop = size === "stop";

  const handlePressIn = useCallback(async (_e: GestureResponderEvent) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPressIn();
  }, [onPressIn]);

  const handlePressOut = useCallback((_e: GestureResponderEvent) => {
    onPressOut();
  }, [onPressOut]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isStop ? colors.danger : colors.card,
          borderColor: isStop ? colors.danger : colors.border,
          width: isStop ? 72 : 64,
          height: isStop ? 72 : 64,
        },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      <Text style={[styles.icon, { color: isStop ? "#fff" : colors.gold }]}>{icon}</Text>
      <Text style={[styles.label, { color: isStop ? "#fff" : colors.mutedForeground }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 8,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
