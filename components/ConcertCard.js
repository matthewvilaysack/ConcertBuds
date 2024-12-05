import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import supabase from "@/lib/supabase";
import {
  RSVPForConcert,
  unRSVPFromConcert,
  getUserConcerts,
  checkUserRSVPStatus,
} from "@/lib/concert-db"; // Update this import
import Theme from "../assets/theme";
const windowWidth = Dimensions.get("window").width;

const ConcertCard = ({ item, onRSVPChange }) => {
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    id,
    name,
    artist,
    concertName,
    date,
    dayOfWeek,
    concertTime,
    dateTime,
    address,
    location,
    city,
    state,
    venue,
    imageUrl,
    timezone,
  } = item || {};

  // Format the date correctly
  const eventDate = date
    ? new Date(date + "T00:00:00") // Add time component to preserve local date
    : new Date();

  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  // Use the passed dayOfWeek and concertTime or format from date if not provided
  const displayTime = concertTime || "Time TBD";
  const locationText = city && state ? `${city}, ${state}` : `${city}`;

  useEffect(() => {
    const checkRSVPStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const hasRSVPed = await checkUserRSVPStatus(user.id, id);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("User", user);

      if (!user) {
        Alert.alert("Error", "Please sign in to RSVP for concerts");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (isRSVPed) {
        await unRSVPFromConcert(user.id, id);
        setIsRSVPed(false);
        if (onRSVPChange) {
          onRSVPChange(false); // Notify parent about RSVP change
        }
        router.push({
          pathname: "/tabs/feed/concertbuds",
          params: item,
        });
      } else {
        console.log("profile", profile);
        await RSVPForConcert({
          userId: user.id,
          username: profile?.username || user.email,
          concertId: id,
          concertName: name || "Untitled Event",
          artistName: artist,
          location: locationText,
          address: address,
          concertDate: date || new Date().toISOString(),
          concertTime: concertTime,
          avatarUrl: profile?.avatar_url,
          joinChat: false,
        });
        setIsRSVPed(true);
        if (onRSVPChange) {
          onRSVPChange(true); // Notify parent about RSVP change
        }
        router.push({
          pathname: "/tabs/feed/concertbuds",
          params: item,
        });
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
            uri: imageUrl,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
          <View>
            <Text style={styles.artistName}>{concertTime}</Text>
          </View>
        </View>

        <View style={styles.artistHeader}>
          <Text style={styles.location}>{locationText}</Text>
          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
          <View>
            <Text style={styles.artistName}>{venue}</Text>
            <Text style={styles.artistName}>{address}</Text>
          </View>
        </View>
      </View>
      <View style={styles.goingContainer}>
        <TouchableOpacity
          style={[
            styles.goingButton,
            isRSVPed && styles.goingButtonRSVPed,
            loading && styles.goingButtonDisabled,
          ]}
          onPress={handleRSVP}
          disabled={loading}
        >
          <Text style={styles.goingText}>
            {loading ? "Loading..." : isRSVPed ? "Cancel RSVP" : "Going"}
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
    marginTop: 10,
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
    backgroundColor: "#a390e8",
  },
  goingButtonDisabled: {
    opacity: 0.5,
  },
});

export default ConcertCard;
