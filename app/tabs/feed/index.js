import React, { useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import SearchComponent from "@/components/SearchComponent";
import Feed from "@/components/Feed";

export default function Page() {
  const [artist, setArtist] = useState(null); // Shared state for artist
  const [concerts, setConcerts] = useState([]); // Shared state for concerts

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        <SearchComponent
          artist={artist}
          setArtist={setArtist}
          setConcerts={setConcerts}
        />
        <Feed concerts={concerts} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    position: "absolute",
    top: 200, // Adjust this value as needed
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
});
