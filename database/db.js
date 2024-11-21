// utils/supabase.js
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cilmbyxvewqacopfupfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbG1ieXh2ZXdxYWNvcGZ1cGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NjM4NTYsImV4cCI6MjA0NzEzOTg1Nn0.4ozXxAGwVVGJGNRfqmHXpdkMwG7o8_q5CzNk19xuEXE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// api/profile.js
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
}

export async function updatePreferences(userId, preferences) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ preferences })
    .eq('id', userId);

  if (error) throw error;
  return data;
}

// api/concerts.js
export async function getRSVPs(userId) {
  const { data, error } = await supabase
    .from('concert_rsvps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addRSVP(userId, concertId, concertData, status = 'interested') {
  const { data, error } = await supabase
    .from('concert_rsvps')
    .insert([
      {
        user_id: userId,
        concert_id: concertId,
        concert_data: concertData,
        status,
      },
    ]);

  if (error) throw error;
  return data;
}

export async function updateRSVPStatus(userId, concertId, status) {
  const { data, error } = await supabase
    .from('concert_rsvps')
    .update({ status })
    .eq('user_id', userId)
    .eq('concert_id', concertId);

  if (error) throw error;
  return data;
}

export async function removeRSVP(userId, concertId) {
  const { data, error } = await supabase
    .from('concert_rsvps')
    .delete()
    .eq('user_id', userId)
    .eq('concert_id', concertId);

  if (error) throw error;
  return data;
}