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
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const App = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [origin2Coordinates, setOrigin2Coordinates] = useState(null);
  const [origin3Coordinates, setOrigin3Coordinates] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const [transitSteps, setTransitSteps] = useState([]);
  const JAMES_PHOTO =
    "https://hci.stanford.edu/courses/cs147/2024/au/img/staff/Landay.jpg";
  const ELI_PHOTO =
    "https://hci.stanford.edu/courses/cs147/2024/au/img/staff/Eli.jpg";
  const SARAH_PHOTO =
    "https://adobe.design/stories/community/media_1c16716150c58f613fabac586a799f543bd967c70.jpeg?width=750&format=jpeg&optimize=medium";

  const originAddress = params.startLocation; // Replace with actual address
  const destinationAddress = params.address + ", " + params.location; // Replace with actual address
  const arrivalDateTime = new Date(params.chosenDate);
  console.log(params.chosenDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(arrivalDateTime);

  const GOOGLE_MAPS_API_KEY = ENV.MAPS_API_KEY; // Replace with your API key
  const handleAccept = () => {
    setAccepted(true);
  };

  const geocodeAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        console.log("working", data.results);
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        alert(
          "Geocoding failed for the given address. Please check that it is a valid address and try again."
        );
        navigation.goBack(); // Go back one screen
        setTimeout(() => navigation.goBack(), 0); // Go back another screen
        return null;
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      return null;
    }
  };
  const fetchTransitRoute = async (origin, destination, apiKey) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=transit&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      return data.routes[0].overview_path; // Get the polyline path
    } else {
      console.error("Error fetching route:", data);
      return null;
    }
  };

  const fetchTransitOptions = async () => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      originAddress
    )}&destination=${encodeURIComponent(
      destinationAddress
    )}&mode=transit&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes[0].legs[0].steps) {
        setTransitSteps(data.routes[0].legs[0].steps);
      } else {
        console.error("No transit steps found");
      }
    } catch (error) {
      console.error("Error fetching transit options", error);
    }
  };

  const calculateOffsetCoordinates = (origin, offset) => {
    const { latitude, longitude } = origin;
    return [
      { latitude: latitude + offset, longitude: longitude + offset }, // Offset in both directions
      { latitude: latitude - offset, longitude: longitude - offset }, // Negative offset
    ];
  };

  useEffect(() => {
    const initializeCoordinates = async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      // setLocation(currentLocation);
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01, // Adjust for zoom level
        longitudeDelta: 0.01,
      });

      // Geocode addresses
      const origin = await geocodeAddress(originAddress);
      const destination = await geocodeAddress(destinationAddress);
      if (origin && destination) {
        const offset = 0.001;
        const newAddresses = calculateOffsetCoordinates(origin, offset);
        const origin2 = newAddresses[0];
        const origin3 = newAddresses[1];

        setOriginCoordinates(origin);
        setOrigin2Coordinates(origin2);
        setOrigin3Coordinates(origin3);
        setDestinationCoordinates(destination);
        fetchTransitOptions();
      }
    };

    initializeCoordinates();
  }, []);

  if (!originCoordinates || !destinationCoordinates) {
    return (
      <View style={styles.errorContainer}>
        <Image source={Images.background} style={styles.background} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <View style={styles.headerContainer}>
        <Text style={styles.acceptText}>
          {params.address} · {formattedDate}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          followUserLocation={true} // Keeps the map centered on the user's current location
          showsUserLocation={true} // Shows a marker for the user's current location
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
              ) + 0.002, // Adjusted for a closer zoom level
            longitudeDelta:
              Math.abs(
                originCoordinates.longitude - destinationCoordinates.longitude
              ) + 0.002, // Adjusted for a closer zoom level
          }}
        >
          <Marker coordinate={originCoordinates} title="Origin">
            <Image
              source={
                accepted
                  ? {
                      uri: ELI_PHOTO,
                    }
                  : Images.profile_icon_2
              }
              style={[styles.markerImage, { borderColor: "hotpink" }]}
            />
          </Marker>
          <Marker coordinate={destinationCoordinates} title="Destination" />
          <MapViewDirections
            origin={originCoordinates}
            destination={destinationCoordinates}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
          <Marker coordinate={origin2Coordinates} title="Origin">
            <Image
              source={
                accepted
                  ? {
                      uri: JAMES_PHOTO,
                    }
                  : Images.profile_icon_2
              }
              style={[styles.markerImage, { borderColor: "orange" }]}
            />
          </Marker>
          <MapViewDirections
            origin={origin2Coordinates}
            destination={destinationCoordinates}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="orange"
          />
          <Marker coordinate={origin3Coordinates} title="Origin">
            <Image
              source={{
                uri: SARAH_PHOTO,
              }}
              style={[styles.markerImage, { borderColor: "purple" }]}
            />
          </Marker>
          <MapViewDirections
            origin={origin3Coordinates}
            destination={destinationCoordinates}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="purple"
          />
        </MapView>
        <TouchableOpacity
          style={styles.mapButton}
          numberOfLines={2}
          onPress={handleAccept}
        >
          <Text style={styles.mapText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
      <TransitOptions transitSteps={transitSteps}></TransitOptions>
      <View style={styles.footerContainer}>
        {accepted ? (
          <View style={styles.profilesContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: JAMES_PHOTO,
                }} // Replace with your image URL
                style={[styles.markerImage, { borderColor: "orange" }]}
              />
              <Text numberOfLines={2} style={styles.concertbudsText}>
                James
              </Text>
            </View>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: ELI_PHOTO,
                }} // Replace with your image URL
                style={[styles.markerImage, { borderColor: "hotpink" }]}
              />
              <Text style={styles.concertbudsText}>Eli</Text>
            </View>
          </View>
        ) : (
          <Text
            numberOfLines={2}
            style={[styles.concertbudsText, { marginLeft: 25 }]}
          >
            We found you {"\n"}2 ConcertBuds!
          </Text>
        )}
        <TouchableOpacity
          style={styles.acceptContainer}
          numberOfLines={2}
          onPress={handleAccept}
        >
          <Text style={styles.acceptText}>
            {accepted ? "Chat" : "Accept\nRoute"}
          </Text>
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
  markerImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 100,
    borderWidth: 5,
  },
  profileContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  profilesContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
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
    // marginLeft: 25,
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
  mapButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  mapText: {
    fontFamily: "Doppio",
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
  },
});

export default App;
