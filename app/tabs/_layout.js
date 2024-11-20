import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import theme from "../../assets/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundPrimary,
        },
        headerStyle: {
          backgroundColor: theme.colors.backgroundPrimary,
          elevation: 0, // Android
          shadowOpacity: 0, // iOS
          borderBottomWidth: 0, // General
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              size={size}
              name="beehive-outline"
              color={color}
            />
          ),
          headerShown: false, // Hide the header for this screen
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
