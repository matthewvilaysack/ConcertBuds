import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Button, Input } from '@rneui/themed'
import Theme from '../assets/theme';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    console.log("email", email)
    console.log("password", password)
    console.log("session", session);
    console.log(error);

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          inputStyle={{ color: Theme.colors.text.white }} // Set input text color to white
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          inputStyle={{ color: Theme.colors.text.white }} // Set input text color to white
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
  <Button
    title="Sign in"
    disabled={loading}
    onPress={() => signInWithEmail()}
    buttonStyle={{
      backgroundColor: Theme.colors.ui.buttonPrimary,
      borderRadius: Theme.borderRadius.sm,
      padding: Theme.spacing.sm
    }}
    titleStyle={{
      color: Theme.colors.text.white,
      fontFamily: Theme.typography.fontFamilies.primary,
      fontSize: Theme.typography.sizes.base
    }}
    disabledStyle={{
      backgroundColor: Theme.colors.primary.light,
      opacity: 0.7
    }}
  />
</View>

<View style={styles.verticallySpaced}>
  <Button
    title="Sign up"
    disabled={loading}
    onPress={() => signUpWithEmail()}
    buttonStyle={{
      backgroundColor:Theme.colors.ui.buttonPrimary,
      borderRadius: Theme.borderRadius.sm,
      padding: Theme.spacing.sm
    }}
    titleStyle={{
      color: Theme.colors.text.white,
      fontFamily: Theme.typography.fontFamilies.primary,
      fontSize: Theme.typography.sizes.base
    }}
    disabledStyle={{
      backgroundColor: Theme.colors.primary.light,
      opacity: 0.7
    }}
  />
</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})