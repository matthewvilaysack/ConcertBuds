// app/tabs/chat/_layout.js
import { Stack } from "expo-router";
import { ImageBackground, View, Text, StyleSheet } from "react-native";
import theme from "../../../assets/theme";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.backgroundPrimary,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          backgroundColor: "transparent",
          fontWeight: "bold",
        },
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTransparent: true,
          headerTitle: () => (
            <View
              style={{
                backgroundColor: "transparent",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Chat
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerTitle: "Chat Details",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensure the image covers the whole screen
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
