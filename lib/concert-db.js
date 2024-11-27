import supabase from './supabase';

export async function RSVPForConcert({
  userId,
  username,
  concertId,
  concertName,
  artist, 
  location,
  concertDate,
  avatarUrl
}) {
  try {
    const { data, error } = await supabase
      .from('user_concerts')
      .insert([
        {
          user_id: userId,
          username: username,
          concert_id: concertId,
          concert_name: concertName,
          artist: artist,
          location: location,
          concert_date: concertDate,
          avatar_url: avatarUrl
        }
      ])
      .single();
      console.log("calling RSVP for concert!")

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error RSVPing for concert:', error);
    throw error;
  }
}

export async function unRSVPFromConcert(userId, concertId) {
  try {
    const { data, error } = await supabase
      .from('user_concerts')
      .delete()
      .match({ user_id: userId, concert_id: concertId });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error removing RSVP from concert:', error);
    throw error;
  }
}

export async function getUserConcerts(userId) {
  try {
    const { data, error } = await supabase
      .from('user_concerts')
      .select('*')
      .eq('user_id', userId)
      .order('concert_date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user concerts:', error);
    throw error;
  }
}

export async function getConcertAttendees(concertId) {
  try {
    const { data, error } = await supabase
      .from('user_concerts')
      .select('username, avatar_url')
      .eq('concert_id', concertId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching concert attendees:', error);
    throw error;
  }
}