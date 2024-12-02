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
          backgroundColor: "transparent", // Transparent header background
          fontWeight: "bold",
        },
        headerTransparent: true, // Enables true header transparency
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
                Plan Commute
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="preferences"
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerBackTitle: "",
          headerTintColor: "white", // Set back button color to white
          headerBackTitleVisible: "false",
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerTitle: "Map Details",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          headerTintColor: theme.colors.backgroundPrimary, // Set back button color to white
        }}
      />
    </Stack>
  );
}
