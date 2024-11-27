import { useState } from "react";
import {
  Text,
  Alert,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import supabase from '@/lib/supabase'
import Theme from "@/assets/theme";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert(error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) Alert.alert(error.message);
      if (!session) Alert.alert('Please check your inbox for email verification!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const isButtonDisabled = loading || email.length === 0 || password.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.splash}>
        <MaterialCommunityIcons
          size={64}
          name="bee-flower"
          color={Theme.colors.iconHighlighted}
        />
        <Text style={styles.splashText}>Buzz</Text>
      </View>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        placeholderTextColor={Theme.colors.textSecondary}
        autoCapitalize={"none"}
        style={styles.input}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Password"
        placeholderTextColor={Theme.colors.textSecondary}
        secureTextEntry={true}
        autoCapitalize={"none"}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => signInWithEmail()}
          disabled={isButtonDisabled}
        >
          <Text
            style={[
              styles.button,
              isButtonDisabled ? styles.buttonDisabled : undefined,
            ]}
          >
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => signUpWithEmail()}
          disabled={isButtonDisabled}
        >
          <Text
            style={[
              styles.button,
              isButtonDisabled ? styles.buttonDisabled : undefined,
            ]}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    padding: 12,
    backgroundColor: Theme.colors.backgroundPrimary,
    flex: 1,
  },
  splash: {
    alignItems: "center",
    marginBottom: 12,
  },
  splashText: {
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    fontSize: 60,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    width: "100%",
    padding: 16,
    marginBottom: 8,
  },
  button: {
    color: Theme.colors.textHighlighted,
    fontSize: 18,
    fontWeight: "500",
    padding: 8,
  },
  buttonDisabled: {
    color: Theme.colors.textSecondary,
  },
});