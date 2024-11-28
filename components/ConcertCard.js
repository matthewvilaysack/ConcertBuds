import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from "react-native";
import { router } from "expo-router";
import supabase from '@/lib/supabase';
import { RSVPForConcert, unRSVPFromConcert, getUserConcerts } from '@/lib/concert-db';
const windowWidth = Dimensions.get("window").width;

const ConcertCard = ({ item }) => {
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(false);
   
  console.log("Full item data from Ticketmaster:", JSON.stringify(item, null, 2));

  const { name, dates, _embedded, id } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name;
  const state = venue?.state?.stateCode;
  const artistName = name ? name.split(' at ')[0] : "Unknown Artist"; 

  console.log("Extracted main fields:", {
    id,
    name,
    artistName, 
    dates: dates?.start,
    venue: venue
  });

  const eventDate = dates?.start?.localDate
    ? new Date(dates.start.localDate)
    : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  const locationText = city && state ? `${city}, ${state}` : "Location TBD";


  useEffect(() => {
    const checkRSVPStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userConcerts = await getUserConcerts(user.id);
          const hasRSVPed = userConcerts?.some(concert => concert.concert_id === id);
          setIsRSVPed(hasRSVPed);
        }
      } catch (error) {
        console.error("Error checking RSVP status:", error);
      }
    };
    checkRSVPStatus();
  }, [id]);

  const handleRSVP = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User", user);
      
      if (!user) {
        Alert.alert("Error", "Please sign in to RSVP for concerts");
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (isRSVPed) {
        await unRSVPFromConcert(user.id, id);
        setIsRSVPed(false);
        Alert.alert("Success", "You've removed your RSVP");
      } else {
        console.log("profile", profile)
        await RSVPForConcert({
          userId: user.id,
          username: profile?.username || user.email,
          concertId: id,
          concertName: name || "Untitled Event",
          artist: artistName,
          location: locationText,
          concertDate: dates?.start?.localDate || new Date().toISOString(),
          avatarUrl: profile?.avatar_url
        });
        setIsRSVPed(true);
        Alert.alert("Success", "You're now going to this concert!");
      }
    } catch (error) {
      console.error("Error handling RSVP:", error);
      Alert.alert("Error", "Failed to update RSVP status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.artistImageContainer}>
      <View>
        <Image
          source={{
            uri: "https://media.pitchfork.com/photos/6614092742a7de97785c7a48/master/pass/Billie-Eilish-Hit-Me-Hard-and-Soft.jpg",
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
          <View>
            <Text style={styles.artistName}>Wed 7 PM</Text>
          </View>
        </View>

        <View style={styles.artistHeader}>
          <Text style={styles.location}>{locationText}</Text>
          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
          <View>
            <Text style={styles.artistName}>Frost Amphitheater</Text>
          </View>
        </View>
      </View>
      <View style={styles.goingContainer}>
        <TouchableOpacity 
          style={[
            styles.goingButton,
            isRSVPed && styles.goingButtonRSVPed,
            loading && styles.goingButtonDisabled
          ]} 
          onPress={handleRSVP}
          disabled={loading}
        >
          <Text style={styles.goingText}>
            {loading ? 'Loading...' : isRSVPed ? 'Cancel RSVP' : 'Going'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artistImageContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
    position: "relative",
    width: windowWidth * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    marginBottom: 20,
  },
  artistContainer: {
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 20,
  },
  dateContainer: {
    marginTop: "5%",
    marginLeft: "5%",
    marginBottom: "5%",
    flexDirection: "column",
    alignItems: "center",
  },
  month: {
    fontFamily: "Doppio",
    fontSize: 20,
    color: "#000000",
  },
  day: {
    fontFamily: "Doppio",
    fontSize: 40,
    color: "#000000",
  },
  artistHeader: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "5%",
    paddingLeft: "5%",
    flex: 1,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  variantRadius: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  location: {
    fontFamily: "Doppio",
    fontSize: 28,
    color: "#000000",
  },
  artistName: {
    fontFamily: "Doppio",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    marginTop: 5,
  },
  image: {
    width: windowWidth * 0.9,
    height: windowWidth * 0.7,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  goingContainer: {
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: "10%",
    paddingTop: 0,
    alignSelf: "stretch",
    paddingBottom: "8%",
  },
  goingButton: {
    backgroundColor: "#846AE3",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  goingText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Doppio",
  },
  goingButtonRSVPed: {
    backgroundColor: '#ff4444',
  },
  goingButtonDisabled: {
    opacity: 0.5,
  }
});

export default ConcertCard;
