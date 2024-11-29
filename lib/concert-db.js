import supabase from './supabase';

export async function RSVPForConcert({
  userId,
  username,
  concertId,
  concertName,
  artistName, 
  location,
  concertDate,
  concertTime,
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
          artist_name: artistName,
          location: location,
          concert_date: concertDate,
          concert_time: concertTime,
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
    // 
    console.log("removing rsvp for concert")
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
    // fetching user concerts for home feed
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

export const checkUserRSVPStatus = async (userId, concertId) => {
  try {
    const userConcerts = await getUserConcerts(userId);
    return userConcerts?.some(concert => concert.concert_id === concertId);
  } catch (error) {
    console.error("Error checking RSVP status:", error);
    return false;
  }
};

// chat room functions

export const fetchChatRoomDetails = async (chatRoomId) => {
  const { data, error } = await supabase
    .from('chat_room_users')
    .select('*')
    .eq('chat_room_id', chatRoomId);

  if (error) {
    console.error('Error fetching chat room details:', error);
    return null;
  }

  return data;
};


const joinChatRoom = async (userId, chatRoomId) => {
  const { error } = await supabase
    .from('user_chat_rooms')
    .insert([{ user_id: userId, chat_room_id: chatRoomId }]);

  if (error) {
    console.error('Error joining chat room:', error);
  } else {
    console.log('User successfully joined the chat room.');
  }
};


const leaveChatRoom = async (userId, chatRoomId) => {
  try {
    const { error } = await supabase
      .from('user_chat_rooms')
      .delete()
      .eq('user_id', userId)
      .eq('chat_room_id', chatRoomId);

    if (error) {
      console.error('Error leaving chat room:', error);
      return { success: false, message: 'Failed to leave the chat room.' };
    }

    console.log('Successfully left the chat room.');
    return { success: true, message: 'Successfully left the chat room.' };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
};

const handleLeave = async () => {
  const result = await leaveChatRoom(userId, chatRoomId);
  if (result.success) {
    alert(result.message);
    setChatRooms((prevRooms) =>
      prevRooms.filter((room) => room.id !== chatRoomId)
    );
  } else {
    alert(result.message);
  }
};



export default leaveChatRoom;
