import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Theme from "@/assets/theme";
import db from "@/lib/supabase";
import useSession from "@/utils/useSession";

const CommentInput = ({ postId }) => {
  const session = useSession();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitComment = async () => {
    setIsLoading(true);
    const { data, error } = await db
      .from("comments")
      .insert({
        post_id: postId,
        username: "Anonymous",
        text: inputText,
        user_id: session.user.id,
      })
      .select();

    if (error) {
      console.error("Error inserting comment:", error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setInputText("");
    Keyboard.dismiss();
  };

  const submitDisabled = isLoading || inputText.length === 0;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder={"Write a comment..."}
        placeholderTextColor={Theme.colors.textSecondary}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={submitComment}
        disabled={submitDisabled}
      >
        <FontAwesome
          size={24}
          name="send"
          color={
            submitDisabled
              ? Theme.colors.iconSecondary
              : Theme.colors.iconHighlighted
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 8,
    alignItems: "center",
  },
  input: {
    paddingLeft: 12,
    marginRight: 8,
    height: 48,
    borderRadius: 24,
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    flex: 1,
  },
  sendButton: {
    padding: 4,
  },
});

export default CommentInput;
