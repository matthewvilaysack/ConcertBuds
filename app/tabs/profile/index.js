import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import supabase from "@/lib/supabase";
import useSession from "@/utils/useSession";
import Images from "@/assets/Images";
import Button from '../../../components/Button';
import Avatar from '../../../components/Avatar';


export default function Profile() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const CURRENT_TAB_DETAILS = "/tabs/profile/details";
  
  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');
  
      const newAvatarUrl = `https://xsgames.co/randomusers/assets/avatars/pixel/${Math.floor(Math.random() * 50 + 1)}.jpg`;
  
      const updates = {
        id: session?.user.id,
        username: username || session?.user?.email?.split('@')[0], // Use email prefix as fallback username
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      };
  
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
  
      if (error) throw error;
  
      setAvatarUrl(newAvatarUrl);
      Alert.alert('Success', 'Profile updated successfully');
      // Fetch updated profile to ensure we have latest data
      await getProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  }
  
  // Make sure your useEffect hook looks like this:
  useEffect(() => {
    if (session?.user) {
      getProfile();
    }
  }, [session]);
  
  // And your getProfile function should look like this:
  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');
  
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      
      if (error && status !== 406) {
        throw error;
      }
  
      console.log('Profile data from database:', data);
  
      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', error.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }

  

  const [genres, setGenres] = useState(['Rock', 'Pop', 'Jazz', 'Electronic']); // Example genres
  const [pastShows, setPastShows] = useState([
    { id: 1, artist: 'Taylor Swift', date: '2023-12-01', venue: 'Stadium' },
    { id: 2, artist: 'Ed Sheeran', date: '2023-11-15', venue: 'Arena' },
  ]);
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(error.message);
      } else {
        router.navigate("/");
        Alert.alert("Sign out successful.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!session || loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

      <View style={styles.contentWrapper}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>MY PROFILE</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Avatar
                size={150}
                url={avatarUrl}
                onUpload={(url) => {
                  setAvatarUrl(url)
                }}
              />
            </View>
          </View>

          {/* Genres Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Favorite Genres</Text>
            <View style={styles.genresGrid}>
              {genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Past Shows Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Past Shows</Text>
            {pastShows.map((show) => (
              <View key={show.id} style={styles.showCard}>
                <Text style={styles.showArtist}>{show.artist}</Text>
                <Text style={styles.showDetails}>
                  {new Date(show.date).toLocaleDateString()} • {show.venue}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  headingContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text.white,
    letterSpacing: 1,
    fontFamily: 'Doppio One',
  },
  contentWrapper: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 90,
    height: '100%',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signOutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
  },
  signOutText: {
    color: Theme.colors.textHighlighted,
    fontWeight: "bold",
    fontSize: 16,
  },
  profileContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  sectionContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text.white,
    marginBottom: 15,
    paddingLeft: 5,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 5,
  },
  genreTag: {
    backgroundColor: Theme.colors.textHighlighted,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  showCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.textHighlighted,
  },
  showArtist: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text.white,
    marginBottom: 5,
  },
  showDetails: {
    color: Theme.colors.text.white,
    opacity: 0.8,
    fontSize: 14,
  },
});