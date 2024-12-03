import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import useSession from "@/utils/useSession";
import Theme from '@/assets/theme';
const ChatInput = ({ concertId }) => {
  const [message, setMessage] = useState("");
  const session = useSession();

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!session?.user?.id) {
      Alert.alert("Error", "You must be logged in to send messages");
      return;
    }

    try {
      const { data: chatRooms, error: roomError } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("concert_id", concertId);

      if (roomError) throw roomError;

      if (!chatRooms || chatRooms.length === 0) {
        const { data: newRoom, error: createError } = await supabase
          .from("chat_rooms")
          .insert({ concert_id: concertId, num_users: 1 })
          .select()
          .single();

        if (createError) throw createError;

        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            concert_id: concertId,
            user_id: session.user.id,
            content: message.trim(),
          });

        if (messageError) throw messageError;
      } else {
        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            concert_id: concertId,
            user_id: session.user.id,
            content: message.trim(),
          });

        if (messageError) throw messageError;
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor="#9E9E9E"
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={sendMessage}
      />
      <TouchableOpacity
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        onPress={sendMessage}
        disabled={!message.trim()}
      >
        <View style={styles.sendButtonIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent input
    borderRadius: 20,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Doppio One",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 10,
    backgroundColor: Theme.colors.primary, // Use a vibrant theme color
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.primary.main, // Subtle disabled state
  },
  sendButtonIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 16,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFFFFF", // White arrow
    transform: [{ rotate: "90deg" }],
  },
});

export default ChatInput;
