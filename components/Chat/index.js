
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Theme from "../assets/theme";
import { useRouter } from "expo-router";
import supabase from "@/lib/supabase";
import timeAgo from '@/utils/timeAgo';


const windowWidth = Dimensions.get("window").width;

const ConcertChats = ({ currentTab, uuid }) => {
  const [concerts, setConcerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Add debugging for props
  useEffect(() => {
    console.log("ConcertChats mounted with uuid:", uuid);
  }, []);

  const fetchConcerts = async () => {
    console.log("Starting fetchConcerts...");
    setIsLoading(true);
    try {
      console.log("Current UUID:", uuid);
  
      if (!uuid) {
        console.log("No UUID provided, skipping fetch");
        setIsLoading(false);
        return;
      }
  
      // Get user concerts with join_chat = true
      const { data: joinedConcerts, error: joinedError } = await supabase
        .from('user_concerts')
        .select(`
          concert_id,
          concert_name,
          location,
          address,
          concert_date,
          join_chat
        `)
        .eq('user_id', uuid)
        .eq('join_chat', true);
  
      console.log("Joined concerts:", joinedConcerts);
  
      if (joinedError) {
        console.error("Error fetching joined concerts:", joinedError);
        return;
      }
  
      // Get chat room data for these concerts
      const concertIds = joinedConcerts?.map(c => c.concert_id) || [];
      console.log("Concert IDs to fetch:", concertIds);
  
      const { data: chatRooms, error: chatRoomsError } = await supabase
        .from('chat_rooms')
        .select('concert_id, num_users')
        .in('concert_id', concertIds);
  
      console.log("Chat rooms data:", chatRooms);
  
      if (chatRoomsError) {
        console.error("Error fetching chat rooms:", chatRoomsError);
        return;
      }
  
      // Get latest message for each concert
      const { data: latestMessages, error: messagesError } = await supabase
        .from('messages')
        .select('concert_id, created_at')
        .in('concert_id', concertIds)
        .order('created_at', { ascending: false });
  
      console.log("Latest messages:", latestMessages);
  
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return;
      }
  
      // Combine all data
      const formattedConcerts = joinedConcerts.map(concert => {
        const eventDate = concert.concert_date
          ? new Date(concert.concert_date + 'T00:00:00')
          : new Date();
  
        const chatRoom = chatRooms?.find(room => room.concert_id === concert.concert_id);
        const lastMessage = latestMessages?.find(msg => msg.concert_id === concert.concert_id);
  
        console.log(`Formatting concert ${concert.concert_id}:`, {
          chatRoom,
          lastMessage,
          eventDate
        });
  
        return {
          ...concert,
          month: eventDate.toLocaleString("en-US", { month: "short" }),
          day: eventDate.getDate(),
          num_users: chatRoom?.num_users || 0,
          last_message_time: lastMessage?.created_at 
            ? timeAgo(lastMessage.created_at)
            : 'No messages yet'
        };
      });
  
      console.log("Final formatted concerts:", formattedConcerts);
      setConcerts(formattedConcerts);
    } catch (error) {
      console.error("Error in fetchConcerts:", error);
    }
    setIsLoading(false);
  };

  // Add useEffect to trigger fetchConcerts when uuid changes
  useEffect(() => {
    if (uuid) {
      console.log("UUID changed, fetching concerts...");
      fetchConcerts();
    }
  }, [uuid]);
  const handleNavigate = (concert) => {
    router.push({
      pathname: "/tabs/chat/details",
      params: {
        concert_id: concert.concert_id,
        concert_name: concert.concert_name,
        concert_location: concert.location,
        address: concert.address,
        concert_date: concert.concert_date,
      }
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Theme.colors.text.primary} />
      </View>
    );
  }
  console.log("CONCERTS", concerts);
  return (
    <View style={styles.container}>
      {concerts.map((concert, index) => (
        <TouchableOpacity key={index} onPress={() => handleNavigate(concert)}>
          <View style={styles.artistContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>{concert.month}</Text>
              <Text style={styles.day}>{concert.day}</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.concertName}>
                  {concert.concert_name} • {concert.location}
                </Text>
              </View>
              <View style={styles.headerRow}>
                <Text style={styles.numGoing}>
                  {concert.num_users} people in chat
                </Text>
              </View>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.lastMessageTime}>
                {concert.last_message_time}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.primary, // Ensure this matches Feed's background
    paddingHorizontal: "4%",
    width: windowWidth,
  },
  artistContainer: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.background.primary,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    fontSize: 16,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    marginBottom: 2,
  },
  day: {
    fontSize: 24,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontSize: 18,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.secondary,
    flex: 1,
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goingButton: {
    backgroundColor: Theme.colors.primary.main,
    borderRadius: Theme.borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  goingText: {
    color: Theme.colors.text.white,
    fontFamily: Theme.typography.fontFamilies.primary,
    fontSize: 14,
  },
  artistName: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    marginTop: 4,
  },
  concertName: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    marginTop: 4,
  },
  concertDate: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.secondary,
  },
  numGoing: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.secondary,
    marginTop: 4,
  },
  lastMessageTime: {
    fontSize: 12,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.tertiary,
    marginTop: 4,
  },
});

export default ConcertChats;