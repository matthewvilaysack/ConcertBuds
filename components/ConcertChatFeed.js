import React, { useState, useEffect, useRef } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";
import ChatMessage from "@/components/ChatMessage";

const ConcertChatFeed = ({ concertId }) => {
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  // Initial fetch of messages
  const fetchMessages = async () => {
    console.log("Fetching messages for concert:", concertId);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles:user_id(username, avatar_url)")
        .eq("concert_id", concertId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("Fetched messages:", data);
      setMessages(data || []);

      // Build profiles map
      const profiles = {};
      data?.forEach((message) => {
        if (message.profiles) {
          profiles[message.user_id] = {
            username: message.profiles.username,
            avatarUrl: message.profiles.avatar_url,
          };
        }
      });
      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(); // Keep this to fetch initial messages

    // Set up broadcast channel
    const channel = supabase
      .channel(`concert-chat-${concertId}`)
      .on(
        'broadcast',
        { event: 'new-message' },
        async (payload) => {
          console.log('Received broadcast message:', payload);
          
          // Add the new message to state
          if (payload.payload) {
            setMessages(currentMessages => [...currentMessages, payload.payload]);
            
            // Update profiles if needed
            if (payload.payload.profiles) {
              setUserProfiles(current => ({
                ...current,
                [payload.payload.user_id]: {
                  username: payload.payload.profiles.username,
                  avatarUrl: payload.payload.profiles.avatar_url,
                },
              }));
            }

            // Scroll to bottom
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatMessage
            username={item.profiles?.username || userProfiles[item.user_id]?.username}
            avatarUrl={item.profiles?.avatar_url || userProfiles[item.user_id]?.avatarUrl}
            timestamp={new Date(item.created_at).toLocaleTimeString()}
            text={item.content}
          />
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
        style={styles.messageList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
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
