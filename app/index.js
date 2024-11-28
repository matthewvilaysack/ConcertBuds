import { useEffect, useState } from "react";

import { Redirect } from "expo-router";
import { useFonts } from "expo-font";

import Login from "@/components/Login";
import supabase from "@/lib/supabase";
import Loading from "@/components/Loading";
import Account from "@/components/Account";
import Auth from "@/components/Auth";

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

  if (session) {
    return <Redirect href="/tabs/feed" />;
  } else if (isLoading) {
    return <Loading />;
  } else {
    return <Auth />;
  }
}
