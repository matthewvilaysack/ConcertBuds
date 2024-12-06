import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import HeaderButton from "../../../components/HeaderButton"; // Path to your custom HeaderButton component
import Theme from "@/assets/theme";
import useSession from "@/utils/useSession";
import db from "@/lib/supabase";

export default function NewPost() {
  const session = useSession();
  const [username, setUsername] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const router = useRouter();

  const submitPost = async () => {
    setIsLoading(true);
    const { data, error } = await db
      .from("posts")
      .insert({
        username: "Anonymous",
        text: inputText,
        user_id: session.user.id,
      })
      .select();
    if (error) {
      console.error("Error inserting post:", error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    router.back();
  };

  useEffect(() => {
    setSubmitDisabled(!inputText); // Disable button if inputs are empty
  }, [inputText]);

  // const submitDisabled = isLoading || inputText.length === 0;
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <HeaderButton
  //         title="Submit"
  //         onPress={submitPost}
  //         disabled={submitDisabled}
  //         colors={[Theme.colors.textHighlighted, Theme.colors.textSecondary]}
  //       />
  //     ),
  //   });
  // }, [navigation, submitDisabled, inputText]);

  return (
    <View style={styles.container}>
      <View style={styles.nameInputContainer}>
        <Text style={styles.nameInputPrompt}>Post as:</Text>
        <TextInput
          style={styles.nameInput}
          value={username}
          onChangeText={setUsername}
          placeholder={"Anonymous"}
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder={"What do you want to share?"}
        placeholderTextColor={Theme.colors.textSecondary}
        multiline
        textAlignVertical="top"
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  nameInputContainer: {
    width: "100%",
    padding: 16,
    gap: 8,
  },
  nameInputPrompt: {
    color: Theme.colors.textPrimary,
  },
  nameInput: {
    color: Theme.colors.textSecondary,
  },
  headerButtonTextPrimary: {
    fontSize: 18,
    color: Theme.colors.textHighlighted,
  },
  input: {
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    flex: 1,
    width: "100%",
    padding: 16,
  },
});
