import React, {useState, useEffect} from "react";
import { StyleSheet, View, Image, StatusBar, ActivityIndicator} from "react-native";
import { useRouter } from "expo-router";
import ConcertBudsPage from "@/components/ConcertBudsPage";
import ConcertItem from "@/components/ConcertItem";
import Images from "@/assets/Images";
import ConcertUsersGoing from "@/components/ConcertUsersGoing";
import Button from "@/components/Button";
import { supabase } from '@/lib/supabase';

export default function ConcertBudsScreen() {
  const router = useRouter();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [concertData, setConcertData] = useState(null);

  // Load current user's concert and attendees
  useEffect(() => {
    const loadConcertData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's RSVPed concerts
        const concerts = await getUserConcerts(user.id);
        console.log("User concerts:", concerts);

        if (concerts && concerts.length > 0) {
          // Set the concert data
          setConcertData(concerts[0]); // Using the first concert for now

          // Get attendees for this concert
          const attendeeData = await getConcertAttendees(concerts[0].concert_id);
          setAttendees(attendeeData || []);
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
    if (concertData) {
      router.push({
        pathname: "/tabs/chat",
        params: {
          concertId: concertData.concert_id,
          concertName: concertData.concert_name,
          artist: concertData.artist
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
        {concertData && (
          <ConcertItem 
            item={concertData}
            destination="/tabs/feed/concertbuds"
          />
        )}
        <ConcertUsersGoing 
          attendees={attendees}
          concertId={concertData?.concert_id}
        />
        <View style={styles.button}>
          <Button 
            label={`Join the Chat`}
            onPress={handlePress}
          />
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
    height: "89%", // Add this line
    padding: 20,
  },
  button: {
    marginTop: 20,
    height: "10%",
    width: "100%",
  },
});
