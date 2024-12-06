import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { StyleSheet, View, Alert, Image, Button } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export default function Avatar({ url, size = 150, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(url)  // Initialize with provided URL
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    setAvatarUrl(url)  // Update avatarUrl when url prop changes
  }, [url])

  async function uploadAvatar() {
    try {
      setUploading(true)

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true
      })

      if (result.canceled || !result.assets?.[0]) {
        return
      }

      const image = result.assets[0]
      if (!image.uri || !image.base64) {
        throw new Error('No image data available')
      }

      // Set the image immediately for preview
      setAvatarUrl(image.uri)

      // Create file name with timestamp for uniqueness
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Convert base64 to Uint8Array
      const base64Str = image.base64
      const byteCharacters = atob(base64Str)
      const byteNumbers = new Array(byteCharacters.length)
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      
      const byteArray = new Uint8Array(byteNumbers)

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, byteArray, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw uploadError
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      onUpload(publicUrl)
      setAvatarUrl(publicUrl)

    } catch (error) {
      console.error('Upload error:', error)
      Alert.alert('Error', error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
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
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={uploading ? 'Uploading ...' : 'Update Picture'}
          onPress={uploadAvatar}
          disabled={uploading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    borderRadius: 75, // Makes it circular
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 75, // Matches avatar borderRadius
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  }
})
