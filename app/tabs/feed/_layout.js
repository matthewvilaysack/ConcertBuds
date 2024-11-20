import { Stack } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import theme from "../../../assets/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import HeaderButton from "../../../components/HeaderButton"; // Path to your custom HeaderButton component

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
      <Stack.Screen
        name="newpost"
        options={{
          headerTitle: "New Post",
          headerLeft: () => (
            <HeaderButton
              title="Cancel"
              onPress={() => router.back()}
              disabled={false}
              colors={[theme.colors.textPrimary, theme.colors.textPrimary]}
            />
          ),
          headerRight: () => (
            <HeaderButton
              title="Submit"
              onPress={() => router.back()}
              disabled={true}
              colors={[
                theme.colors.textSecondary,
                theme.colors.textHighlighted,
              ]}
            />
          ),
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
