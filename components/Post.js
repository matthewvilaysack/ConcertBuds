import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import useSession from "@/utils/useSession";
import db from "../lib/supabase";
import Theme from "@/assets/theme";

export default function Post({
  shouldNavigateOnPress = false,
  currentTab,
  id,
  username,
  timestamp,
  text,
  score,
  vote,
  commentCount,
}) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const submitVote = async (vote) => {
    setIsLoading(true);
    const { data: likes, error: fetchError } = await db
      .from("likes")
      .select("vote")
      .eq("post_id", id)
      .eq("user_id", session.user.id);

    if (fetchError && fetchError.message !== "No rows found") {
      console.error("Error fetching current vote:", fetchError.message);
      setIsLoading(false);
      return;
    }
    updateVote = vote;
    const { data, error } = await db.from("likes").upsert(
      {
        vote: updateVote,
        post_id: id,
        user_id: session.user.id,
      },
      { onConflict: ["post_id", "user_id"] }
    );
    if (error) {
      console.error("Error submitting vote:", error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  let post = (
    <TouchableOpacity style={styles.content} disabled={!shouldNavigateOnPress}>
      <View style={styles.header}>
        <FontAwesome
          size={Theme.sizes.iconSmall}
          name="user"
          color={Theme.colors.iconSecondary}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <View style={styles.comment}>
          <FontAwesome
            size={Theme.sizes.iconSmall}
            name="comment"
            color={Theme.colors.iconSecondary}
          />
          <Text style={styles.commentCount}>{commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (shouldNavigateOnPress) {
    post = (
      <Link
        href={{
          pathname: currentTab,
          params: {
            id: id,
            username: username,
            timestamp: timestamp,
            text: text,
            score: score,
            commentCount: commentCount,
            vote: vote,
          },
        }}
        asChild={true}
        style={styles.content}
      >
        {post}
      </Link>
    );
  }

  const upvoteButton = (
    <TouchableOpacity
      onPress={() => (vote > 0 ? submitVote(0) : submitVote(1))}
      style={styles.upvoteButton}
      disabled={isLoading}
    >
      <FontAwesome
        size={16}
        name="chevron-up"
        color={
          vote > 0 ? Theme.colors.iconHighlighted : Theme.colors.iconSecondary
        }
      />
    </TouchableOpacity>
  );

  const downvoteButton = (
    <TouchableOpacity
      onPress={() => (vote < 0 ? submitVote(0) : submitVote(-1))}
      style={styles.downvoteButton}
      disabled={isLoading}
    >
      <FontAwesome
        size={16}
        name="chevron-down"
        color={
          vote < 0 ? Theme.colors.iconHighlighted : Theme.colors.iconSecondary
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {post}
      <View style={styles.scoreContainer}>
        {upvoteButton}
        <Text style={styles.score}>{score}</Text>
        {downvoteButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    // padding: 24,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  body: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  scoreContainer: {
    alignItems: "center",
    marginLeft: 16,
  },
  text: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    fontSize: Theme.sizes.textMedium,
  },
  username: {
    color: Theme.colors.textSecondary,
    fontWeight: "bold",
    marginLeft: 8,
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    flex: 2,
  },
  comment: {
    flexDirection: "row",
    flex: 3,
  },
  commentCount: {
    color: Theme.colors.textSecondary,
    marginLeft: 8,
  },
  score: {
    color: Theme.colors.textHighlighted,
    fontWeight: "bold",
    fontSize: Theme.sizes.textLarge,
  },
  // Make sure the buttons have a lot of padding to increase the area of the touch target.
  upvoteButton: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  downvoteButton: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
});
