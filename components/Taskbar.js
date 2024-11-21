import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import linear gradient
import { useRouter } from "expo-router";
import Images from "@/assets/Images";

const Taskbar = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#846AE3", "#6456B7", "#453D92"]} // Gradient with solid colors
      style={styles.container}
    >
      {/* Home Icon */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("/tabs/feed")}>
        <Image source={Images.home} style={styles.icon} />
        <Text style={styles.iconLabel}>Home</Text>
      </TouchableOpacity>

      {/* Map Icon */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("/tabs/map")}>
        <Image source={Images.map} style={styles.icon} />
        <Text style={styles.iconLabel}>Map</Text>
      </TouchableOpacity>

      {/* Chat Icon */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("/tabs/chat")}>
        <Image source={Images.chat_icon} style={styles.icon} />
        <Text style={styles.iconLabel}>Chat</Text>
      </TouchableOpacity>

      {/* Profile Icon */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("/tabs/profile")}>
        <Image source={Images.profile_icon} style={styles.icon} />
        <Text style={styles.iconLabel}>Profile</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: 110,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  iconWrapper: {
    alignItems: "center",
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
});

export default Taskbar;
