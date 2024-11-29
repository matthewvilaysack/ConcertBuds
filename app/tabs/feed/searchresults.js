import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Image, Text, Dimensions, FlatList, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from '@react-navigation/native';
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import SearchComponent from "@/components/SearchComponent";
import { useLocalSearchParams } from "expo-router";
import { fetchConcerts } from "@/utils/api";
import ConcertItem from "@/components/ConcertItem";
import { checkUserRSVPStatus, getUserConcerts } from "@/lib/concert-db"; // Update this import
import { supabase } from '@/lib/supabase';

const windowHeight = Dimensions.get("window").height;

const formatTime = (dateObj) => {
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours + 11) % 12 + 1);
  
  return minutes === 0 
      ? `${formattedHours} ${period}`
      : `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const ConcertItemWrapper = React.memo(({ item, artistQuery, userConcerts, onRSVPChange }) => {
  const hasRSVPed = userConcerts?.some(concert => concert.concert_id === item.id);

  const eventDate = item.dates?.start?.localDate
    ? new Date(`${item.dates.start.localDate}T00:00:00Z`)
    : null;

  const time = item.dates?.start?.localTime
    ? formatTime(new Date(`${item.dates.start.localDate}T${item.dates.start.localTime}Z`))
    : "Time TBD";

  const dayOfWeek = eventDate
    ? eventDate.toLocaleString("en-US", { weekday: "short", timeZone: "UTC" })
    : "";

  const artist = item._embedded?.attractions?.[0]?.name || 
                artistQuery || 
                item.name?.split(' at ')?.[0] || 
                item.name;

  const formattedData = {
    id: item.id,
    name: item.name,
    artist,
    concertName: item.name,
    date: item.dates?.start?.localDate,
    dayOfWeek,
    concertTime: `${dayOfWeek} ${time}`,
    location: `${item._embedded?.venues?.[0]?.city?.name || ''}, ${item._embedded?.venues?.[0]?.state?.stateCode || ''}`,
    city: item._embedded?.venues?.[0]?.city?.name,
    state: item._embedded?.venues?.[0]?.state?.stateCode,
    venue: item._embedded?.venues?.[0]?.name,
    imageUrl: item.images?.[1]?.url,
    timezone: item.dates?.timezone
  };

  return (
    <ConcertItem
      item={{ ...item, formattedData }}
      destination={"/tabs/feed/markgoing"}
      hasRSVPed={hasRSVPed}
      onRSVPChange={onRSVPChange}
    />
  );
});

export default function SearchResults() {
  const { artist } = useLocalSearchParams();
  const [artistQuery, setArtistQuery] = useState(artist);
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userConcerts, setUserConcerts] = useState([]);

  const loadConcerts = async (pageNum = 0, append = false) => {
    if (!artistQuery || loading) return;

    setLoading(true);
    if (!append) setError(null);

    try {
      const events = await fetchConcerts(artistQuery, pageNum);
      const uniqueEvents = events.filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.id === event.id)
      );

      if (uniqueEvents.length === 0) {
        setHasMore(false);
      } else {
        setConcerts((prev) =>
          append ? [...prev, ...uniqueEvents] : uniqueEvents
        );
      }
    } catch (err) {
      setError("Failed to fetch concerts");
      if (!append) setConcerts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserConcerts = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const concerts = await getUserConcerts(user.id);
        setUserConcerts(concerts);
      }
    } catch (error) {
      console.error("Error fetching user concerts:", error);
    }
  }, []);

  const handleRSVPChange = (concertId, isRSVPed) => {
    setUserConcerts(prevConcerts => {
      if (isRSVPed) {
        return [...prevConcerts, { concert_id: concertId }];
      } else {
        return prevConcerts.filter(concert => concert.concert_id !== concertId);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadUserConcerts();
    }, [loadUserConcerts])
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadConcerts(0, false);
    loadUserConcerts();
  }, [artistQuery, loadUserConcerts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadConcerts(nextPage, true);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <SearchComponent
          artist={artistQuery}
          setArtist={setArtistQuery}
          setConcerts={setConcerts}
        />
        {error && (
          <Text style={[styles.infoText, styles.errorText]}>{error}</Text>
        )}
        {!loading && concerts.length === 0 ? (
          <Text style={styles.infoText}>
            No concerts found for '{artistQuery}.'
          </Text>
        ) : (
          <FlatList
            data={concerts}
            renderItem={({ item }) => <ConcertItemWrapper item={item} artistQuery={artistQuery} userConcerts={userConcerts} onRSVPChange={handleRSVPChange} />}
            keyExtractor={(item) => `${item.id} + $[]`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false} // Hide scroll indicator
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && <ActivityIndicator size="large" color="#846AE3" />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentWrapper: {
    position: "absolute",
    top: "11%",
    width: "100%",
    height: windowHeight - 200,
  },
  listContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Doppio",
    opacity: 0.9,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    color: Theme.colors.error || "#ff4444",
    fontFamily: "Doppio",
  },
});