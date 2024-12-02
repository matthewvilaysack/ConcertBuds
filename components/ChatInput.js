import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import Theme from "@/assets/theme";
import supabase from "@/lib/supabase";

const ChatInput = ({ chatRoomId }) => {
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();

      const { error } = await supabase.from("messages").insert({
        chat_room_id: chatRoomId,
        user_id: user.id,
        content: inputText,
      });

      if (error) throw error;

      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Write a message..."
        placeholderTextColor={Theme.colors.textSecondary}
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
    color: Theme.colors.textPrimary,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatInput;
