import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;

const CommuteChats = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.chatTitle}>
        Your upcoming Commute Chats will display here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chatTitle: {
    fontFamily: "Doppio One",
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 20,
    flex: 1,
    flexWrap: "wrap",
  },
});

export default CommuteChats;
