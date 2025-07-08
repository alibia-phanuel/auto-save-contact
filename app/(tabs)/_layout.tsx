import { MaterialCommunityIcons } from "@expo/vector-icons"; // ✅ Import nouvelle librairie d’icônes
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f15454",
        tabBarStyle: {
          backgroundColor: "#000", // ton fond personnalisé
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 6,
          height: Platform.OS === "ios" ? 80 : 60,
          position: "absolute",
          borderRadius: 20,
          marginHorizontal: 10,
          marginBottom: 10,
          elevation: 10, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 10,
          bottom: 50,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Save",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="content-save"
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
