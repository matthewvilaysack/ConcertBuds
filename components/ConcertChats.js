import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";

const ConcertChats = ({ navigation }) => {
  const [concertChats, setConcertChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConcertChats = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }
  
      console.log("Fetching concert chats for user:", user.id);
  
      const { data, error } = await supabase
        .from('user_concerts')
        .select(`
          concert_id,
          concert_name,
          location,
          address,
          concert_date,
          join_chat,
          chat_rooms (num_users)
        `)
        .eq('user_id', user.id)
        .eq('join_chat', true);
  
      console.log("Query response:", data);
      if (error) {
        console.error("Query error:", error);
        throw error;
      }
  
      setConcertChats(data);
    } catch (error) {
      console.error("Error fetching concert chats:", error.message);
    }
    setIsLoading(false);
  };
  

  useEffect(() => {
    fetchConcertChats();
  }, []);

  const handleNavigate = (concert) => {
    navigation.navigate("ConcertChatDetails", {
      concert_id: concert.concert_id,
      concert_name: concert.concert_name,
      concert_location: concert.location,
      address: concert.address,
      concert_date: concert.concert_date,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.textPrimary} />
        <Text style={styles.loadingText}>Loading Chats...</Text>
      </View>
    );
  }

  if (concertChats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No concert chats available</Text>
      </View>
    );
  }

  return (
    <FlatList
    data={concertChats}
    keyExtractor={(item) => item.concert_id.toString()} // Ensure the key is unique
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => handleNavigate(item)}>
        <View style={styles.chatItem}>
          <Text style={styles.chatName}>
            {item.concert_name} • {item.location}
          </Text>
          <Text style={styles.chatDate}>
            {new Date(item.concert_date).toDateString()}
          </Text>
          <Text style={styles.chatUsers}>
            {item.chat_rooms ? item.chat_rooms.num_users : 0} people in chat
          </Text>
        </View>
      </TouchableOpacity>
    )}
  />
  
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  chatItem: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
  },
  chatDate: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  chatUsers: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  loadingText: {
    fontSize: 18,
    color: Theme.colors.textPrimary,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  emptyText: {
    fontSize: 18,
    color: Theme.colors.textSecondary,
  },
});

export default ConcertChats;

