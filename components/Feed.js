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
  // Log concert IDs to identify duplicates
  console.log("Concert IDs:", concerts.map(concert => concert.concert_id));

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
              address: item.address,
              location: item.location || "",
              venue: item.venue || "Venue TBD",
              formattedData: {
                artist: item.artist_name,
                concertName: item.concert_name,
                concertRawTime: item.concert_raw_time,
                time: item.concert_time,
                dayOfWeek: item.concert_date ? new Date(item.concert_date).toLocaleString("en-US", { weekday: "long" }) : "",
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
                    name: item.location ? item.location.split(', ')[0] : "",
                  },
                  state: {
                    stateCode: item.location && item.location.includes(', ') ? item.location.split(', ')[1] : "",
                  },
                }],
              },
            }}
            destination={destination}
            hasRSVPed={true}
            onRSVPChange={() => onRSVPChange(item.concert_id)}
          />
        )}
        keyExtractor={(item) => item.concert_id.toString()}
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
    color: Theme.colors.text.white,
    fontSize: 16,
    marginTop: 20,
    opacity: 0.8,
  },
  profilePicturesSection: {
    marginTop: 20, // Add margin to the section where profile pictures are shown
  },
});

export default Feed;