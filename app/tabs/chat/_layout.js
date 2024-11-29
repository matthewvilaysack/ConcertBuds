// app/tabs/chat/_layout.js
import { Stack } from "expo-router";
import { View, Text } from "react-native";
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