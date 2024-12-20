import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import ChatHeader from "@/components/ChatHeader";
import ConcertChatFeed from "@/components/ConcertChatFeed";
import ChatInput from "@/components/ChatInput";

const windowHeight = Dimensions.get("window").height;

const Details = () => {
  const params = useLocalSearchParams();
  const CURRENT_TAB_DETAILS = "/tabs/chat/details";
  console.log("PARAMS in details for chat ", params);
  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <ChatHeader
          user_id={params.user_id}
          artistName={params.artist_name}
          concertName={params.concert_name}
          location={params.location}
          date={params.concert_date}
          numUsers={params.num_users}
          address={params.address}
          textStyle={styles.text}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}
          style={styles.keyboardContainer}
        >
          <ConcertChatFeed
            concertId={params.concert_id}
            address={params.address}
          />
          <ChatInput concertId={params.concert_id} />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentWrapper: {
    flex: 1,
    position: "absolute",
    top: "8%",
    width: "100%",
    height: windowHeight * 0.8,
  },
  keyboardContainer: {
    flex: 1,
  },
  text: {
    color: Theme.colors.text.white,
  },
});
export default Details;
