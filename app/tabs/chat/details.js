import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Theme from "@/assets/theme";
import ChatHeader from "@/components/ChatHeader";
import ConcertChatFeed from "@/components/ConcertChatFeed";
import ChatInput from "@/components/ChatInput";

const Details = () => {
  const params = useLocalSearchParams();
  const CURRENT_TAB_DETAILS = "/tabs/chat/details";
  console.log("PARAMS", params);
  return (
    <View style={styles.container}>
      <ChatHeader
        concertName={params.concert_name}
        location={params.location}
        date={params.concert_date}
        numUsers={params.num_users}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}
        style={styles.keyboardContainer}
      >
        <ConcertChatFeed chatRoomId={params.concertId} />
        <ChatInput chatRoomId={params.concertId} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  keyboardContainer: {
    flex: 1,
  },
});

export default Details;
