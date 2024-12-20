import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image, StatusBar } from "react-native";
import ConcertChats from "../../../components/ConcertChats";
import Theme from "@/assets/theme";
import useSession from "@/utils/useSession";
import Loading from "@/components/Loading";
import Images from "@/assets/Images";
import BuddyChats from "../../../components/BuddyChats";

const ChatScreen = () => {
  const session = useSession();

  useEffect(() => {
    console.log("Session in ChatScreen:", session);
    if (session?.user) {
      console.log("User ID:", session.user.id);
    }
  }, [session]);

  if (!session) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Buddy Chats</Text>
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              Your buddy chats will show here.
            </Text>
          </View>
        {/* <BuddyChats currentTab="/tabs/chat/details" uuid={session.user.id} /> */}
        <Text style={styles.title}>Concert Chats</Text>
        <ConcertChats currentTab="/tabs/chat/details" uuid={session.user.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    position: "absolute",
    top: "8%",
    width: "100%",
    height: "89%",
    padding: 20,
  },
  title: {
    fontSize: 36,
    marginBottom: 12, 
    color: Theme.colors.text.white,
    fontFamily: Theme.typography.fontFamilies.primary,
  },
  emptyStateContainer: {
    width: '100%',
    padding: 16,
    marginBottom: 24,
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Theme.colors.text.white,
    textAlign: 'center',
    opacity: 0.7,
    fontFamily: Theme.typography.fontFamilies.primary,
  }
});

export default ChatScreen;
