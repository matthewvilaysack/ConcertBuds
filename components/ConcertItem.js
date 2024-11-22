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

const windowWidth = Dimensions.get("window").width;

const ConcertItem = ({ item, variant, onRSVP, onRemove }) => {
  if (!item) return null;

  const { name, dates, _embedded, id } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name || "Unknown City";
  const state = venue?.state?.stateCode || "Unknown State";

  const eventDate = dates?.start?.localDate
    ? new Date(dates.start.localDate)
    : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  const locationText = `${city}, ${state}`;

  const handleNavigate = () => {
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

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // Prevent navigation when trash icon is clicked
    if (onRemove) onRemove(id);
  };

  return (
    <TouchableOpacity
      onPress={handleNavigate}
      style={[styles.artistImageContainer, variant && styles.containerOpacity]}
    >
      <View>
        {variant && (
          <Image
            source={{
              uri: "https://media.pitchfork.com/photos/6614092742a7de97785c7a48/master/pass/Billie-Eilish-Hit-Me-Hard-and-Soft.jpg",
            }}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
        </View>
        <View
          style={[
            styles.artistHeader,
            !variant && styles.nonvariantOpacity,
            variant && styles.variantRadius,
          ]}
        >
          <Text style={styles.location}>{locationText}</Text>
          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
        </View>
      </View>
      {variant && (
        <View style={styles.goingContainer}>
          <TouchableOpacity
            style={styles.goingButton}
            onPress={handleRSVPClick}
          >
            <Text style={styles.goingText}>Going</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRemoveClick} style={styles.trashIcon}>
            <Text style={styles.trashText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
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
    marginLeft: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  month: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  day: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000000",
  },
  artistHeader: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "5%",
    paddingLeft: "5%",
    flex: 1,
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
    fontSize: 18,
    color: "#000000",
  },
  artistName: {
    fontSize: 16,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  goingButton: {
    backgroundColor: "#846AE3",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  goingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  trashIcon: {
    marginLeft: 10,
    padding: 10,
  },
  trashText: {
    fontSize: 20,
  },
});

export default ConcertItem;
