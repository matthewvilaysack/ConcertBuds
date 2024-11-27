import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import SearchComponent from "@/components/SearchComponent";
import { useLocalSearchParams } from "expo-router";
import { fetchConcerts } from "@/utils/api";
import Feed from "@/components/Feed";

export default function SearchResults() {
  const { artist } = useLocalSearchParams();
  const [artistQuery, setArtistQuery] = useState(artist);
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState(0);
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
        setSearchKey((prev) => prev + 1);
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
        {!loading && concerts.length === 0 && (
          <Text style={styles.infoText}>
            No concerts found for '{artistQuery}.'
          </Text>
        )}
        <Feed
          concerts={concerts}
          key={searchKey}
          onLoadMore={handleLoadMore}
          loading={loading}
          hasMore={hasMore}
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
    top: "11%",
    alignItems: "center",
    width: "100%",
    height: "89%", // Add this line
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
  errorText: {
    color: Theme.colors.error || "#ff4444",
  },
});
