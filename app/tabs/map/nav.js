import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ENV from "@/utils/env";
import Images from "@/assets/Images";

const App = () => {
  const origin = { latitude: 37.7749, longitude: -122.4194 }; // Example: San Francisco
  const destination = { latitude: 34.0522, longitude: -118.2437 }; // Example: Los Angeles
  const GOOGLE_MAPS_API_KEY = ENV.MAPS_API_KEY; // Replace with your API key
  const handleAccept = () => {};

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <Text>Frost Amphitheater · 7 PM</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          <Marker
            coordinate={origin}
            title="Origin"
            description="Start Point"
          />
          <Marker
            coordinate={destination}
            title="Destination"
            description="End Point"
          />
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="blue"
          />
        </MapView>
      </View>
      <View style={styles.footerContainer}>
        <Text numberOfLines={2} style={styles.concertbudsText}>
          We found you {"\n"}2 ConcertBuds!
        </Text>
        <TouchableOpacity
          style={styles.acceptContainer}
          numberOfLines={2}
          onPress={handleAccept}
        >
          <Text style={styles.acceptText}>Accept Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    marginTop: "20%",
    height: "65%",
  },
  footerContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 40,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    marginVertical: 20,
    padding: 15,
  },
  concertbudsText: {
    fontFamily: "Doppio",
    fontSize: 20,
    lineHeight: 20,
    color: "#000000",
    marginTop: 5,
  },
  acceptContainer: {
    marginLeft: 10,
    backgroundColor: "#846AE3",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  acceptText: {
    fontFamily: "Doppio",
    fontSize: 20,
    lineHeight: 20,
    color: "#FFFFFF",
  },
});

export default App;
