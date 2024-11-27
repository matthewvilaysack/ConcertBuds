import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const ConcertItem = ({ item, variant, onRSVP, onRemove }) => {
  if (!item) return null;

  const { name, dates, _embedded, id } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name || "San Jose";
  const state = venue?.state?.stateCode || "CA";
  const navigation = useNavigation();

  const eventDate = dates?.start?.localDate
    ? new Date(dates.start.localDate)
    : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  const locationText = `${city}, ${state}`;
  const handleNavigate = () => {
    // const handleNavigate = () => {
    //   navigation.navigate("MarkGoing", {
    //     id: 123,
    //     username: "JohnDoe",
    //     timestamp: "2024-11-26T15:00:00Z",
    //     text: "This is a post",
    //     score: 100,
    //     commentCount: 5,
    //     vote: true,
    //   });
    // };

    router.push(`/tabs/feed/concertbuds`);
  };

  const handleRSVPClick = (e) => {
    e.stopPropagation(); // Prevent navigation when RSVP button is clicked
    if (onRSVP) {
      const concertData = {
        id,
        name,
        location: locationText,
        date: `${month} ${day}`,
      };
      onRSVP(concertData);
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
        </View>
        <View style={styles.artistHeader}>
          <Text style={styles.location}>{locationText}</Text>
          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  artistContainer: {
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 10,
  },
  containerOpacity: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  dateContainer: {
    marginHorizontal: "5%",
    marginVertical: "5%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "Doppio",
  },
  day: {
    fontSize: 36,
    color: "#000000",
    fontFamily: "Doppio",
  },
  artistHeader: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "5%",
    flex: 1,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "6%",
  },
  variantRadius: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  location: {
    fontSize: 28,
    color: "#000000",
    fontWeight: "bold",
    fontFamily: "Doppio",
  },
  artistName: {
    fontSize: 16,
    color: "#000000",
    marginTop: 5,
    fontFamily: "Doppio",
  },
  image: {
    width: windowWidth * 0.9,
    height: windowWidth * 0.7,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  trashIcon: {
    marginLeft: 10,
    padding: 10,
  },
});

export default ConcertItem;
