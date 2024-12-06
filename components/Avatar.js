import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { StyleSheet, View, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Images from '@/assets/Images';
import Theme from '@/assets/theme';

export default function Avatar({ url, size = 150, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(url);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    setAvatarUrl(url);
  }, [url]);

  async function uploadAvatar() {
    try {
      setUploading(true);

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const image = result.assets[0];
      if (!image.uri || !image.base64) {
        throw new Error('No image data available');
      }

      setAvatarUrl(image.uri);

      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const base64Str = image.base64;
      const byteCharacters = atob(base64Str);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, byteArray, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onUpload(publicUrl);
      setAvatarUrl(publicUrl);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            accessibilityLabel="Avatar"
            style={[avatarSize, styles.avatar, styles.image]}
          />
        ) : (
          <View style={[avatarSize, styles.avatar, styles.noImage]} />
        )}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={uploadAvatar}
          disabled={uploading}
        >
          <Image 
            source={Images.pencil_icon} 
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Theme.colors.primary.main,
    shadowColor: Theme.colors.ui.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    resizeMode: 'cover',
  },
  noImage: {
    backgroundColor: Theme.colors.text.medium,
    borderWidth: 3,
    borderColor: Theme.colors.primary.main,
  },
  editButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.ui.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: Theme.colors.text.white,
  }
});