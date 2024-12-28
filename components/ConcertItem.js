import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "@/lib/supabase";
import { unRSVPFromConcert } from "@/lib/concert-db";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { formatDate } from "../utils/getDate";

const windowWidth = Dimensions.get("window").width;

const ConcertItem = ({
  item,
  destination,
  hasRSVPed = false,
  onRSVPChange,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!item) return null;
  //
  // console.log("CONCERTITEM PARAMS", item);

  const { name, dates, _embedded, formattedData } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name || "San Jose";
  const state = venue?.state?.stateCode;
  const artist = formattedData?.artist;
  //
  // console.log("FORMATTED DATA", formattedData);

  const eventDate = dates?.start?.localDate
    ? new Date(dates.start.localDate + "T00:00:00")
    : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();
  const locationText = city && state ? `${city}, ${state}` : `${city}`;
  const handleNavigate = () => {
    console.log("destination", destination);
    console.log("params in concertitem", getParams(item));

    router.push({
      pathname: destination,
      params: getParams(item),
    });
  };

  const getParams = (item) => ({
    ...getBasicDetails(item),
    ...getDateTimeDetails(item),
    ...getLocationDetails(item),
    ...getAdditionalDetails(item),
  });

  const getBasicDetails = (item) => ({
    id: item.id,
    name: item.name,
    artist: formattedData?.artist,
    concertName: formattedData?.concertName,
  });

  const getDateTimeDetails = (item) => ({
    date: item.dates?.start?.localDate,
    time: formattedData?.time,
    dayOfWeek: formattedData?.dayOfWeek,
    concertTime: formattedData?.concertTime,
    concertRawTime: formattedData?.concertRawTime,
    dateTime: item.dates?.start?.dateTime,
  });

  const getLocationDetails = (item) => {
    const venue = item._embedded?.venues?.[0];
    return {
      location: formattedData?.location,
      city: venue?.city?.name,
      state: venue?.state?.stateCode,
      venue: venue?.name,
    };
  };

  const getAdditionalDetails = (item) => ({
    imageUrl: formattedData?.imageUrl,
    timezone: formattedData?.timezone,
    address: formattedData?.address,
  });

  const handleUnRSVP = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Please sign in first");
        return;
      }
      await unRSVPFromConcert(user.id, item.id);

      const additionalUsers = [
        {
          userId: "7f4e1901-5eaf-4c7a-9ccc-50321d7dc2bd",
          username: "James Landay",
          avatarUrl: "https://hci.stanford.edu/courses/cs147/2024/au/img/staff/Landay.jpg",
        },
        {
          userId: "96f26dc8-49d8-407b-8d80-1c897494dd79",
          username: "Eli Waldman",
          avatarUrl: "https://hci.stanford.edu/courses/cs147/2024/au/img/staff/Eli.jpg",
        },
      ];
      if (onRSVPChange) {
        onRSVPChange(item.id, false);
      }
      Alert.alert("Success", "You've removed your RSVP");
    } catch (error) {
      console.error("Error removing RSVP:", error);
      Alert.alert("Error", "Failed to remove RSVP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.location}>{locationText}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.artistName}
            >
              {name || "Event Name TBD"}
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            {hasRSVPed ? (
              <>
                <View style={styles.goingButton}>
                  <Text style={styles.goingText}>Going</Text>
                </View>
                <TouchableOpacity
                  onPress={handleUnRSVP}
                  disabled={loading}
                  style={styles.trashContainer}
                >
                  <FontAwesome name="trash" size={18} color={"gray"} />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.notGoingButton}>
                <Text style={styles.notGoingText}>Not Going</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  artistContainer: {
    width: windowWidth * 0.9,
    height: 90,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  dateContainer: {
    width: 75,
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  month: {
    fontSize: 16,
    fontFamily: "Doppio One",
    color: "#000000",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  day: {
    fontSize: 32, // Smaller for better fit
    fontFamily: "Doppio One",
    color: "#000000",
    fontWeight: "500",
  },
  contentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    height: "100%",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: "60%",
  },
  location: {
    fontSize: 18,
    fontFamily: "Doppio One",
    color: "#000000",
    marginRight: 8,
  },
  artistName: {
    fontSize: 14,
    fontFamily: "Doppio One",
    marginTop: 5,
    color: "rgba(255, 255, 255, 0.7)", // Slightly dimmed for hierarchy
    color: "#000000",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  goingButton: {
    height: 28, // Slightly smaller
    paddingHorizontal: 12,
    backgroundColor: "#846AE3",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  goingText: {
    fontSize: 14,
    fontFamily: "Doppio One",
    color: "#FFFFFF",
  },
  trashContainer: {
    padding: 6,
    marginLeft: 2,
  },
  trashIcon: {
    width: 14,
    height: 14,
    tintColor: "rgba(0, 0, 0)", // Lighter for dark background
  },
  notGoingButton: {
    height: 28,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notGoingText: {
    fontSize: 14,
    fontFamily: "Doppio One",
    color: "rgba(255, 255, 255, 0.5)",
  },
});
export default ConcertItem;
