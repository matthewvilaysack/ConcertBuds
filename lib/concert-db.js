import supabase from './supabase';

// Ensure chat room exists before inserting into user_concerts
export async function RSVPForConcert({
  userId,
  username,
  concertId,
  concertName,
  artistName,
  location,
  address,
  concertDate,
  concertTime,
  concertRawTime,
  avatarUrl,
  imageUrl,
}) {
  console.log(imageUrl)
  try {
    // Insert into user_concerts
    const { data, error } = await supabase.from("user_concerts").insert([
      {
        user_id: userId,
        username: username,
        concert_id: concertId,
        concert_name: concertName,
        artist_name: artistName,
        location: location,
        address: address,
        concert_date: concertDate,
        concert_time: concertTime,
        concert_raw_time: concertRawTime,
        avatar_url: avatarUrl,
        image_url: imageUrl,
        join_chat: false,
      },
    ]);

    if (error) {
      throw new Error(`Failed to RSVP for concert: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error RSVPing for concert:", error.message);
    throw error;
  }
}

export async function unRSVPFromConcert(userId, concertId) {
  try {
    // First get the user's join_chat status
    const { data: userConcert, error: statusError } = await supabase
      .from('user_concerts')
      .select('join_chat')
      .eq('user_id', userId)
      .eq('concert_id', concertId)
      .single();

    if (statusError) throw statusError;

    // If user was in the chat, decrement the num_users in chat_rooms
    if (userConcert?.join_chat) {
      const { data: chatRoom, error: chatRoomError } = await supabase
        .from('chat_rooms')
        .select('num_users')
        .eq('concert_id', concertId)
        .single();

      if (chatRoomError) throw chatRoomError;

      // Update chat room count
      const { error: updateError } = await supabase
        .from('chat_rooms')
        .update({ num_users: Math.max(0, (chatRoom?.num_users || 1) - 1) })
        .eq('concert_id', concertId);

      if (updateError) throw updateError;
    }

    // Finally, delete the user_concerts entry
    const { data, error } = await supabase
      .from('user_concerts')
      .delete()
      .match({ user_id: userId, concert_id: concertId });
    
    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error removing RSVP and leaving chat:', error);
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
      .select('username, avatar_url, user_id')
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
export const createChatRoom = async (concertId) => {
  try {
    console.log(`Creating chat room for concert ID: ${concertId}`);
    // Check if the chat room already exists
    const { data: existingRoom, error: existingError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('concert_id', concertId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingRoom) {
      console.log('Chat room already exists');
      return existingRoom;
    }

    // Create a new chat room
    const { data, error } = await supabase
      .from('chat_rooms')
      .insert([{ concert_id: concertId, num_users: 0 }])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
};

export const joinChatRoom = async (userId, concertId) => {
  try {
    console.log(`User ${userId} joining chat room ID: ${concertId}`);
    const { error } = await supabase
      .from('chat_rooms')
      .insert([{ id: userId, concert_id: concertId }]);

    if (error) throw error;

    // Increment `num_users` in chat room
    const { error: incrementError } = await supabase.rpc('increment_num_users', {
      concert_id: concertId,
    });

    if (incrementError) throw incrementError;

    console.log('User successfully joined the chat room.');
  } catch (error) {
    console.error('Error joining chat room:', error);
    throw error;
  }
};

export const leaveChatRoom = async (userId, concertId) => {
  try {
    console.log(`User ${userId} leaving chat room ID: ${concertId}`);
    const { error } = await supabase
      .from('user_chat_rooms')
      .delete()
      .eq('user_id', userId)
      .eq('concert_id', concertId);

    if (error) throw error;

    // Decrement `num_users` in chat room
    const { error: decrementError } = await supabase.rpc('decrement_num_users', {
      concert_id: concertId,
    });

    if (decrementError) throw decrementError;

    console.log('Successfully left the chat room.');
  } catch (error) {
    console.error('Error leaving chat room:', error);
    throw error;
  }
};

export const ensureChatRoomExists = async (concertId) => {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('concert_id', concertId)
    .single();

  if (error && error.code === 'PGRST116') {
    // If no chat room exists, create one
    const { data: newRoom, error: createError } = await supabase
      .from('chat_rooms')
      .insert([{ concert_id: concertId, num_users: 0 }])
      .single();
    if (createError) throw createError;
    return newRoom;
  }
  if (error) throw error;
  return data;
};

export async function createOrJoinChatRoom(concertId, userId, username, isGeneralChat = true) {
  console.log("Creating or joining chat room with:", { concertId, userId, username });
  try {
    // First check if user has already joined this chat
    const { data: userConcert, error: userConcertError } = await supabase
      .from("user_concerts")
      .select("join_chat")
      .eq("user_id", userId)
      .eq("concert_id", concertId)
      .single();

    if (userConcertError && userConcertError.code !== 'PGRST116') throw userConcertError;

    // If user has already joined, find and return the existing room
    if (userConcert?.join_chat) {
      const { data: existingRoom, error: existingError } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("concert_id", concertId)
        .single();
      
      if (existingError) throw existingError;
      return existingRoom;
    }

    // First try to find an existing chat room
    const { data: existingRoom, error: findError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("concert_id", concertId)
      .single();

    let chatRoom;

    if (!existingRoom) {
      // Create new room if none exists
      const { data: newRoom, error: createError } = await supabase
        .from("chat_rooms")
        .insert([{ 
          concert_id: concertId,
          num_users: 3,
          general_chat: isGeneralChat,
        }])
        .select()
        .single();

      if (createError) throw createError;
      chatRoom = newRoom;
    } else {
      // Update existing room
      const { data: updatedRoom, error: updateError } = await supabase
        .from("chat_rooms")
        .update({ num_users: existingRoom.num_users + 1 })
        .eq("concert_id", concertId)
        .select()
        .single();

      if (updateError) throw updateError;
      chatRoom = updatedRoom;
    }

    // Update user_concerts to mark chat as joined
    const { error: updateError } = await supabase
      .from("user_concerts")
      .update({ join_chat: true })
      .eq("user_id", userId)
      .eq("concert_id", concertId);

    if (updateError) throw updateError;

    return chatRoom;

  } catch (error) {
    console.error("Error creating or joining chat room:", error.message);
    throw error;
  }
}

export async function sendMessage(content, concertId, userId) {
  try {
    // First, get the chat_room id using the concert_id
    const { data: chatRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('concert_id', concertId)
      .single();

    if (roomError) throw roomError;
    if (!chatRoom) throw new Error('Chat room not found');

    // Now send the message using the numeric chat_room.id
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        concert_id: chatRoom.id,
        user_id: userId,
        content: content
      })
      .select()
      .single();

    if (messageError) throw messageError;
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
