import React from "react";
import { View, StyleSheet } from "react-native";
import Post from "@/components/Post";
import Theme from "@/assets/theme";

const PostDetails = ({
  currentTab,
  id,
  username,
  timestamp,
  text,
  score,
  vote,
  commentCount,
}) => {
  return (
    <View style={styles.container}>
      <Post
        currentTab={currentTab}
        id={id}
        username={username}
        timestamp={timestamp}
        text={text}
        score={score}
        vote={vote}
        commentCount={commentCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});

export default PostDetails;
