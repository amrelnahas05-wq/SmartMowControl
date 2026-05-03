import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

type Mode = "auto" | "manual" | "return";
type Direction = "forward" | "backward" | "left" | "right" | "stop" | null;

interface MowerStatus {
  battery: number;
  bladeRpm: number;
  motorTemp: number;
  wifiStrength: number;
  sessionMins: number;
  areaCovered: number;
  mowStatus: "idle" | "mowing" | "returning" | "charging" | "error";
}

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "auto", label: "AUTO", icon: "zap" },
  { id: "manual", label: "MANUAL", icon: "sliders" },
  { id: "return", label: "RETURN", icon: "home" },
];

const STATUS_COLORS: Record<string, string> = {
  idle: "#6b8c6b",
  mowing: "#4caf50",
  returning: "#c8a000",
  charging: "#2196f3",
  error: "#c2185b",
};

const STATUS_LABELS: Record<string, string> = {
  idle: "IDLE",
  mowing: "MOWING",
  returning: "RETURNING",
  charging: "CHARGING",
  error: "ERROR",
};

function Arc({
  value,
  max,
  color,
  size = 72,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value / max,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [value, max]);

  const pct = Math.round((value / max) * 100);
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color, fontSize: size * 0.22, fontFamily: "Inter_700Bold" }}>
        {value.toLocaleString()}
      </Text>
    </View>
  );
}

