import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, Dimensions, FlatList, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import SearchComponent from "@/components/SearchComponent";
import { useLocalSearchParams } from "expo-router";
import { fetchConcerts } from "@/utils/api";
import ConcertItem from "@/components/ConcertItem";

const windowHeight = Dimensions.get("window").height;

export default function SearchResults() {
  const { artist } = useLocalSearchParams();
  const [artistQuery, setArtistQuery] = useState(artist);
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadConcerts(0, false);
  }, [artistQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadConcerts(nextPage, true);
    }
  };

  const renderConcertItem = ({ item }) => {
    const formattedData = {
      id: item.id,
      name: item.name,
      artist: artistQuery || item.name?.split(' at ')?.[0] || item.name,
      concertName: item.name,
      date: item.dates?.start?.localDate,
      location: `${item._embedded?.venues?.[0]?.city?.name || ''}, ${item._embedded?.venues?.[0]?.state?.stateCode || ''}`,
      city: item._embedded?.venues?.[0]?.city?.name,
      state: item._embedded?.venues?.[0]?.state?.stateCode,
      venue: item._embedded?.venues?.[0]?.name,
      imageUrl: item.images?.[0]?.url,
    };

    return (
      <ConcertItem
        item={{ ...item, formattedData }}
        destination={"/tabs/feed/markgoing"}
      />
    );
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
            renderItem={renderConcertItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
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
    top: "11%",
    alignItems: "center",
    width: "100%",
    height: windowHeight - 90,
    padding: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  errorText: {
    color: Theme.colors.error || "#ff4444",
  },
});