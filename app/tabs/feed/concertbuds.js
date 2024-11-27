import React from "react";
import { StyleSheet, View, Image, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import ConcertBudsPage from "@/components/ConcertBudsPage";
import ConcertItem from "@/components/ConcertItem";
import Images from "@/assets/Images";
import ConcertUsersGoing from "@/components/ConcertUsersGoing";
import Button from "@/components/Button";

export default function ConcertBudsScreen() {
  const router = useRouter();
  const exampleItem = {
    id: "1", // Unique identifier
    name: "BILLIE EILISH",
    dates: {
      start: {
        localDate: "2024-11-30",
      },
    },
    _embedded: {
      venues: [
        {
          city: {
            name: "Vancouver",
          },
          state: {
            stateCode: "BC",
          },
        },
      ],
    },
  };
  const handlePress = () => {
    Alert.alert("Button pressed!");
  };

  const concerts = [exampleItem];

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <ConcertItem item={exampleItem}></ConcertItem>
        <ConcertUsersGoing router={router}></ConcertUsersGoing>
        <View style={styles.button}>
          <Button label="Join the Chat" onPress={handlePress} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    position: "absolute",
    top: "11%",
    alignItems: "center",
    width: "100%",
    height: "89%", // Add this line
    padding: 20,
  },
  button: {
    marginTop: 20,
    height: "10%",
    width: "100%",
  },
});
