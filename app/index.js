import { useEffect, useState } from "react";

import { Redirect } from "expo-router";
import { useFonts } from "expo-font";

import Login from "@/components/Login";
import supabase from "@/lib/supabase";
import Loading from "@/components/Loading";
import Account from "@/components/Account";
import Auth from "@/components/Auth";
import { session } from '@supabase/supabase-js';


import Theme from '@/assets/theme';
import Images from '@/assets/Images';
import { StreamChat } from "stream-chat";
import { OverlayProvider, ChannelList, MessageList, MessageInput, Chat, Channel } from "stream-chat-expo";

const client = StreamChat.getInstance("94bmdhqrnsxy");

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    Doppio: require("../assets/Fonts/DoppioOne-Regular.ttf"),
  });

  useEffect(() => {
    setIsLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await client.connectUser(
          {
            id: "jlahey",
            name: "Jim Lahey",
            image: "https://i.imgur.com/fR9Jz14.png",
          },
          client.devToken('jlahey')
        );

      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();
  }, []);

 

  if (session && session.user) {
    return <Redirect href="/tabs/feed" />;
    // return <Account key={session.user.id} session={session} />
  } else if (isLoading) {
    return <Loading />;
  } else {
    return <Auth />;
  }
}
