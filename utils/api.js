import axios from "axios";
import ENV from "./env";
export const fetchConcerts = async (query, page = 0) => {
  try {
    const response = await axios.get(ENV.BASE_URL, {
      params: {
        keyword: query,
        apikey: ENV.TICKETMASTER_API_KEY,
        page: page,
        size: 20, 
        sort: 'date,asc',
        classificationName: "Music", // Filter for music events
        segmentName: "Music", // Further ensure we get music events
        includeFamily: "yes", // Exclude family events to focus on main tours

      },
    });
    console.log("responses", response.data._embedded?.events);
    return response.data._embedded?.events || [];
  } catch (error) {
    console.error("Error fetching concerts:", error);
    throw new Error("Failed to fetch concerts.");
  }
};
