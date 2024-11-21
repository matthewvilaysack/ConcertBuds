import { StyleSheet, TextInput, View } from 'react-native';
import { BlurView } from 'expo-blur';
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function BlurSearchBar() {
  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for artist, tour, etc."
          placeholderTextColor="#686767"
        />
      </BlurView>
      <View style={styles.searchButton}>
        <FontAwesome name="search" size={20} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 300, // Adjusted for closer alignment with design
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1A1A1A',
  },
  searchButton: {
    width: 60,
    height: '100%',
    backgroundColor: '#846AE3',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
