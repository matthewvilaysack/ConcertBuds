import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ConcertItem = ({ item, variant }) => {
  if (!item) return null;

  const { name, dates, _embedded } = item || {};
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

  return (
    <View
      style={[styles.artistImageContainer, variant && styles.containerOpacity]}
    >
      <View>
        {variant && (
          <View>
            <Image
              source={{
                uri: "https://media.pitchfork.com/photos/6614092742a7de97785c7a48/master/pass/Billie-Eilish-Hit-Me-Hard-and-Soft.jpg",
              }} // Replace with your image URL
              style={styles.image}
              // resizeMode="cover"
            />
          </View>
        )}
      </View>
      {/*       <Text style={[styles.text, isHighlighted && styles.highlightedText]}>
       */}
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
          {variant && (
            <View>
              <Text style={styles.artistName}>Wed 7 PM</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.artistHeader,
            !variant && styles.nonvariantOpacity,
            variant && styles.variantRadius,
          ]}
        >
          <Link href="/tabs/feed/markgoing">
            <Text style={styles.location}>{locationText}</Text>
          </Link>

          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
          {variant && (
            <View>
              <Text style={styles.artistName}>Frost Amphitheater</Text>
            </View>
          )}
        </View>
      </View>
      {variant && (
        <View style={styles.goingContainer}>
          <TouchableOpacity style={styles.goingButton}>
            <Text style={styles.goingText}>Going</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 20,
  },
  artistContainer: {
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 20,
  },
  containerOpacity: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  dateContainer: {
    marginTop: "5%",
    marginLeft: "5%",
    marginBottom: "5%",
    flexDirection: "column",
    alignItems: "center",
  },
  month: {
    fontFamily: "Doppio One",
    fontSize: 20,
    color: "#000000",
  },
  day: {
    fontFamily: "Doppio One",
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
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  nonvariantOpacity: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  variantRadius: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  location: {
    fontFamily: "Doppio One",
    fontSize: 28,
    color: "#000000",
  },
  artistName: {
    fontFamily: "Doppio One",
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
  },
});

export default ConcertItem;
