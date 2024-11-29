import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, StatusBar, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import ConcertBudsPage from "@/components/ConcertBudsPage";
import ConcertItem from "@/components/ConcertItem";
import Images from "@/assets/Images";
import ConcertUsersGoing from "@/components/ConcertUsersGoing";
import Button from "@/components/Button";
import { supabase } from '@/lib/supabase';
import { getUserConcerts, getConcertAttendees } from '@/lib/concert-db';
import Theme from "@/assets/theme";

export default function ConcertBudsScreen() {
  const router = useRouter();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [concert, setConcert] = useState(null);

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

  const handlePress = () => {
    if (concert) {
      router.push({
        pathname: "/tabs/chat",
        params: {
          concertId: concert.concert_id,
          concertName: concert.concert_name,
          artist: concert.artist
        }
      });
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
          attendees={attendees}
          concertId={concert?.concert_id}
          style={styles.itemSpacing}
        />
        <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
          <TouchableOpacity style={styles.joinChatButton} onPress={handlePress}>
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
