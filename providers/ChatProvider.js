import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import PropTypes from 'prop-types';
import { supabase } from '@/lib/supabase';
import { tokenProvider } from '../utils/tokenProvider';
import ENV from '../utils/env';

const client = StreamChat.getInstance(ENV.EXPO_PUBLIC_STREAM_API_KEY);

export default function ChatProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        console.log(user);

        setProfile(profile);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    console.log(profile.avatar_url);

    const connect = async () => {
      try {
        console.log("Fetching token...");
        const token = await tokenProvider();
        console.log("Token fetched:", token);

        console.log("Connecting user...");
        await client.connectUser(
          {
            id: profile.id,
            name: profile.username,
            image: supabase.storage
              .from('avatars')
              .getPublicUrl(profile.avatar_url).data.publicUrl,
          },
          token
        );
        console.log("User connected!");
        setIsReady(true);
      } catch (error) {
        console.error("Error connecting user:", error);
      }
    };

    connect();

    return () => {
      if (isReady) {
        client.disconnectUser();
      }
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
