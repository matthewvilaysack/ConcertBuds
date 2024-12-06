import { useState, useEffect } from "react";
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Theme from "@/assets/theme";
import Loading from "@/components/Loading";
import supabase from "@/lib/supabase";
import useSession from "@/utils/useSession";
import Images from "@/assets/Images";
import Avatar from '../../../components/Avatar';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Profile() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [genres, setGenres] = useState(['Rock', 'Pop', 'Jazz', 'Electronic']);
  const [pastShows, setPastShows] = useState([
    { id: 1, artist: 'Taylor Swift', date: '2023-12-01', venue: 'Stadium' },
    { id: 2, artist: 'Ed Sheeran', date: '2023-11-15', venue: 'Arena' },
  ]);

  useEffect(() => {
    if (session?.user) {
      getProfile();
    }
  }, [session]);

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

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const newAvatarUrl = `https://xsgames.co/randomusers/assets/avatars/pixel/${Math.floor(Math.random() * 50 + 1)}.jpg`;

      const updates = {
        id: session?.user.id,
        username: username || session?.user?.email?.split('@')[0],
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      setAvatarUrl(newAvatarUrl);
      Alert.alert('Success', 'Profile updated successfully');
      await getProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  }

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
        <Text style={styles.signOutText}>Logout</Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              size={150}
              url={avatarUrl}
              onUpload={(url) => {
                setAvatarUrl(url)
              }}
            />
          </View>

          <Text style={styles.username}>{username || session?.user?.email}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>FAVORITE GENRES</Text>
          <View style={styles.genresGrid}>
            {genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PAST SHOWS</Text>
          {pastShows.map((show) => (
            <View key={show.id} style={styles.showCard}>
              <View style={styles.dateContainer}>
                <Text style={styles.month}>
                  {new Date(show.date).toLocaleString('default', { month: 'short' })}
                </Text>
                <Text style={styles.day}>
                  {new Date(show.date).getDate()}
                </Text>
              </View>
              <View style={styles.showContent}>
                <Text style={styles.showVenue}>{show.venue}</Text>
                <Text style={styles.showArtist}>{show.artist}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Also update these related styles to ensure consistency
scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 150 : 120, // Adjusted for different devices
    marginBottom: 0,
},
  scrollContent: {
    paddingBottom: 120, // Added padding to ensure content isn't hidden by tab bar
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20, // Added to give some space at the top
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    color: Theme.colors.background.primary,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    paddingBottom: 0,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editButton: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.textHighlighted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Doppio One',
    color: 'white',
    marginTop: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Doppio One',
    color: 'white',
    marginBottom: 15,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreTag: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  genreText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Doppio One',
  },
  showCard: {
    width: windowWidth * 0.9,
    height: 90,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  dateContainer: {
    width: 75,
    height: '100%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    fontSize: 16,
    fontFamily: 'Doppio One',
    color: '#000000',
    textTransform: 'uppercase',
  },
  day: {
    fontSize: 32,
    fontFamily: 'Doppio One',
    color: '#000000',
    fontWeight: '500',
  },
  showContent: {
    flex: 1,
    padding: 15,
  },
  showVenue: {
    fontSize: 18,
    fontFamily: 'Doppio One',
    color: '#000000',
    marginBottom: 5,
  },
  showArtist: {
    fontSize: 14,
    fontFamily: 'Doppio One',
    color: '#000000',
  },
signOutButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 60 : 40, // Increased top padding
    right: 20,
    zIndex: Theme.zIndex.above,
    backgroundColor: Theme.colors.primary.main,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    marginTop: Platform.OS === 'ios' ? 40 : 20, // Added responsive margin for different devices
    shadowColor: Theme.colors.ui.shadow,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
  signOutText: {
    color: Theme.colors.text.white,
    fontFamily: Theme.typography.fontFamilies.primary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: "500",
  },


});