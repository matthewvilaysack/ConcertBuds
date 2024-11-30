import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot } from "expo-router";
import ChatProvider from "@/providers/ChatProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChatProvider>
        <Slot />
      </ChatProvider>
    </GestureHandlerRootView>
  );
}
