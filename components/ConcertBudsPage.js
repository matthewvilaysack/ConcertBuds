  import React, { useEffect, useState } from "react";
  import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useRouter } from "expo-router";
  import Ionicons from "react-native-vector-icons/Ionicons";

  const MOCK_ATTENDEES = [
    { id: 1, name: "Izzy", letter: "I" },
    { id: 2, name: "Abby", letter: "A" },
    { id: 3, name: "Natalia", letter: "N" },
    { id: 4, name: "Diego", letter: "D" },
    { id: 5, name: "Matt", letter: "M" },
    { id: 6, name: "Sarah", letter: "S" },
    { id: 7, name: "Eli", letter: "E" },
    { id: 8, name: "Henry", letter: "H" },
    { id: 9, name: "Grace", letter: "G" },
  ];

  const ConcertBudsPage = () => {
    const router = useRouter();
    const [rsvpConcerts, setRsvpConcerts] = useState([]);

    // Load RSVP data on mount
    useEffect(() => {
      const loadRSVPs = async () => {
        try {
          const storedRSVPs = await AsyncStorage.getItem("rsvpConcerts");
          if (storedRSVPs) {
            setRsvpConcerts(JSON.parse(storedRSVPs));
          }
        } catch (error) {
          console.error("Error loading RSVP'd concerts:", error);
        }
      };
      loadRSVPs();
    }, []);

    const handleRSVP = async () => {
      const concert = {
        id: "billie-eilish-123",
        name: "Billie Eilish",
        location: "San Jose, CA",
        date: "Dec 10",
      };

      setRsvpConcerts((prev) => {
        if (!prev.some((item) => item.id === concert.id)) {
          const updatedRSVPs = [...prev, concert];
          AsyncStorage.setItem("rsvpConcerts", JSON.stringify(updatedRSVPs));
          return updatedRSVPs;
        }
        return prev;
      });
      alert("RSVP Successful!");
    };

    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/Images/billie-eilish.jpeg")}
          style={styles.backgroundImage}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ConcertBuds</Text>
        </View>
        <View style={styles.artistContainer}>
          <Ionicons
            name="trash"
            size={20}
            color="#000"
            style={styles.trashIconContainer}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.location}>Stanford, CA</Text>
            <Text style={styles.artist}>Billie Eilish</Text>
            <Text style={styles.venue}>SAP Center - Wed 7 PM</Text>
          </View>
          <TouchableOpacity onPress={handleRSVP} style={styles.goingLabel}>
            <Text style={styles.goingText}>Going</Text>
          </TouchableOpacity>
          <View style={styles.attendeesSection}>
            <Text style={styles.attendeesTitle}>
              {MOCK_ATTENDEES.length} ConcertBuds Going
            </Text>
            <ScrollView horizontal contentContainerStyle={styles.attendeesGrid}>
              {MOCK_ATTENDEES.map((attendee) => (
                <View key={attendee.id} style={styles.attendeeContainer}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{attendee.letter}</Text>
                  </View>
                  <Text style={styles.attendeeName}>{attendee.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    backButton: {
      padding: 10,
    },
    backText: {
      color: 'white',
      fontSize: 16,
    },
    title: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    artistContainer: {
      alignSelf: 'center',
      marginTop: 70,
      width: '90%',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    dateContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    month: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
    },
    day: {
      fontSize: 48,
      fontWeight: 'bold',
      color: 'black',
    },
    detailsContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    trashIconContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
    location: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    artist: {
      fontSize: 16,
      color: 'black',
      marginTop: 5,
      textAlign: 'center',
    },
    venue: {
      fontSize: 14,
      color: 'black',
      marginTop: 2,
      textAlign: 'center',
    },
    goingLabel: {
      backgroundColor: '#846AE3',
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 15,
      alignSelf: 'center',
      marginTop: 10,
    },
    goingText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    attendeesSection: {
      marginTop: 20,
      marginBottom: 15,
    },
    attendeesTitle: {
      color: '#846AE3',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 15,
    },
    attendeesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 10,
    },
    attendeeContainer: {
      alignItems: 'center',
      margin: 5,
      width: 60,
    },
    avatarCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#846AE3',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 20,
      color: '#FFFFFF',
    },
    attendeeName: {
      color: '#846AE3',
      fontSize: 12,
      marginTop: 5,
      textAlign: 'center',
    },
    bottomBar: {
      position: 'absolute',
      bottom: 280,
      left: 20,
      right: 20,
      alignItems: 'center',
    },
    chatButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    chatButtonText: {
      fontSize: 16,
      color: '#000',
    },
  });

  export default ConcertBudsPage;