import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import { useLocalSearchParams } from "expo-router";
import ConcertCard from "@/components/ConcertCard";

const MarkGoing = () => {
  const params = useLocalSearchParams();
  console.log("Full data coming in from ", params)

  const concertData = {
      // Basic details
      id: params.id,
      name: params.name,
      artist: params.artist, // bug only shows the searched query 
      concertName: params.concertName,

      
      // Date and time
      date: params.date,
      dayOfWeek: params.dayOfWeek,
      concertTime: params.concertTime,
      dateTime: params.dateTime,
      
      // Location details
      address: params.address,
      location: params.location,
      city: params.city,
      state: params.state,
      venue: params.venue,
      
      // Additional details
      imageUrl: params.imageUrl,
      timezone: params.timezone,
    }

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <ConcertCard item={concertData} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    position: "absolute",
    top: "11%",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
});

export default MarkGoing;