function LiveGauge({
  label,
  value,
  max,
  unit,
  color,
  warn,
  colors: c,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  warn?: boolean;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const pct = Math.min(1, value / max);
  return (
    <View style={[gaugeStyles.wrap, { backgroundColor: c.card, borderColor: warn ? color : c.border }]}>
      <Text style={[gaugeStyles.label, { color: c.mutedForeground }]}>{label}</Text>
      <View style={gaugeStyles.valueRow}>
        <Text style={[gaugeStyles.value, { color: warn ? color : c.white }]}>
          {value.toLocaleString()}
        </Text>
        <Text style={[gaugeStyles.unit, { color: c.mutedForeground }]}>{unit}</Text>
      </View>
      <View style={[gaugeStyles.bar, { backgroundColor: c.surface }]}>
        <View style={[gaugeStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  value: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  unit: { fontSize: 10, fontFamily: "Inter_400Regular" },
  bar: { height: 4, borderRadius: 2, overflow: "hidden", marginTop: 4 },
  fill: { height: "100%", borderRadius: 2 },
});

export default function ControlScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [mowerIp, setMowerIp] = useState("192.168.4.1");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [mode, setMode] = useState<Mode>("manual");
  const [speed, setSpeed] = useState(50);
  const [blade, setBlade] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<Direction>(null);
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const [pollError, setPollError] = useState(false);

  const [status, setStatus] = useState<MowerStatus>({
    battery: 78,
    bladeRpm: 0,
    motorTemp: 32,
    wifiStrength: 0,
    sessionMins: 0,
    areaCovered: 0,
    mowStatus: "idle",
  });

  const commandTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  const fetchStatus = useCallback(
    async (ip: string) => {
      try {
        const res = await fetch(`http://${ip}/status`, {
          signal: AbortSignal.timeout(2500),
        });
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        setStatus({
          battery: data.battery ?? 78,
          bladeRpm: data.blade_rpm ?? 0,
          motorTemp: data.motor_temp ?? 32,
          wifiStrength: data.wifi_rssi ? Math.max(0, 100 + data.wifi_rssi) : 72,
          sessionMins: data.session_mins ?? 0,
          areaCovered: data.area_covered ?? 0,
          mowStatus: data.status ?? "idle",
        });
        setPollError(false);
        setLastPoll(new Date());
      } catch {
        setPollError(true);
      }
    },
    []
  );

  useEffect(() => {
    if (connected) {
      startPulse();
      pollTimer.current = setInterval(() => fetchStatus(mowerIp), 3000);
      return () => {
        if (pollTimer.current) clearInterval(pollTimer.current);
        stopPulse();
      };
    }
  }, [connected, mowerIp, fetchStatus, startPulse, stopPulse]);

  const sendCommand = useCallback(
    async (cmd: string) => {
      if (!connected) return;
      try {
        await fetch(`http://${mowerIp}/cmd?action=${cmd}&speed=${speed}`, {
          method: "GET",
          signal: AbortSignal.timeout(1500),
        });
      } catch {
        // silent
      }
    },
    [connected, mowerIp, speed]
  );

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const res = await fetch(`http://${mowerIp}/status`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus((prev) => ({
          ...prev,
          battery: data.battery ?? 78,
          bladeRpm: data.blade_rpm ?? 0,
          motorTemp: data.motor_temp ?? 32,
          wifiStrength: data.wifi_rssi ? Math.max(0, 100 + data.wifi_rssi) : 72,
          mowStatus: data.status ?? "idle",
        }));
        setConnected(true);
        setLastPoll(new Date());
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        throw new Error("bad");
      }
    } catch {
      Alert.alert(
        "Connection Failed",
        `Could not reach mower at ${mowerIp}.\nMake sure your phone is on the mower's WiFi network.`,
        [{ text: "OK" }]
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setConnecting(false);
    }
  }, [mowerIp]);

  const handleDisconnect = useCallback(async () => {
    setConnected(false);
    setCurrentDirection(null);
    setBlade(false);
    if (pollTimer.current) clearInterval(pollTimer.current);
    if (commandTimer.current) clearInterval(commandTimer.current);
    await sendCommand("stop");
  }, [sendCommand]);

  const handlePressIn = useCallback(
    (dir: Direction) => {
      setCurrentDirection(dir);
      if (dir) sendCommand(dir);
      commandTimer.current = setInterval(() => { if (dir) sendCommand(dir); }, 200);
    },
    [sendCommand]
  );

  const handlePressOut = useCallback(() => {
    setCurrentDirection(null);
    if (commandTimer.current) clearInterval(commandTimer.current);
    sendCommand("stop");
  }, [sendCommand]);

  const handleStop = useCallback(async () => {
    setCurrentDirection("stop");
    if (commandTimer.current) clearInterval(commandTimer.current);
    await sendCommand("stop");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => setCurrentDirection(null), 300);
  }, [sendCommand]);

  const handleModeChange = useCallback(async (m: Mode) => {
    setMode(m);
    await sendCommand(`mode_${m}`);
    await Haptics.selectionAsync();
  }, [sendCommand]);

  const handleBladeToggle = useCallback(async (val: boolean) => {
    setBlade(val);
    await sendCommand(val ? "blade_on" : "blade_off");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [sendCommand]);

  const adjustSpeed = useCallback(async (delta: number) => {
    const newSpeed = Math.min(100, Math.max(10, speed + delta));
    setSpeed(newSpeed);
    await sendCommand(`speed_${newSpeed}`);
    await Haptics.selectionAsync();
  }, [speed, sendCommand]);

  const DpadBtn = ({ dir, icon, label }: { dir: Direction; icon: string; label: string }) => {
    const active = currentDirection === dir;
    const enabled = connected && mode === "manual";
    return (
      <TouchableOpacity
        style={[styles.dpadBtn, {
          backgroundColor: active ? colors.gold : colors.card,
          borderColor: active ? colors.gold : enabled ? colors.border : "#0f260f",
        }]}
        onPressIn={() => handlePressIn(dir)}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={!enabled}
      >
        <Feather name={icon as any} size={22} color={active ? colors.background : enabled ? colors.gold : "#1a3a1a"} />
        <Text style={[styles.dpadLabel, { color: active ? colors.background : enabled ? colors.mutedForeground : "#1a3a1a" }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const batteryColor =
    status.battery > 50 ? colors.success : status.battery > 20 ? colors.warning : colors.danger;

  const rpmColor = status.bladeRpm > 2500 ? colors.danger : status.bladeRpm > 0 ? colors.gold : colors.mutedForeground;

  const tempColor = status.motorTemp > 70 ? colors.danger : status.motorTemp > 50 ? colors.warning : colors.success;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, {
        paddingTop: topPad + 16,
        paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90,
      }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.white }]}>CONTROL PANEL</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>DA3POLES™ SmartMow</Text>
        </View>
        <View style={styles.statusBadge}>
          <Animated.View style={[styles.statusDot, {
            backgroundColor: connected ? (pollError ? colors.warning : colors.success) : colors.border,
            opacity: connected ? pulseAnim : 1,
          }]} />
          <Text style={[styles.statusLabel, { color: connected ? (pollError ? colors.warning : colors.success) : colors.mutedForeground }]}>
            {connected ? (pollError ? "TIMEOUT" : "LIVE") : "OFFLINE"}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.gold }]}>CONNECTION</Text>
        <View style={styles.ipRow}>
          <View style={[styles.ipInput, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Feather name="wifi" size={14} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <TextInput
              value={mowerIp}
              onChangeText={setMowerIp}
              style={[styles.ipText, { color: colors.white }]}
              placeholder="Mower IP Address"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="decimal-pad"
              editable={!connected}
            />
          </View>
          {connected ? (
            <TouchableOpacity
              style={[styles.connectBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleDisconnect}
            >
              <Text style={[styles.connectText, { color: colors.mutedForeground }]}>DISCONNECT</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.connectBtn, { backgroundColor: colors.gold }]}
              onPress={handleConnect}
              disabled={connecting}
            >
              {connecting
                ? <ActivityIndicator size="small" color={colors.background} />
                : <Text style={[styles.connectText, { color: colors.background }]}>CONNECT</Text>
              }
            </TouchableOpacity>
          )}
        </View>

        {connected && (
          <View style={styles.connMeta}>
            <View style={[styles.mowStatusChip, { borderColor: STATUS_COLORS[status.mowStatus] }]}>
              <View style={[styles.statusDotSmall, { backgroundColor: STATUS_COLORS[status.mowStatus] }]} />
              <Text style={[styles.mowStatusText, { color: STATUS_COLORS[status.mowStatus] }]}>
                {STATUS_LABELS[status.mowStatus]}
              </Text>
            </View>
            {lastPoll && (
              <Text style={[styles.pollTime, { color: colors.mutedForeground }]}>
                Updated {lastPoll.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </Text>
            )}
          </View>
        )}
      </View>

      {connected && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionLabelRow}>
            <Text style={[styles.sectionLabel, { color: colors.gold }]}>LIVE STATUS</Text>
            <Animated.View style={{ opacity: pulseAnim }}>
              <Feather name="activity" size={12} color={pollError ? colors.warning : colors.success} />
            </Animated.View>
          </View>

          <View style={styles.gaugeRow}>
            <LiveGauge
              label="Battery"
              value={status.battery}
              max={100}
              unit="%"
              color={batteryColor}
              warn={status.battery < 20}
              colors={colors}
            />
            <LiveGauge
              label="Blade RPM"
              value={status.bladeRpm}
              max={3000}
              unit="rpm"
              color={rpmColor}
              colors={colors}
            />
          </View>

          <View style={[styles.gaugeRow, { marginTop: 8 }]}>
            <LiveGauge
              label="Motor Temp"
              value={status.motorTemp}
              max={100}
              unit="°C"
              color={tempColor}
              warn={status.motorTemp > 70}
              colors={colors}
            />
            <LiveGauge
              label="WiFi Signal"
              value={status.wifiStrength}
              max={100}
              unit="%"
              color={colors.gold}
              colors={colors}
            />
          </View>

          <View style={[styles.sessionRow, { borderColor: colors.border }]}>
            <View style={styles.sessionItem}>
              <Feather name="clock" size={13} color={colors.gold} />
              <View>
                <Text style={[styles.sessionValue, { color: colors.white }]}>
                  {Math.floor(status.sessionMins / 60)}h {status.sessionMins % 60}m
                </Text>
                <Text style={[styles.sessionLabel, { color: colors.mutedForeground }]}>Session</Text>
              </View>
            </View>
            <View style={[styles.sessionDivider, { backgroundColor: colors.border }]} />
            <View style={styles.sessionItem}>
              <Feather name="maximize" size={13} color={colors.gold} />
              <View>
                <Text style={[styles.sessionValue, { color: colors.white }]}>{status.areaCovered} m²</Text>
                <Text style={[styles.sessionLabel, { color: colors.mutedForeground }]}>Area Covered</Text>
              </View>
            </View>
            <View style={[styles.sessionDivider, { backgroundColor: colors.border }]} />
            <View style={styles.sessionItem}>
              <Feather name="thermometer" size={13} color={colors.gold} />
              <View>
                <Text style={[styles.sessionValue, { color: colors.white }]}>{speed}%</Text>
                <Text style={[styles.sessionLabel, { color: colors.mutedForeground }]}>Speed Set</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.gold }]}>MODE</Text>
        <View style={styles.modeRow}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.modeBtn, {
                backgroundColor: mode === m.id ? colors.gold : colors.surface,
                borderColor: mode === m.id ? colors.gold : colors.border,
              }]}
              onPress={() => handleModeChange(m.id)}
              disabled={!connected}
            >
              <Feather name={m.icon as any} size={16} color={mode === m.id ? colors.background : connected ? colors.grayText : colors.border} />
              <Text style={[styles.modeText, { color: mode === m.id ? colors.background : connected ? colors.grayText : colors.border }]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.gold }]}>DIRECTIONAL CONTROL</Text>
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          {!connected
            ? "Connect to mower to enable controls"
            : mode !== "manual"
            ? "Switch to MANUAL mode to use directional controls"
            : "Hold button to drive"}
        </Text>

        <View style={styles.dpad}>
          <View style={styles.dpadRow}>
            <View style={styles.dpadEmpty} />
            <DpadBtn dir="forward" icon="arrow-up" label="FWD" />
            <View style={styles.dpadEmpty} />
          </View>
          <View style={styles.dpadRow}>
            <DpadBtn dir="left" icon="arrow-left" label="LEFT" />
            <TouchableOpacity
              style={[styles.stopBtn, {
                backgroundColor: currentDirection === "stop" ? colors.danger : colors.surface,
                borderColor: colors.danger,
                opacity: connected ? 1 : 0.3,
              }]}
              onPress={handleStop}
              disabled={!connected}
            >
              <Feather name="square" size={20} color={colors.danger} />
              <Text style={[styles.stopLabel, { color: colors.danger }]}>STOP</Text>
            </TouchableOpacity>
            <DpadBtn dir="right" icon="arrow-right" label="RIGHT" />
          </View>
          <View style={styles.dpadRow}>
            <View style={styles.dpadEmpty} />
            <DpadBtn dir="backward" icon="arrow-down" label="REV" />
            <View style={styles.dpadEmpty} />
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.gold }]}>SPEED — {speed}%</Text>
        <View style={styles.speedRow}>
          <TouchableOpacity
            style={[styles.speedBtn, { borderColor: colors.border }]}
            onPress={() => adjustSpeed(-10)}
            disabled={!connected}
          >
            <Feather name="minus" size={18} color={connected ? colors.white : colors.border} />
          </TouchableOpacity>
          <View style={[styles.speedBar, { backgroundColor: colors.surface }]}>
            <View style={[styles.speedFill, {
              width: `${speed}%` as any,
              backgroundColor: speed > 70 ? colors.danger : speed > 40 ? colors.gold : colors.success,
            }]} />
          </View>
          <TouchableOpacity
            style={[styles.speedBtn, { borderColor: colors.border }]}
            onPress={() => adjustSpeed(10)}
            disabled={!connected}
          >
            <Feather name="plus" size={18} color={connected ? colors.white : colors.border} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.bladeRow}>
          <View>
            <Text style={[styles.sectionLabel, { color: colors.gold }]}>BLADE MOTOR</Text>
            <Text style={[styles.hint, { color: blade ? colors.danger : colors.mutedForeground }]}>
              {blade
                ? status.bladeRpm > 0
                  ? `Running · ${status.bladeRpm} RPM`
                  : "Blade on — spinning up"
                : "Blade off"}
            </Text>
          </View>
          <Switch
            value={blade}
            onValueChange={handleBladeToggle}
            disabled={!connected}
            trackColor={{ false: colors.surface, true: colors.danger }}
            thumbColor={blade ? "#fff" : colors.grayText}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, paddingHorizontal: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  subtitle: { fontSize: 11, fontFamily: "Inter_400Regular", letterSpacing: 0.5, marginTop: 2 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDotSmall: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.5 },
  section: { borderWidth: 1, borderRadius: 4, padding: 16 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 2, marginBottom: 12 },
  sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  ipRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  ipInput: { flex: 1, flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 10 },
  ipText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13 },
  connectBtn: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 4, borderWidth: 1, alignItems: "center", justifyContent: "center", minWidth: 100 },
  connectText: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 1.5 },
  connMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  mowStatusChip: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  mowStatusText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.2 },
  pollTime: { fontSize: 10, fontFamily: "Inter_400Regular" },
  gaugeRow: { flexDirection: "row", gap: 8 },
  sessionRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
  sessionItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  sessionDivider: { width: 1, height: 32, marginHorizontal: 4 },
  sessionValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  sessionLabel: { fontSize: 9, fontFamily: "Inter_400Regular", letterSpacing: 0.5 },
  modeRow: { flexDirection: "row", gap: 8 },
  modeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderWidth: 1, borderRadius: 4 },
  modeText: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 1 },
  hint: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 16 },
  dpad: { alignItems: "center", gap: 8 },
  dpadRow: { flexDirection: "row", gap: 8 },
  dpadEmpty: { width: 72, height: 72 },
  dpadBtn: { width: 72, height: 72, borderWidth: 1, borderRadius: 4, alignItems: "center", justifyContent: "center", gap: 4 },
  dpadLabel: { fontSize: 9, fontFamily: "Inter_500Medium", letterSpacing: 1 },
  stopBtn: { width: 72, height: 72, borderWidth: 1, borderRadius: 4, alignItems: "center", justifyContent: "center", gap: 4 },
  stopLabel: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  speedRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  speedBtn: { width: 40, height: 40, borderWidth: 1, borderRadius: 4, alignItems: "center", justifyContent: "center" },
  speedBar: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  speedFill: { height: "100%", borderRadius: 4 },
  bladeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
