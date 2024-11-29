
import supabase from "@/lib/supabase";
import { getUserConcerts } from "@/lib/concert-db";

export const checkUserRSVPStatus = async (userId, concertId) => {
  try {
    const userConcerts = await getUserConcerts(userId);
    return userConcerts?.some(concert => concert.concert_id === concertId);
  } catch (error) {
    console.error("Error checking RSVP status:", error);
    return false;
  }
};