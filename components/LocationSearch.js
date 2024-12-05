import React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ENV from "@/utils/env";

const LocationSearch = () => {
  const GOOGLE_MAPS_API_KEY = ENV.MAPS_API_KEY; // Replace with your API key
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        minLength={2} // Minimum length of text to trigger search
        autoFocus={false}
        returnKeyType={"search"} // Can be 'search', 'done', 'go'
        fetchDetails={true} // Fetch full place details
        onPress={(data, details = null) => {
          // Handle selected location here
          console.log("Selected data:", data);
          console.log("Full details:", details);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en", // Language of the results
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
        }}
        debounce={200} // Debounce to limit API calls
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  textInputContainer: {
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  textInput: {
    height: 40,
    color: "#5d5d5d",
    fontSize: 16,
  },
  listView: {
    backgroundColor: "#fff",
  },
});

export default LocationSearch;
