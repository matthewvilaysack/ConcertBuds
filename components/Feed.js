import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConcertItem from "./ConcertItem";
import Theme from '../assets/theme';

const Feed = ({ concerts, onLoadMore, loading }) => {
  const [rsvpConcerts, setRsvpConcerts] = useState([]);

  // Load RSVP'd concerts from local storage on mount
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

  // Save RSVP'd concerts to local storage whenever the state changes
  useEffect(() => {
    const saveRSVPs = async () => {
      try {
        await AsyncStorage.setItem("rsvpConcerts", JSON.stringify(rsvpConcerts));
      } catch (error) {
        console.error("Error saving RSVP'd concerts:", error);
      }
    };
    saveRSVPs();
  }, [rsvpConcerts]);

  const handleRSVP = (concert) => {
    setRsvpConcerts((prev) => {
      if (!prev.some((item) => item.id === concert.id)) {
        return [...prev, concert];
      }
      return prev;
    });
  };

  const handleRemove = (concertId) => {
    setRsvpConcerts((prev) => prev.filter((concert) => concert.id !== concertId));
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#846AE3" />;
  };

  return (
    <View style={styles.container}>
      {/* RSVP'd concerts */}
      {rsvpConcerts.length > 0 ? (
        <>
          <Text style={styles.rsvpTitle}>Your RSVP'd Concerts</Text>
          <FlatList
            data={rsvpConcerts}
            renderItem={({ item }) => (
              <ConcertItem item={item} variant onRemove={handleRemove} />
            )}
            keyExtractor={(item) => `rsvp-${item.id}`}
            contentContainerStyle={styles.listContainer}
          />
        </>
      ) : (
        <Text style={styles.emptyText}>
          Your upcoming concerts will show here.
        </Text>
      )}
  
      {/* Available concerts */}
      {concerts.length > 0 && (
        <FlatList
          data={concerts.filter(
            (concert) => !rsvpConcerts.some((rsvp) => rsvp.id === concert.id)
          )}
          renderItem={({ item }) => (
            <ConcertItem item={item} onRSVP={() => handleRSVP(item)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 140,
  },
  listContainer: {
    paddingTop: 20,
  },
  rsvpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  emptyText: {
  textAlign: "center",
  color: Theme.colors.textPrimary,
  fontSize: 16,
  marginTop: 20,
  opacity: 0.8,
},

});

export default Feed;
