import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import ConcertItem from "./ConcertItem";
import Theme from "../assets/theme";
import { getUserConcerts } from "@/lib/concert-db";
import supabase from "@/lib/supabase";

const Feed = ({ concerts,destination }) => {
  const [userConcerts, setUserConcerts] = useState([]);
  const [loadingUserConcerts, setLoadingUserConcerts] = useState(true);

  useEffect(() => {
    const loadUserConcerts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const concertData = await getUserConcerts(user.id);
          setUserConcerts(concertData || []);
        }
      } catch (error) {
        console.error("Error loading user concerts:", error);
      } finally {
        setLoadingUserConcerts(false);
      }
    };

    loadUserConcerts();
  }, []);

  if (loadingUserConcerts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#846AE3" />
      </View>
    );
  }

  const handleNavigate = (item) => {
    router.push({
      pathname: "/tabs/feed/concertbuds",
      params: {
        id: item.id,
        name: item.name,
        date: item.dates?.start?.localDate,
        city: item._embedded?.venues?.[0]?.city?.name,
        state: item._embedded?.venues?.[0]?.state?.stateCode,
        artist: item.formattedData?.artist,
        venue: item._embedded?.venues?.[0]?.name
      }
    });
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={userConcerts}
        renderItem={({ item }) => (
          <ConcertItem
            item={{
              id: item.concert_id,
              name: item.concert_name,
              dates: {
                start: {
                  localDate: item.concert_date
                }
              },
              _embedded: {
                venues: [{
                  city: {
                    name: item.location.split(', ')[0]
                  },
                  state: {
                    stateCode: item.location.split(', ')[1]
                  }
                }]
              }
            }}
            destination={destination}
          />
        )}
        keyExtractor={(item) => item.concert_id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't RSVPed to any concerts yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 85,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 20,
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