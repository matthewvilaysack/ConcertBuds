import React, { useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import SearchComponent from "@/components/SearchComponent";
import { useLocalSearchParams } from "expo-router";
import Feed from "@/components/Feed";

const Details = () => {
  const CURRENT_TAB_DETAILS = "/tabs/feed/details";
  const { artist, searchQuery } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        <SearchComponent artist={artist} />
        <Text style={styles.infoText}></Text>
        {/* <Feed concerts={concerts} /> */}
      </View>
    </View>

    // <View style={styles.container}>
    //   <PostDetails
    //     currentTab={CURRENT_TAB_DETAILS}
    //     id={params.id}
    //     username={params.username}
    //     timestamp={params.timestamp}
    //     text={params.text}
    //     score={params.score}
    //     vote={params.vote}
    //     commentCount={params.commentCount}
    //   />
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === "ios" ? "padding" : undefined}
    //     keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}
    //     style={styles.keyboardContainer}
    //   >
    //     <CommentFeed postId={params.id} />
    //     <CommentInput postId={params.id} />
    //   </KeyboardAvoidingView>
    // </View>
  );
};

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
    top: "11%", // Adjust this value as needed
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

export default Details;
