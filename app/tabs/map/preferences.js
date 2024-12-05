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
  console.log("PARAMS IN PREFERENCES", params);
  const concert = {
    concert_id: params.id,
    concert_name: params.concertName,
    concert_date: params.date,
    concert_raw_time: params.concertRawTime,
    location: `${params.city}, ${params.state}`,
    address: params.address,
    timezone: params.timezone,
    time: params.time,
    artist: params.name,
    imageUrl: params.imageUrl,
  };

  console.log("params in preferences", params);

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <View style={styles.contentWrapper}>
        <CommutePreferences
          item={{
            id: concert.concert_id,
            name: concert.artist,
            concertName: concert.concert_name,
            concertRawTime: concert.concert_raw_time,
            time: concert.time,
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
