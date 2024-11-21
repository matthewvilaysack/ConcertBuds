import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Images from "@/assets/Images";

const SearchPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [concerts, setConcerts] = useState([
    { id: "1", date: "Nov 6", location: "Stanford, CA", artist: "Billie Eilish" },
    { id: "2", date: "Nov 8", location: "Cincinnati, OH", artist: "Billie Eilish" },
    { id: "3", date: "Nov 9", location: "Nashville, TN", artist: "Billie Eilish" },
  ]);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#FFFFFF", "#F2E7FF", "#E8D9FF"]}
        style={styles.gradient}
      />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/tabs/feed")}>
          <Image source={Images.back_arrow} style={styles.backIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for artist, tour, etc."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity>
          <Image source={Images.search_icon} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      <FlatList
        data={concerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.concertItem}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.details}>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#846AE3",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginHorizontal: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  listContainer: {
    padding: 20,
  },
  concertItem: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 18,
    color: "#846AE3",
    fontWeight: "bold",
  },
  details: {
    marginLeft: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
  },
  artist: {
    fontSize: 14,
    color: "#6C6C6C",
  },
});

export default SearchPage;
