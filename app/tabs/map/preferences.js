import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ENV from "@/utils/env";
import Images from "@/assets/Images";
import Feed from "@/components/Feed";
import { getUserConcerts } from "@/lib/concert-db";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";
import { useLocalSearchParams } from "expo-router";
import CommutePreferences from "@/components/CommutePreferences";

const App = () => {
  const params = useLocalSearchParams();
  const concert = {
    concert_id: params.id,
    concert_name: params.concertName || params.name,
    concert_date: params.date,
    location: `${params.city}, ${params.state}`,
    address: params.address,
    timezone: params.timezone,
    time: params.time,
    artist: params.artist,
    imageUrl: params.imageUrl,
  };

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <View style={styles.contentWrapper}>
        <CommutePreferences
          item={{
            id: concert.concert_id,
            name: concert.concert_name,
            dates: {
              start: {
                localDate: concert.concert_date,
              },
            },
            location: concert.location,
            city: concert.city,
            state: concert.state,
            address: concert.address,
          }}
        ></CommutePreferences>
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
    flex: 1,
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
});

export default App;
