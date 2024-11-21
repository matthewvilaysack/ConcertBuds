import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import ConcertItem from "./ConcertItem";
import { usePathname } from "expo-router";
// Change the import to match the export in theme.js
const Theme = require("@/assets/theme").default;
// OR if theme.js uses export default:
// import Theme from '@/assets/theme';

const Feed = ({ concerts, onLoadMore, loading, hasMore }) => {
  const pathname = usePathname();
  const isDetailsPage = pathname.includes("details");

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator
        size="large"
        color={Theme.colors.textHighlighted} // Using orange accent color
        style={styles.loadingFooter}
      />
    );
  };

  return (
    <View style={styles.container}>
      {concerts.length > 0 ? (
        <FlatList
          variant={1}
          data={concerts}
          renderItem={({ item }) => <ConcertItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          scrollEventThrottle={16}
        />
      ) : (
        !isDetailsPage && (
          <Text style={styles.emptyText}>
            Your upcoming concerts will show here.
          </Text>
        )
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
  emptyText: {
    textAlign: "center",
    color: "#FFFFFF",
    opacity: 0.8,
    fontSize: 15,
    marginTop: 20,
  },
  loadingFooter: {
    paddingVertical: 20,
  },
});

export default Feed;
