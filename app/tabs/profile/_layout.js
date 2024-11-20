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
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                size={32}
                name="bee"
                color={theme.colors.iconHighlighted}
              />
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Buzz
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
        }}
      />
    </Stack>
  );
}
