import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Channel as ChannelType } from 'stream-chat';
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
  Chat,
} from 'stream-chat-expo';

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams();

  const { client } = useChatContext();

  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      if (channels.length > 0) {
        setChannel(channels[0]);
      } else {
        navigation.goBack(); // Navigate back if no channel is found
      }
    };

    fetchChannel();
  }, [cid, client, navigation]);

  if (!channel) {
    return <ActivityIndicator />;
  }

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <MessageList />
        <View edges={['bottom']}>
          <MessageInput />
        </View>
      </Channel>
    </Chat>
  );
}