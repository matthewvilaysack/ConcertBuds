import { Stack } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import theme from "../../../assets/theme";
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
            backgroundColor: "transparent", // Semi-transparent black
            elevation: 0, // Removes shadow on Android
            shadowOpacity: 0, // Removes shadow on iOS
            borderBottomWidth: 0, // Removes border on both platforms
          },
          headerTransparent: true,
          headerTitle: () => (
            <View
              style={{
                backgroundColor: "transparent", // Transparent header background
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                ConcertBuds
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="details"
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerBackTitleVisible: "false",
          headerStyle: {
            backgroundColor: "transparent", // Semi-transparent black
            elevation: 0, // Removes shadow on Android
            shadowOpacity: 0, // Removes shadow on iOS
            borderBottomWidth: 0, // Removes border on both platforms
          },
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="markgoing"
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerBackTitleVisible: "false",
          headerStyle: {
            position: "absolute",
            backgroundColor: "transparent", // Semi-transparent black
            elevation: 0, // Removes shadow on Android
            shadowOpacity: 0, // Removes shadow on iOS
            borderBottomWidth: 0, // Removes border on both platforms
          },
          headerTransparent: true,
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
