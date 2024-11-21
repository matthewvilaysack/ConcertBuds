import axios from "axios";
import ENV from "./env";

export const fetchConcerts = async (query) => {
  try {
    const response = await axios.get(ENV.BASE_URL, {
      params: {
        keyword: query,
        apikey: ENV.TICKETMASTER_API_KEY,
      },
    });
    return response.data._embedded?.events || [];
  } catch (error) {
    console.error("Error fetching concerts:", error);
    throw new Error("Failed to fetch concerts.");
  }
};
