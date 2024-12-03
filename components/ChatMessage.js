import { StyleSheet, Text, View, Image } from "react-native";
import Theme from "@/assets/theme";

export default function ChatMessage({ username, timestamp, text, avatarUrl }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <Text style={styles.username}>{username}</Text>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  avatar: {
    width: 50, // Increased size for better alignment
    height: 50, // Increased size for better alignment
    borderRadius: 25, // Make it a bigger circle
    marginRight: 8,
    marginTop: 4, // Slightly more down vertically
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    color: Theme.colors.text.white, // White color for username
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamilies.primary,
  },
  messageBubble: {
    backgroundColor: Theme.colors.background.secondary, // Light gray background for message bubble
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
  },
  messageText: {
    color: Theme.colors.text.primary, // Black color for message text
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Theme.typography.fontFamilies.primary,
  },
});