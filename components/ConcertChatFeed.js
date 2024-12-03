import React, { useState, useEffect } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";
import ChatMessage from "@/components/ChatMessage";

const ConcertChatFeed = ({ concertId }) => {
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async (page) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles:user_id(username, avatar_url)")
        .eq("concert_id", concertId)
        .order("created_at", { ascending: false })
        .range((page - 1) * 20, page * 20 - 1); // Fetch 20 messages per page

      if (error) throw error;

      if (data.length < 20) {
        setHasMore(false);
      }

      // Build a map of user profiles for easy lookup
      const profiles = {};
      data.forEach((message) => {
        profiles[message.user_id] = {
          username: message.profiles.username,
          avatarUrl: message.profiles.avatar_url,
        };
      });
      setUserProfiles((prevProfiles) => ({ ...prevProfiles, ...profiles }));
      setMessages((prevMessages) => [...prevMessages, ...data]);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages(page);
  }, [concertId, page]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading && page === 1) {
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
            username={userProfiles[item.user_id]?.username}
            avatarUrl={userProfiles[item.user_id]?.avatarUrl}
            timestamp={new Date(item.created_at).toLocaleTimeString()}
            text={item.content}
          />
        )}
        inverted // Start at the latest messages
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
