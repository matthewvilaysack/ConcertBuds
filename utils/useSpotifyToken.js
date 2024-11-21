import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import getEnv from './env';

const {
  CLIENT_ID,
  REDIRECT_URI,
  SPOTIFY_API: { DISCOVERY }
} = getEnv();

WebBrowser.maybeCompleteAuthSession();

const useSpotifyToken = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAuth = async () => {
      try {
        const discovery = {
          authorizationEndpoint: DISCOVERY.authorizationEndpoint,
          tokenEndpoint: DISCOVERY.tokenEndpoint,
        };

        const redirectUri = AuthSession.makeRedirectUri({
          scheme: 'your-scheme', // Replace with your app's scheme
          path: 'spotify-auth',
        });

        const authRequest = new AuthSession.AuthRequest({
          clientId: CLIENT_ID,
          scopes: [
            "user-read-currently-playing",
            "user-read-recently-played",
            "user-read-playback-state",
            "user-top-read",
            "user-modify-playback-state",
            "streaming",
            "user-read-email",
            "user-read-private",
          ],
          redirectUri,
        });

        const result = await authRequest.promptAsync(discovery);

        if (result.type === 'success') {
          setToken(result.authentication.accessToken);
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAuth();
  }, []);

  return { token, isLoading };
};

export default useSpotifyToken;