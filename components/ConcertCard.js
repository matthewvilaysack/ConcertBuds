import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router, Link } from "expo-router";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ConcertCard = ({ item }) => {
  if (!item) return null;

  const { name, dates, _embedded, id } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name;
  const state = venue?.state?.stateCode;

  // Check if dates exists before creating Date object
  const eventDate = dates?.start?.localDate
    ? new Date(dates.start.localDate)
    : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  // Add location fallback
  const locationText = city && state ? `${city}, ${state}` : "Location TBD";
  const handleGoing = () => {
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
    router.push("/tabs/feed/concertbuds");
  };

  return (
    <View style={styles.artistImageContainer}>
      <View>
        <View>
          <Image
            source={{
              uri: "https://media.pitchfork.com/photos/6614092742a7de97785c7a48/master/pass/Billie-Eilish-Hit-Me-Hard-and-Soft.jpg",
            }} // Replace with your image URL
            style={styles.image}
            // resizeMode="cover"
          />
        </View>
      </View>
      {/*       <Text style={[styles.text, isHighlighted && styles.highlightedText]}>
       */}
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
          <View>
            <Text style={styles.artistName}>Wed 7 PM</Text>
          </View>
        </View>

        <View style={styles.artistHeader}>
          <Link href={`/tabs/feed/markgoing?id=${id}`}>
            <Text style={styles.location}>{locationText}</Text>
          </Link>

          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
          <View>
            <Text style={styles.artistName}>Frost Amphitheater</Text>
          </View>
        </View>
      </View>
      <View style={styles.goingContainer}>
        <TouchableOpacity style={styles.goingButton} onPress={handleGoing}>
          <Text style={styles.goingText}>Going</Text>
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
});

export default ConcertCard;
