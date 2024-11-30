import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Theme from '@/assets/theme';
import Images from '@/assets/Images';
import { StreamChat } from "stream-chat";
import { OverlayProvider, ChannelList, MessageList, MessageInput, Chat, Channel } from "stream-chat-expo";
import { router } from 'expo-router';

const client = StreamChat.getInstance("94bmdhqrnsxy");
const windowHeight = Dimensions.get("window").height;

export default function ChatScreen() {
  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState(null);

  return (
    <OverlayProvider>
      <Chat client={client}>
        {channel ? (
          <Channel
            channel={channel}
            keyboardVerticalOffset={0}
            thread={thread}
            threadList={!!thread}
          >
            {thread ? (
              <Thread />
            ) : (
              <>
                <MessageList onThreadSelect={setThread} />
                <View style={styles.messageInputWrapper}>
                  <MessageInput />
                </View>
              </>
            )}
          </Channel>
        ) : (
          <ChannelList onSelect={(channel) => {
            console.log("channel", channel.cid);
            router.push(`${channel.cid}`);
          }} />
        )}
      </Chat>
    </OverlayProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    position: "absolute",
    top: "20%",
    alignItems: "center",
    width: "100%",
    height: windowHeight - 400,
    padding: 20,
  },
  messageInputWrapper: {
    position: 'absolute',
    bottom: 100, // Move the MessageInput up by 100 units to avoid overlap with tabs
    width: '100%',
    backgroundColor: Theme.colors.backgroundPrimary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  chatSection: {
    flex: 1,
    width: '90%',
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 20,
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: {
    fontFamily: 'Doppio One',
    fontSize: 38,
    color: '#FFFFFF',
    marginBottom: 20,
  },
});