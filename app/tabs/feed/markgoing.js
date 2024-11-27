// Details.js
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import { useLocalSearchParams } from "expo-router";
import ConcertCard from "@/components/ConcertCard";

const Details = () => {
  // Get concert data from route params
  const params = useLocalSearchParams();
  const concertData = {
    id: params.id,
    name: params.name,
    dates: {
      start: {
        localDate: params.date
      }
    },
    _embedded: {
      venues: [{
        city: {
          name: params.city
        },
        state: {
          stateCode: params.state
        }
      }]
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        <ConcertCard item={concertData} variant={2} />
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

export default Details;