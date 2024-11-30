import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "@/assets/theme";
import Images from "@/assets/Images";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent", 
          borderTopWidth: 0,
          paddingHorizontal: 10,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(132, 106, 227, 0.0)", "transparent"]} // Subtle gradient
            style={styles.gradient}
          />
        ),
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarActive,
        tabBarLabelStyle: {
          fontSize: 14,
          // marginBottom: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.home}
              style={[
                styles.icon,
                {
                  tintColor: focused
                    ? theme.colors.tabBarActive
                    : theme.colors.tabBarActive,
                },
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.map}
              style={[
                styles.icon,
                {
                  tintColor: focused
                    ? theme.colors.tabBarActive
                    : theme.colors.tabBarActive,
                },
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.chat_icon}
              style={[
                styles.icon,
                {
                  tintColor: focused
                    ? theme.colors.tabBarActive
                    : theme.colors.tabBarActive,
                },
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.profile_icon}
              style={[
                styles.icon,
                {
                  tintColor: focused
                    ? theme.colors.tabBarActive
                    : theme.colors.tabBarActive,
                },
              ]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 38,
    height: 38,
    resizeMode: "contain",
    marginTop: 5,
  },
  gradient: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
