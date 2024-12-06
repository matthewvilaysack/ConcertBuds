import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ENV from "@/utils/env";
import Images from "@/assets/Images";
import Feed from "@/components/Feed";
import { getUserConcerts } from "@/lib/concert-db";
import supabase from "@/lib/supabase";
import Theme from "@/assets/theme";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const App = () => {
  const params = useLocalSearchParams();
  console.log("params: ", params);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: "/tabs/map/nav",
        params: params,
      });
    }, 3000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleNavigate = () => {
    router.push({
      pathname: "/tabs/map/nav",
      params: params,
    });
  };

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <View style={styles.contentWrapper}>
        {isLoading ? (
          <View>
            <Text style={styles.text}>
              Finding Buddies for You Based on Your Preferences
            </Text>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={handleNavigate}>
              <Text style={styles.text}>View Your Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
  },
  text: {
    fontSize: 36,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    fontFamily: "Doppio",
    marginBottom: 20,
  },
});

export default App;
