import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import PropTypes from 'prop-types';
import { tokenProvider } from '../utils/tokenProvider';
import ENV from '../env';

const client = StreamChat.getInstance(ENV.EXPO_PUBLIC_STREAM_API_KEY);

export default function ChatProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const connect = async () => {
      try {
        const token = await tokenProvider();
        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name,
            image: profile.avatar_url, // Replace with your image logic
          },
          token
        );
        setIsReady(true);
      } catch (error) {
        console.error("Error connecting to Stream Chat:", error);
      }
    };

    connect();

    return () => {
      if (isReady) client.disconnectUser();
      setIsReady(false);
    };
  }, [profile]);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
