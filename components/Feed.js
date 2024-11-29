import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ConcertItem from "./ConcertItem";
import Theme from "../assets/theme";

const Feed = ({ concerts, destination, onRSVPChange }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={concerts}
        renderItem={({ item }) => (
          <ConcertItem
            item={{
              id: item.concert_id,
              name: item.concert_name,
              artist: item.artist_name,
              date: item.concert_date,
              time: item.concert_time,
              location: item.location,
              venue: item.venue || "Venue TBD",
              formattedData: {
                artist: item.artist_name,
                concertName: item.concert_name,
                time: item.concert_time,
                dayOfWeek: new Date(item.concert_date).toLocaleString("en-US", { weekday: "long" }),
                concertTime: item.concert_time,
                location: item.location,
                imageUrl: item.image_url || "",
                timezone: item.timezone || "",
              },
              dates: {
                start: {
                  localDate: item.concert_date,
                  localTime: item.concert_time,
                },
              },
              _embedded: {
                venues: [{
                  city: {
                    name: item.location.split(', ')[0],
                  },
                  state: {
                    stateCode: item.location.split(', ')[1],
                  },
                }],
              },
            }}
            destination={destination}
            hasRSVPed={true}
            onRSVPChange={onRSVPChange}
          />
        )}
        keyExtractor={(item) => item.concert_id.toString()} // Ensure each item has a unique key
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your upcoming concerts will show here.</Text>
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