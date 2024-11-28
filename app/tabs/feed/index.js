import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import SearchComponent from "@/components/SearchComponent";
import Feed from "@/components/Feed";
import supabase from "@/lib/supabase";
import { getUserConcerts } from '@/lib/concert-db';

const windowHeight = Dimensions.get("window").height;

export default function Page() {
  const [artist, setArtist] = useState("");
  const [userConcerts, setUserConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Load user's RSVPed concerts
  useEffect(() => {
    const loadUserConcerts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const concerts = await getUserConcerts(user.id);
          setUserConcerts(concerts || []);
        }
      } catch (error) {
        console.error("Error loading user concerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserConcerts();
  }, []);
  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        <SearchComponent
          artist={artist}
          setArtist={setArtist}
          setConcerts={() => {}} 
        />
        <Feed
          concerts={userConcerts} // Pass user's concerts from database
          destination={"/tabs/feed/concertbuds"}
          style={styles.feed}
        />
      </View>
    </View>
  );
}

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
    top: 200, 
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
