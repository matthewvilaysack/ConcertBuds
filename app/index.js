import { useEffect, useState } from "react";

import { Redirect } from "expo-router";
import { useFonts } from "expo-font";

import Login from "@/components/Login";
import db from "@/lib/supabase";
import Loading from "@/components/Loading";

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true for initial load
  const [fontsLoaded] = useFonts({
    Doppio: require("../assets/Fonts/DoppioOne-Regular.ttf"),
  });

  useEffect(() => {
    setIsLoading(true);

    db.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
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
    return <Login />;
  }
}
