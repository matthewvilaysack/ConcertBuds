import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "@/assets/theme";
import Images from "@/assets/Images";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SlotLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              colors={["rgba(132, 106, 227, 0.0)", "transparent"]}
              style={styles.gradient}
            />
          ),
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
          tabBarLabelStyle: { fontSize: 14 },
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
                      : theme.colors.tabBarInactive,
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
                      : theme.colors.tabBarInactive,
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
                      : theme.colors.tabBarInactive,
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
                      : theme.colors.tabBarInactive,
                  },
                ]}
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
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
