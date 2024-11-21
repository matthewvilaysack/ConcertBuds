import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ConcertItem from "./ConcertItem";

const Feed = ({ concerts }) => {
  return (
    <View style={styles.container}>
      {concerts.length > 0 ? (
        <FlatList
          data={concerts}
          renderItem={({ item }) => <ConcertItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No concerts found. Try searching above.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 140, // Prevent overlap with taskbar
  },
  listContainer: {
    paddingTop: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#FFFFFF",
    opacity: 0.8,
    fontSize: 15,
    marginTop: 20,
  },
});

export default Feed;
