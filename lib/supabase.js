import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mdaofsauhonoqzdzmazx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYW9mc2F1aG9ub3F6ZHptYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NjE4MDksImV4cCI6MjA0ODIzNzgwOX0.83S7c4VhzcG8hhS8qi2Z5EukqDH_l9Q8421yNIbJOFM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Use subscription pattern for AppState to avoid memory leaks
const subscription = AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

// Optional: Add a cleanup function if you need to remove the listener
export const cleanup = () => {
  subscription.remove()
}

// Export both named and default for flexibility
export default supabase