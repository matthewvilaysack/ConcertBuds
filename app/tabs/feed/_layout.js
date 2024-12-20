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
        headerTintColor: theme.colors.backgroundPrimary,
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
              <Text
                style={{
                  color: "#fff",
                  fontSize: 36,
                  fontWeight: '600',
                  // letterSpacing: 1,
                  fontWeight: "bold",
                  fontFamily: theme.typography.fontFamilies.primary // Add Doppio One font
                }}
              >
                ConcertBuds
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="searchresults"
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerBackTitleVisible: "false",
          headerTintColor: theme.colors.background.primary,
          headerStyle: {
            backgroundColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
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
          headerTintColor: theme.colors.background.primary, // Set back button color to white
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
        name="concertbuds"
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerBackTitleVisible: "false",
          headerTintColor: "white", // Set back button color to white
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
    </Stack>
  );
}
