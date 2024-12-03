import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Theme from "@/assets/theme";

const ChatHeader = ({ concertName, location, date, numUsers }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.concertName}>{concertName}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.date}>{date}</Text>
      {numUsers !== undefined && (
        <Text style={styles.numUsers}>{`${numUsers} people in this chat`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
  },
  concertName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.colors.text.white,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Theme.colors.text.white,
  },
  date: {
    fontSize: 14,
    color: Theme.colors.text.white,
    marginTop: 4,
  },
  numUsers: {
    fontSize: 14,
    color: Theme.colors.text.white,
    marginTop: 8,
  },
});

export default ChatHeader;
