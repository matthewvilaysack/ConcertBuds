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
  avatarUrl,
}) {
  try {
    // Check if the chat room exists
    const { data: chatRoomData, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("concert_id", concertId)
      .single();

    if (!chatRoomData && chatRoomError?.code === "PGRST116") {
      // Create the chat room if it doesn't exist
      const { error: createChatRoomError } = await supabase
        .from("chat_rooms")
        .insert([{ concert_id: concertId, num_users: 0 }]);

      if (createChatRoomError) {
        throw new Error(
          `Failed to create chat room for concert_id: ${concertId}`
        );
      }
    } else if (chatRoomError) {
      throw chatRoomError;
    }

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
        avatar_url: avatarUrl,
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

export const joinChatRoom = async (userId, chatRoomId) => {
  try {
    console.log(`User ${userId} joining chat room ID: ${chatRoomId}`);
    const { error } = await supabase
      .from('user_chat_rooms')
      .insert([{ user_id: userId, chat_room_id: chatRoomId }]);

    if (error) throw error;

    // Increment `num_users` in chat room
    const { error: incrementError } = await supabase.rpc('increment_num_users', {
      chat_room_id: chatRoomId,
    });

    if (incrementError) throw incrementError;

    console.log('User successfully joined the chat room.');
  } catch (error) {
    console.error('Error joining chat room:', error);
    throw error;
  }
};

export const leaveChatRoom = async (userId, chatRoomId) => {
  try {
    console.log(`User ${userId} leaving chat room ID: ${chatRoomId}`);
    const { error } = await supabase
      .from('user_chat_rooms')
      .delete()
      .eq('user_id', userId)
      .eq('chat_room_id', chatRoomId);

    if (error) throw error;

    // Decrement `num_users` in chat room
    const { error: decrementError } = await supabase.rpc('decrement_num_users', {
      chat_room_id: chatRoomId,
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

const handleRSVP = async (userId, concertId, concertDetails) => {
  try {
    await ensureChatRoomExists(concertId); // Ensure the chat room exists

    const { data, error } = await supabase
      .from('user_concerts')
      .insert([
        {
          user_id: userId,
          concert_id: concertId,
          concert_name: concertDetails.name,
          location: concertDetails.location,
          concert_date: concertDetails.date,
          join_chat: false,
        },
      ]);
    if (error) throw error;

    console.log('RSVP successful:', data);
  } catch (err) {
    console.error('Error handling RSVP:', err.message);
  }
};

export async function createOrJoinChatRoom(concertId, userId, username) {
  console.log("Creating or joining chat room with:", { concertId, userId, username });

  try {
    // Upsert into chat_rooms to ensure the room exists
    const { data: chatRoom, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .upsert(
        { concert_id: concertId, num_users: 0 },
        { onConflict: "concert_id" }
      )
      .select() // Fetch the upserted or existing row
      .single(); // Ensure only one row is returned

    if (chatRoomError) {
      console.error("Error upserting into chat_rooms:", chatRoomError);
      throw chatRoomError;
    }

    // Increment the number of users in the chat room
    const { error: incrementError } = await supabase.rpc('increment_chat_users', {
      concert_id_param: concertId,
    });

    if (incrementError) {
      console.error("Error incrementing chat room users:", incrementError);
      throw new Error("Error incrementing chat room users: " + incrementError.message);
    }

    console.log("Chat room joined successfully:", chatRoom);

    return chatRoom;
  } catch (error) {
    console.error("Error creating or joining chat room:", error.message);
    throw error;
  }
}



