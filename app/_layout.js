import { Slot } from "expo-router";
import { ImageBackground, StyleSheet, StatusBar } from "react-native";

export default function SlotLayout() {
  // Override default layout to ensure that our screen background bleeds
  // into the status bar.

  return (
    <ImageBackground
      source={require("@/assets/Images/background.png")} // Replace with your image path
      style={styles.background}
    >
      <Slot />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensure the image covers the whole screen
  },
});
