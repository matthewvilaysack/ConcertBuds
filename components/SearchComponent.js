import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Theme from "@/assets/theme";
import { fetchConcerts } from "../utils/api";

const SearchComponent = forwardRef(
  ({ artist, setArtist, setConcerts }, ref) => {
    const DETAILS_PATH = "/tabs/feed/searchresults";
    const [searchQuery, setSearchQuery] = useState(artist);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasResults, setHasResults] = useState(false);
    const router = useRouter();

    const handleSearch = (text) => {
      setArtist(text);
      setSearchQuery(text);
      setError("");
    };

    const searchOnEnter = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setError("Please enter at least 2 characters to search");
        setHasResults(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const results = await fetchConcerts(searchQuery);
        setConcerts(results);
        setHasResults(results.length > 0);

        // Only navigate if we have valid results
        if (results.length > 0) {
          router.push({
            pathname: DETAILS_PATH,
            params: { artist: searchQuery },
          });
        } else {
          setError("No concerts found for this artist");
        }
      } catch (error) {
        console.error("Search error:", error);
        setConcerts([]);
        setHasResults(false);
        setError("Failed to fetch concerts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      clearSearch: () => {
        setSearchQuery("");
        setArtist("");
      },
    }));

    return (
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <BlurView
            intensity={80}
            tint="light"
            style={styles.searchInputContainer}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search for artist, tour, etc."
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={searchOnEnter}
              returnKeyType="search"
            />
          </BlurView>
          <TouchableOpacity style={styles.searchButton} onPress={searchOnEnter}>
            <FontAwesome name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={Theme.colors.iconHighlighted}
            style={styles.loader}
          />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
    width: 341,
  },
  searchInputContainer: {
    flex: 1,
    height: 57.42,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 19,
    fontSize: 15,
    color: "#1A1A1A",
    height: "100%",
    fontFamily: "Doppio",
  },
  searchButton: {
    width: 63,
    height: 57.42,
    backgroundColor: "#846AE3",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  linkWrapper: {
    display: "flex",
    textDecorationLine: "none",
    padding: 0,
    margin: 0,
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: "#ff4444",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  infoText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
  },
});

export default SearchComponent;
