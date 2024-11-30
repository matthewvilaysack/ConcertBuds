import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import CommuteChats from "@/components/CommuteChats";
import ConcertChats from "@/components/ConcertChats";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import Feed from "@/components/Feed";
import supabase from "@/lib/supabase";
import { getUserConcerts } from "@/lib/concert-db";

export default function ChatScreen() {
  const [userConcerts, setUserConcerts] = useState([]);
  const concerts = [
    {
      concert_name: "Billie Eilish",
      artist_name: "Billie",
      concert_date: "2024-12-03",
      num_going: 2584,
      location: "San Jose, CA",
      last_message_time: "3:25 PM",
    },
  ];
  // useEffect(() => {
  //   const loadUserConcerts = async () => {
  //     try {
  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();
  //       if (user) {
  //         const concerts = await getUserConcerts(user.id);
  //         if (JSON.stringify(userConcerts) !== JSON.stringify(concerts)) {
  //           setUserConcerts(concerts || []);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error loading user concerts:", error);
  //     }
  //   };

  //   loadUserConcerts();
  // }, [userConcerts]);
  // const handleRSVPChange = (concertId) => {
  //   setUserConcerts((prevConcerts) =>
  //     prevConcerts.filter((concert) => concert.concert_id !== concertId)
  //   );
  // };

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <View style={styles.chatSection}>
          <Text style={styles.chatTitle}>Commute Chats</Text>
          <CommuteChats />
        </View>
        <View style={styles.chatSection}>
          <Text style={styles.chatTitle}>Concert Chats</Text>
          <ConcertChats concerts={concerts} />
        </View>
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
    alignItems: "flex-start",
    width: "100%",
    height: "78%",
  },
  chatSection: {
    flex: 1,
    width: "90%",
    backgroundColor: "transparent",
    borderColor: "#FFFFFF",
    borderRadius: 20,
    margin: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  chatTitle: {
    fontFamily: "Doppio One",
    fontSize: 38,
    color: "#FFFFFF",
    marginBottom: 20,
  },
});
