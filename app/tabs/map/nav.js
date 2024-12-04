import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ENV from "@/utils/env";
import Images from "@/assets/Images";
import TransitOptions from "@/components/TransitOptions";

const App = () => {
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [transitSteps, setTransitSteps] = useState([]);
  const originAddress = "459 Lagunita Dr, Stanford, CA 94305"; // Replace with actual address
  const destinationAddress = "351 Lasuen St, Stanford, CA 94305"; // Replace with actual address
  const GOOGLE_MAPS_API_KEY = ENV.MAPS_API_KEY; // Replace with your API key
  const handleAccept = () => {};

  const geocodeAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("Geocoding failed for:", address);
        return null;
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      return null;
    }
  };

  const fetchTransitOptions = async () => {
    const originAddress = "Stanford, CA"; // Replace with actual address
    const destinationAddress = "San Francisco, CA"; // Replace with actual address

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      originAddress
    )}&destination=${encodeURIComponent(
      destinationAddress
    )}&mode=transit&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes[0].legs[0].steps) {
        console.log("data routes: ", data.routes[0].legs[0].steps);
        setTransitSteps(data.routes[0].legs[0].steps);
      } else {
        console.error("No transit steps found");
      }
    } catch (error) {
      console.error("Error fetching transit options", error);
    }
  };

  useEffect(() => {
    const initializeCoordinates = async () => {
      const origin = await geocodeAddress(originAddress);
      const destination = await geocodeAddress(destinationAddress);
      if (origin && destination) {
        setOriginCoordinates(origin);
        setDestinationCoordinates(destination);
        fetchTransitOptions();
      }
      setLoading(false);
    };
    initializeCoordinates();
  }, []);

  if (!originCoordinates || !destinationCoordinates) {
    return (
      <View style={styles.errorContainer}>
        <Text>Unable to fetch coordinates for the provided addresses.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <View style={styles.headerContainer}>
        <Text style={styles.acceptText}>Frost Amphitheater · 7 PM</Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude:
              (originCoordinates.latitude + destinationCoordinates.latitude) /
              2,
            longitude:
              (originCoordinates.longitude + destinationCoordinates.longitude) /
              2,
            latitudeDelta:
              Math.abs(
                originCoordinates.latitude - destinationCoordinates.latitude
              ) + 0.5,
            longitudeDelta:
              Math.abs(
                originCoordinates.longitude - destinationCoordinates.longitude
              ) + 0.5,
          }}
        >
          <Marker coordinate={originCoordinates} title="Origin" />
          <Marker coordinate={destinationCoordinates} title="Destination" />
          <MapViewDirections
            origin={originCoordinates}
            destination={destinationCoordinates}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        </MapView>
      </View>
      <TransitOptions transitSteps={transitSteps}></TransitOptions>
      <View style={styles.footerContainer}>
        <Text numberOfLines={2} style={styles.concertbudsText}>
          We found you {"\n"}2 ConcertBuds!
        </Text>
        <TouchableOpacity
          style={styles.acceptContainer}
          numberOfLines={2}
          onPress={handleAccept}
        >
          <Text style={styles.acceptText}>Accept{"\n"}Route</Text>
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
  headerContainer: {
    marginTop: 65,
    alignItems: "center",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    marginTop: 15,
    height: "60%",
  },
  transitContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  transitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  transitStep: {
    fontSize: 14,
    marginVertical: 4,
  },
  noTransitText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  footerContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 45,
    width: "95%",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  concertbudsText: {
    fontFamily: "Doppio",
    fontSize: 18,
    color: "#000000",
    marginLeft: 25,
  },
  acceptContainer: {
    marginLeft: 10,
    backgroundColor: "#846AE3",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "45%",
  },
  acceptText: {
    fontFamily: "Doppio",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default App;
