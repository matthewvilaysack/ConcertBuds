import { useState, useEffect } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";

import Theme from "@/assets/theme";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import useSession from "@/utils/useSession";

import timeAgo from "@/utils/timeAgo";
import db from "../database/db";

export default function Feed({
  shouldNavigateToComments = false,
  currentTab = null,
  fetchUsersPostsOnly = false,
  uuid = null,
}) {
  const session = useSession();
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let postsResponse;
      if (!session || !session.user || !session.user.id) {
        console.error("Session is null or invalid");
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const likesResponse = await db
        .from("likes")
        .select()
        .eq("user_id", session.user.id);

      const voteMap = likesResponse.data.reduce((acc, like) => {
        acc[like.post_id] = like.vote;
        return acc;
      }, {});

      if (fetchUsersPostsOnly) {
        const response = await db
          .from("posts_with_counts")
          .select()
          .eq("user_id", uuid);
        postsResponse = response.data;
      } else {
        const response = await db.from("posts_with_counts").select();
        postsResponse = response.data;
      }
      const updatedPosts = postsResponse.map((post) => ({
        ...post,
        vote: voteMap[post.id] === undefined ? 0 : voteMap[post.id],
      }));

      setPosts(updatedPosts);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (session && session.user && session.user.id) {
      fetchPosts();
    }
  }, [session, fetchUsersPostsOnly, uuid]);

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <Post
          shouldNavigateOnPress={shouldNavigateToComments}
          currentTab={currentTab}
          id={item.id}
          username={item.username}
          timestamp={timeAgo(item.timestamp)}
          text={item.text}
          score={item.like_count}
          vote={item.vote}
          commentCount={item.comment_count}
        />
      )}
      contentContainerStyle={styles.posts}
      style={styles.postsContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            fetchPosts();
          }}
          tintColor={Theme.colors.textPrimary} // only applies to iOS
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  postsContainer: {
    width: "100%",
  },
  posts: {
    gap: 8,
  },
});
