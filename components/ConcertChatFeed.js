import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";

const ConcertChatFeed = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.messageItem}>
          <Text style={styles.messageAuthor}>{item.user_id}</Text>
          <Text style={styles.messageContent}>{item.content}</Text>
          <Text style={styles.messageTimestamp}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
      )}
      style={styles.messageList}
    />
  );
};

const styles = StyleSheet.create({
  messageList: {
    flex: 1,
    padding: 8,
  },
  messageItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
  },
  messageAuthor: {
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  messageTimestamp: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
  },
});

export default ConcertChatFeed;
