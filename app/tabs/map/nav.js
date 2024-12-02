import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ENV from "@/utils/env";

const App = () => {
  const origin = { latitude: 37.7749, longitude: -122.4194 }; // Example: San Francisco
  const destination = { latitude: 34.0522, longitude: -118.2437 }; // Example: Los Angeles
  const GOOGLE_MAPS_API_KEY = ENV.MAPS_API_KEY; // Replace with your API key

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {/* Origin Marker */}
        <Marker coordinate={origin} title="Origin" description="Start Point" />

        {/* Destination Marker */}
        <Marker
          coordinate={destination}
          title="Destination"
          description="End Point"
        />

        {/* Directions */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="blue"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
