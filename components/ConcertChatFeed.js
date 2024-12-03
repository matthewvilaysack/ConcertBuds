import React, { useState, useEffect } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";
import ChatMessage from "@/components/ChatMessage";

const ConcertChatFeed = ({ concertId }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log("CHATROOMID", concertId);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("concert_id", concertId)
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
  }, [concertId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.feedContainer}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatMessage
            username={item.user_id}
            timestamp={new Date(item.created_at).toLocaleTimeString()}
            text={item.content}
          />
        )}
        style={styles.messageList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    padding: 8,
  },
  messageList: {
    flex: 1,
    padding: 8,
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
