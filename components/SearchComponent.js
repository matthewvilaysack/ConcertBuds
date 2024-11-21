import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Theme from "@/assets/theme";
import { fetchConcerts } from "../utils/api";

const SearchComponent = ({ setConcerts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length >= 2) {
      setIsLoading(true);
      try {
        const results = await fetchConcerts(text);
        setConcerts(results); // Update concerts in the parent component
      } catch (error) {
        console.error("Search error:", error);
        setConcerts([]); // Clear results on error
      } finally {
        setIsLoading(false);
      }
    } else {
      setConcerts([]); // Clear results if query is too short
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <BlurView intensity={80} tint="light" style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for artist, tour, etc."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </BlurView>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => searchQuery.length >= 2 && handleSearch(searchQuery)}
        >
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
    </View>
  );
};

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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 19,
    fontSize: 15,
    color: "#1A1A1A",
    height: "100%",
  },
  searchButton: {
    width: 63,
    height: 57.42,
    backgroundColor: "#846AE3",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginTop: 10,
  },
});

export default SearchComponent;
