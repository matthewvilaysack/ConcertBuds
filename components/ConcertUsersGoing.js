import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import supabase from "@/lib/supabase";
import { getConcertAttendees } from "@/lib/concert-db";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const ConcertUsersGoing = ({ concertId }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const attendeeData = await getConcertAttendees(concertId);
        setAttendees(attendeeData || []);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      } finally {
        setLoading(false);
      }
    };

    if (concertId) {
      fetchAttendees();
    }
  }, [concertId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#846AE3" />
      </View>
    );
  }

  const groupedData = chunkArray(attendees, 3);

  const renderItem = ({ item }) => (
    <View style={styles.attendeesRow}>
      {item.map((attendee) => (
        <View key={attendee.id} style={styles.attendeeContainer}>
          <Image
            style={styles.avatarCircle}
            source={
              attendee.avatar_url
                ? { uri: attendee.avatar_url, width: 65, height: 65 }
                : require("../assets/Images/profile-icon-1.png") // default to anon photo
            }
          />
          <Text style={styles.attendeeName} numberOfLines={1}>
            {attendee.username || "Unknown"}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.attendeesSection}>
      <View style={styles.attendeesHeader}>
        <Text style={styles.attendeesTitle}>
        {attendees.length === 1
        ? "1 ConcertBud Going"
        : `${attendees.length} ConcertBuds Going`}
        </Text>
      </View>
      <FlatList
        persistentScrollbar={true}
        data={groupedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  attendeesSection: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingBottom: 20,
  },
  attendeesHeader: {
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  attendeesRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 10,
  },
  attendeesTitle: {
    color: "#846AE3",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Doppio",
  },
  attendeeContainer: {
    alignItems: "center",
    margin: 2.5,
  },
  avatarCircle: {
    width: 65,
    height: 65,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  attendeeName: {
    color: "#846AE3",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Doppio",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConcertUsersGoing;
