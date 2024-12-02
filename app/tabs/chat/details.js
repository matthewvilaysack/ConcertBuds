import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Theme from "@/assets/theme";
import ConcertChatFeed from "@/components/ConcertChatFeed";
import ChatInput from "@/components/ChatInput";
import { useLocalSearchParams } from "expo-router";

const Details = ({ route }) => {
  console.log(route);
  const params = useLocalSearchParams();
  const CURRENT_TAB_DETAILS = "/tabs/profile/details";
  const { user_id, concert_id, concert_name, location, concert_date } = params;
  console.log("concert name", concert_name);

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.concertName}>{concert_name}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.date}>
          {new Date(concert_date).toDateString()}
        </Text>
        {/* <Text style={styles.participants}>
          {num_users} people in this chat
        </Text> */}
      </View>
      <View style={styles.chatFeedContainer}>
        <ConcertChatFeed chatRoomId={concert_id} />
      </View>
      <View style={styles.chatInputContainer}>
        <ChatInput chatRoomId={concert_id} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
  },
  concertName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  date: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  participants: {
    fontSize: 14,
    color: Theme.colors.textHighlighted,
    marginTop: 8,
  },
  chatFeedContainer: {
    flex: 1,
  },
  chatInputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: Theme.colors.border,
  },
});

export default Details;
