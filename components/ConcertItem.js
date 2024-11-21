import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

const ConcertItem = ({ item }) => {
  if (!item) return null;

  const { name, dates, _embedded } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name;
  const state = venue?.state?.stateCode;
  
  // Check if dates exists before creating Date object
  const eventDate = dates?.start?.localDate ? new Date(dates.start.localDate) : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  // Add location fallback
  const locationText = city && state ? `${city}, ${state}` : 'Location TBD';

  return (
    <View style={styles.artistContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>

      <View style={styles.artistHeader}>
        <Link href="/tabs/feed/markgoing">
          <Text style={styles.location}>
            {locationText}
          </Text>
        </Link>

        <Text style={styles.artistName} numberOfLines={2} ellipsizeMode="tail">
          {name || 'Event Name TBD'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artistContainer: {
    height: 127.53,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    position: "relative",
    marginBottom: 45,
    padding: 10,
    width: '100%',
  },
  dateContainer: {
    position: "absolute",
    left: 22,
    top: 22,
    alignItems: "center",
  },
  month: {
    fontFamily: "Doppio One",
    fontSize: 20,
    lineHeight: 25,
    color: "#000000",
  },
  day: {
    fontFamily: "Doppio One",
    fontSize: 48,
    lineHeight: 60,
    color: "#000000",
  },
  artistHeader: {
    position: "absolute",
    left: 94,
    top: 28,
    width: 220,
    justifyContent: "center",
  },
  location: {
    fontFamily: "Doppio One",
    fontSize: 28,
    lineHeight: 35,
    color: "#000000",
  },
  artistName: {
    fontFamily: "Doppio One",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    marginTop: 5,
  },
});

export default ConcertItem;