import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import ConcertBudsPage from "@/components/ConcertBudsPage";

export default function ConcertBudsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ConcertBudsPage router={router} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
