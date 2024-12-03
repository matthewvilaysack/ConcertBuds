import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import useSession from '@/utils/useSession';

const ChatInput = ({ concertId }) => {
  const [message, setMessage] = useState('');
  const session = useSession();
  console.log("CHAT ROOM ID ", concertId);

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!session?.user?.id) {
      Alert.alert('Error', 'You must be logged in to send messages');
      return;
    }

    try {
      console.log("Attempting to find chat room with concert_id:", concertId);
      
      // First get the chat room numeric id
      const { data: chatRooms, error: roomError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('concert_id', concertId);

      if (roomError) throw roomError;
      
      if (!chatRooms || chatRooms.length === 0) {
        console.log("No chat room found, creating one");
        // Create the chat room if it doesn't exist
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert({ 
            concert_id: concertId,
            num_users: 1 
          })
          .select()
          .single();

        if (createError) throw createError;
        
        // Use the newly created room's id
        console.log("Created new chat room with id:", concertId);

        // Send message with new room id
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            concert_id: concertId,
            user_id: session.user.id,
            content: message.trim()
          });

        if (messageError) throw messageError;
      } else {
        // Use existing room's id
        console.log("Found existing chat room with id:", concertId);

        // Send message with existing room id
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            concert_id: concertId,
            user_id: session.user.id,
            content: message.trim()
          });

        if (messageError) throw messageError;
      }

      // Clear the input on success
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor="#666"
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={sendMessage}
      />
      <TouchableOpacity 
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
        onPress={sendMessage}
        disabled={!message.trim()}
      >
        <View style={styles.sendButtonInner} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonInner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    transform: [{ rotate: '90deg' }],
  }
});

export default ChatInput;