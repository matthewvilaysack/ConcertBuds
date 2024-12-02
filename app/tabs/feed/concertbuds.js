import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, StatusBar, ActivityIndicator, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import ConcertItem from "@/components/ConcertItem";
import Images from "@/assets/Images";
import ConcertUsersGoing from "@/components/ConcertUsersGoing";
import Button from "@/components/Button";
import { supabase } from '@/lib/supabase';
import { getUserConcerts, getConcertAttendees, createChatRoom, joinChatRoom, createOrJoinChatRoom } from '@/lib/concert-db';
import Theme from "@/assets/theme";
import useSession from '@/utils/useSession';
import {useLocalSearchParams} from 'expo-router';
export default function ConcertBudsScreen() {
  const router = useRouter();
  const session = useSession();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [concert, setConcert] = useState(null);
  const params = useLocalSearchParams();
  // fix this to get the concert id from the params
  useEffect(() => {
    const loadConcertData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const concerts = await getUserConcerts(user.id);
          if (concerts && concerts.length > 0) {
            setConcert(concerts[0]);
            const attendeeData = await getConcertAttendees(concerts[0].concert_id);
            setAttendees(attendeeData || []);
          }
        }
      } catch (error) {
        console.error("Error loading concert data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConcertData();
  }, []);

  const handleJoinChat = async () => {
    if (!concert || !session.user) {
      console.error("Concert or session.user is missing");
      return;
    }
  
    const userId = session.user.id;
    let username;
  
    try {
      // Fetch username from profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();
  
      if (error) {
        throw new Error("Error fetching username: " + error.message);
      }
  
      if (!data?.username) {
        throw new Error("Username not found for user ID: " + userId);
      }
  
      username = data.username;
  
      console.log("Joining chat with:", {
        concertId: concert.concert_id,
        userId,
        username,
      });
      console.log("num users before");

      // Create or join the chat room
      const chatRoom = await createOrJoinChatRoom(
        concert.concert_id,
        userId,
        username
      );
    console.log(chatRoom);
      // console.log("num users:", chatRoom.num_users);
  
      Alert.alert("Success", "You have successfully joined the chat!");
      router.push({
        pathname: "/tabs/chat/details",
        params: {
          user_id: userId,
          concert_id: concert.concert_id,
          concert_name: concert.concert_name,
          location: concert.location,
          address: concert.address,
          concert_date: concert.concert_date,
          // num_users: chatRoom.num_users || 0, // Pass num_users
        },
      });
    } catch (error) {
      console.error("Error joining chat:", error);
      Alert.alert("Error", "Failed to join the chat. Please try again.");
    }
  };
  
  
  

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#846AE3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        {concert && (
          <ConcertItem
            key={concert.concert_id}
            item={{
              id: concert.concert_id,
              name: concert.concert_name,
              dates: {
                start: {
                  localDate: concert.concert_date
                }
              },
              _embedded: {
                venues: [{
                  city: {
                    name: concert.location.split(', ')[0]
                  },
                  state: {
                    stateCode: concert.location.split(', ')[1]
                  }
                }]
              }
            }}
            destination="/tabs/feed/concertbuds"
            hasRSVPed={true}
            style={styles.itemSpacing}
          />
        )}
        <ConcertUsersGoing
          key={concert?.concert_id}
          attendees={attendees}
          concertId={concert?.concert_id}
          style={styles.itemSpacing}
        />
       <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
          <TouchableOpacity style={styles.joinChatButton} onPress={handleJoinChat}>
            <Text style={styles.joinChatButtonText}>Join the Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    position: "absolute",
    top: "11%",
    alignItems: "center",
    width: "100%",
    height: "89%",
    padding: 20,
  },
  itemSpacing: {
    marginBottom: 20, // Adjust this value to match the spacing of the join chat button
  },
  joinChatButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15, // Thicker padding
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
    height: 70, // Slightly taller height
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Ensure correct vertical spacing
  },
  joinChatButtonText: {
    color: "#000000",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Doppio",
  },
  button: {
    backgroundColor: Theme.colors.primary, // Use theme primary color
    borderRadius: 10, // Match the rounded corners of the concert section
    alignItems: "center",
    justifyContent: "center",
    height: 50, // Fixed height
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: Theme.colors.text.black, // White text
    fontSize: 16,
    fontWeight: "bold",
  },
});
