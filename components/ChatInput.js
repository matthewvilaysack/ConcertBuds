import React, { useState } from "react";
import { View, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import useSession from "@/utils/useSession";
import Theme from '@/assets/theme';
import Images from "@/assets/Images";

const ChatInput = ({ concertId }) => {
  const [message, setMessage] = useState("");
  const session = useSession();

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!session?.user?.id) {
      Alert.alert("Error", "You must be logged in to send messages");
      return;
    }
  
    const trimmedMessage = message.trim();
    setMessage(""); // Optimistic update
  
    try {
      // First save to database
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          concert_id: concertId,
          user_id: session.user.id,
          content: trimmedMessage,
        })
        .select('*, profiles:user_id(username, avatar_url)')
        .single();
  
      if (messageError) throw messageError;
  
      // Then broadcast to all connected clients
      const channel = supabase
        .channel(`concert-chat-${concertId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'new-message',
        payload: messageData
      });
  
      console.log('Message sent and broadcasted successfully');
  
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage(trimmedMessage); // Restore message if failed
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
        <Image 
          source={Images.send_icon} 
          style={[
            styles.sendButtonIcon,
            !message.trim() && styles.sendButtonIconDisabled
          ]} 
        />
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.primary.main,
  },
  sendButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  sendButtonIconDisabled: {
    tintColor: 'rgba(255, 255, 255, 0.5)',
  }
});

export default ChatInput;
