import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Theme from "@/assets/theme";
import CommentFeed from "@/components/CommentFeed";
import PostDetails from "@/components/PostDetails";
import CommentInput from "@/components/CommentInput";

const Details = () => {
  const CURRENT_TAB_DETAILS = "/tabs/feed/details";
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <PostDetails
        currentTab={CURRENT_TAB_DETAILS}
        id={params.id}
        username={params.username}
        timestamp={params.timestamp}
        text={params.text}
        score={params.score}
        vote={params.vote}
        commentCount={params.commentCount}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}
        style={styles.keyboardContainer}
      >
        <CommentFeed postId={params.id} />
        <CommentInput postId={params.id} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  keyboardContainer: {
    flex: 1,
  },
});

export default Details;
