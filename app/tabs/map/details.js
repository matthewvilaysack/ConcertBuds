import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MapDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details about the Map!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
