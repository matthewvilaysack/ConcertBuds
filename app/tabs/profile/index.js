import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
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
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={Images.background} style={styles.background} />
        

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
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

            <View style={styles.userInfoContainer}>
              <Text style={styles.emailLabel}>Email:</Text>
              <Text style={styles.emailText}>{session?.user?.email}</Text>
              
              <Text style={styles.usernameLabel}>Username:</Text>
              <Text style={styles.usernameText}>{username || "No username set"}</Text>
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
                <Text style={styles.showDetails}>{new Date(show.date).toLocaleDateString()} • {show.venue}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    // backgroundColor: Theme.colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: Theme.colors.backgroundPrimary,
    minHeight: '100%',
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },

  // Content Wrapper
  contentWrapper: {
    width: "100%",
    alignItems: "center",
    paddingTop: 80,
    padding: 20,
    paddingBottom: 40,
  },

  // Sign Out Button
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

  // Profile Container
  profileContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  updateAvatarButton: {
    backgroundColor: Theme.colors.textHighlighted,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  updateAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  // User Info Container
  userInfoContainer: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailLabel: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  emailText: {
    color: Theme.colors.textPrimary,
    marginBottom: 15,
    paddingLeft: 8,
    fontSize: 16,
  },
  usernameLabel: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  usernameText: {
    color: Theme.colors.textPrimary,
    paddingLeft: 8,
    fontSize: 16,
  },

  // Section Containers
  sectionContainer: {
    width: '100%',
    // backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 15,
    paddingLeft: 5,
  },

  // Genres Grid
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  genreText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },

  // Show Cards
  showCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.textHighlighted,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  showArtist: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 5,
  },
  showDetails: {
    color: Theme.colors.textPrimary,
    opacity: 0.8,
    fontSize: 14,
  },

  // Title Styles
  title: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  postTitle: {
    padding: 12,
    marginTop: 20,
  },
});
