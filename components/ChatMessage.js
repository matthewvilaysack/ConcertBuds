import { StyleSheet, Text, View, Image } from "react-native";

export default function ChatMessage({ username, timestamp, text, avatarUrl }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <Text style={styles.username}>{username}</Text>
        <View style={styles.messageContainer}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{text}</Text>
          </View>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
  },
  avatar: {
    width: 60, // Increased size for better accessibility
    height: 60, // Increased size for better accessibility
    borderRadius: 30,
    marginRight: 12, // Increased margin for better spacing
    backgroundColor: "#D9D9D9", // Placeholder background if no image
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16, // Increased font size for better readability
    color: "#FFFFFF", // White text for username
    fontFamily: "Doppio One",
    marginBottom: 4,
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: "column",
  },
  messageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
    borderRadius: 20,
    paddingHorizontal: 16, // Increased padding for better readability
    paddingVertical: 10, // Increased padding for better readability
    maxWidth: 250, // Increased max width for better readability
    flexShrink: 1,
  },
  messageText: {
    color: "#000000", // Black text for message
    fontSize: 16, // Increased font size for better readability
    fontFamily: "Doppio One",
    lineHeight: 20, // Adjusted line height for better readability
  },
  timestamp: {
    color: "#FFFFFF", // White text for timestamp
    fontSize: 12, // Increased font size for better readability
    marginTop: 4,
    marginLeft: 8,
    fontFamily: "Doppio One",
    alignSelf: "flex-start", // Left-align the timestamp
  },
});
