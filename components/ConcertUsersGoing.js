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
import Theme from "../assets/theme";

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
        console.log("ATTENDEE DATA", attendeeData);
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
        <ActivityIndicator size="large" color={Theme.colors.primary.main} />
      </View>
    );
  }

  const groupedData = chunkArray(attendees, 3);
  // console.log("Grouped Data\n", groupedData);

  const renderItem = ({ item, index }) => (
    <View style={styles.attendeesRow} key={`${concertId}-${index}`}>
      {item.map((attendee) => (
        <View
          key={`${concertId}-${attendee.user_id}`}
          style={styles.attendeeContainer}
        >
          <Image
            style={styles.avatarCircle}
            source={
              attendee.avatar_url
                ? { uri: attendee.avatar_url, width: 65, height: 65 }
                : require("../assets/Images/profile-icon-1.png")
            }
          />
          <Text
            style={styles.attendeeName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
        keyExtractor={(item, index) => `${concertId}-${index}`} // Combine concertId and group index
      />
    </View>
  );
};

const styles = StyleSheet.create({
  attendeesSection: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.525,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingBottom: Theme.spacing.md,
    // marginTop: Theme.spacing.md,
  },
  attendeesHeader: {
    paddingTop: Theme.spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  attendeesRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
  },
  attendeesTitle: {
    color: Theme.colors.primary.main,
    fontSize: Theme.typography.sizes["2xl"],
    textAlign: "center",
    marginBottom: Theme.spacing.md,
    fontFamily: Theme.typography.fontFamilies.primary,
  },
  attendeeContainer: {
    flex: 1,
    alignItems: "center",
    maxWidth: (windowWidth * 0.9) / 3,
    paddingHorizontal: Theme.spacing.xs,
    marginTop: Theme.spacing.md, // Add spacing from the top
  },
  avatarCircle: {
    width: 65,
    height: 65,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  attendeeName: {
    color: Theme.colors.primary.main,
    fontSize: Theme.typography.sizes.sm,
    marginTop: Theme.spacing.xs,
    textAlign: "center",
    fontFamily: "Doppio",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConcertUsersGoing;
