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
import CommutePreferences from "@/components/CommutePreferences";

const App = () => {
  const [userConcerts, setUserConcerts] = useState([]);
  useEffect(() => {
    const loadUserConcerts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const concerts = await getUserConcerts(user.id);
          if (JSON.stringify(userConcerts) !== JSON.stringify(concerts)) {
            setUserConcerts(concerts || []);
          }
        }
      } catch (error) {
        console.error("Error loading user concerts:", error);
      }
    };

    loadUserConcerts();
  }, [userConcerts]);

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <View style={styles.contentWrapper}>
        <CommutePreferences></CommutePreferences>
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