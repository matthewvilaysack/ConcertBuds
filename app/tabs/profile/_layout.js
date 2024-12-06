import { Stack } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import theme from "../../../assets/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
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
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold",}}>
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="details"
        options={{
          headerTitle: "Comments",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          headerTintColor: theme.colors.backgroundPrimary, // Set back button color to white
        }}
      />
    </Stack>
  );
}
