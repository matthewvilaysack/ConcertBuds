import React from "react";
import { View, StyleSheet, Text } from "react-native";
import ConcertChats from "../../../components/ConcertChats";
import Theme from "@/assets/theme";


const ChatScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Concert Chats</Text>
      <ConcertChats navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: 16,
  },
});

export default ChatScreen;
