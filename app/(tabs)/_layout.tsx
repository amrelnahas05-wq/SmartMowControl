import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="control">
        <Icon sf={{ default: "slider.horizontal.3", selected: "slider.horizontal.3" }} />
        <Label>Control</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="features">
        <Icon sf={{ default: "list.bullet", selected: "list.bullet" }} />
        <Label>Features</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>About</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: "Inter_700Bold",
          fontSize: 13,
          letterSpacing: 1.5,
        },
        headerShadowVisible: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          letterSpacing: 0.5,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "SMARTMOW",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
          title: "CONTROL PANEL",
          tabBarLabel: "Control",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="slider.horizontal.3" tintColor={color} size={22} />
            ) : (
              <Feather name="sliders" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          title: "OVERVIEW",
          tabBarLabel: "Features",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="list.bullet" tintColor={color} size={22} />
            ) : (
              <Feather name="list" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "TEAM & ROADMAP",
          tabBarLabel: "About",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person.2" tintColor={color} size={22} />
            ) : (
              <Feather name="users" size={20} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
