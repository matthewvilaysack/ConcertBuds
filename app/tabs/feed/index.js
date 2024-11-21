import { StyleSheet, View, Image } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

import Theme from "@/assets/theme";
import Feed from "@/components/Feed";
import Images from "@/assets/Images";

export default function Page() {
  const CURRENT_TAB_DETAILS = "/tabs/feed/details";
  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background}></Image>

      <StatusBar style="light" />
      {/* <Feed
        shouldNavigateToComments={true}
        fetchUsersPostsOnly={false}
        currentTab={CURRENT_TAB_DETAILS}
      />
      <Link href="/tabs/feed/newpost" style={styles.postButtonContainer}>
        <View style={styles.postButton}>
          <FontAwesome size={32} name="plus" color={Theme.colors.textPrimary} />
        </View>
      </Link> */}
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
    flex: 1,
    width: "100%",
    height: "100%",
  },
  postButtonContainer: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
  postButton: {
    backgroundColor: Theme.colors.iconHighlighted,
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    // FontAwesome 'plus' icon is a bit off-center, so we manually center it by
    // tweaking the padding
    paddingTop: 2,
    paddingLeft: 1,
  },
});
