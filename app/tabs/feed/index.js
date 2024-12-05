import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
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
  const searchComponentRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
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

      if (searchComponentRef.current) {
        searchComponentRef.current.clearSearch();
      }
      loadUserConcerts();
      return () => {};
    }, [])
  );
  useEffect(() => {
    const loadUserConcerts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const concerts = await getUserConcerts(user.id);
          if (JSON.stringify(userConcerts) !== JSON.stringify(concerts)) {
            setUserConcerts(concerts || []);
          }
        }
      } catch (error) {
        console.error("Error loading user concerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserConcerts();
  }, [userConcerts]);

  const handleRSVPChange = (concertId) => {
    setUserConcerts((prevConcerts) => prevConcerts.filter(concert => concert.concert_id !== concertId));
  };

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        <SearchComponent
          ref={searchComponentRef}
          artist={artist}
          setArtist={setArtist}
          setConcerts={() => {}} 
        />
              <View style={styles.headingContainer}>
        <Text style={styles.heading}>UPCOMING SHOWS</Text>
      </View>
        <Feed
          concerts={userConcerts}
          destination={"/tabs/feed/concertbuds"}
          onRSVPChange={handleRSVPChange}
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
  headingContainer: {
    width: '100%',
    paddingHorizontal: 24,  // Increased from 8 to match other content padding
    marginTop: 10,  // Added to reduce space between search and heading
  },
  
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text.white,
    letterSpacing: 1,
    fontFamily: 'Doppio One',
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
    paddingBottom: 90, // Add padding to account for tab bar
    height: '100%', // Set explicit height
  },
  infoText: {
    fontSize: 15,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  feed: {
    marginBottom: 70, // Add margin to ensure content doesn't overlap with tabs
  }
});
