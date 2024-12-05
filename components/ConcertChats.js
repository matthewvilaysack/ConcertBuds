import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import Theme from "../assets/theme";
import { useRouter } from "expo-router";
import supabase from "@/lib/supabase";
import timeAgo from "@/utils/timeAgo";
import Images from "../assets/Images"; // Updated import

const windowWidth = Dimensions.get("window").width;

const ConcertChats = ({ currentTab, uuid }) => {
  const [concerts, setConcerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Add debugging for props
  useEffect(() => {
    console.log("ConcertChats mounted with uuid:", uuid);
  }, []);

  const fetchConcerts = async () => {
    console.log("Starting fetchConcerts...");
    setIsLoading(true);
    try {
      console.log("Current UUID:", uuid);

      if (!uuid) {
        console.log("No UUID provided, skipping fetch");
        setIsLoading(false);
        return;
      }

      // Get user concerts with join_chat = true
      const { data: joinedConcerts, error: joinedError } = await supabase
        .from("user_concerts")
        .select(
          `
          concert_id,
          concert_name,
          location,
          address,
          concert_date,
          join_chat
        `
        )
        .eq("user_id", uuid)
        .eq("join_chat", true);

      console.log("Joined concerts:", joinedConcerts);

      if (joinedError) {
        console.error("Error fetching joined concerts:", joinedError);
        return;
      }

      // Get chat room data for these concerts
      const concertIds = joinedConcerts?.map((c) => c.concert_id) || [];
      console.log("Concert IDs to fetch:", concertIds);

      const { data: chatRooms, error: chatRoomsError } = await supabase
        .from("chat_rooms")
        .select("concert_id, num_users")
        .in("concert_id", concertIds);

      console.log("Chat rooms data:", chatRooms);

      if (chatRoomsError) {
        console.error("Error fetching chat rooms:", chatRoomsError);
        return;
      }

      // Get latest message for each concert
      const { data: latestMessages, error: messagesError } = await supabase
        .from("messages")
        .select("concert_id, created_at")
        .in("concert_id", concertIds)
        .order("created_at", { ascending: false });

      console.log("Latest messages:", latestMessages);

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return;
      }

      // Combine all data
      const formattedConcerts = joinedConcerts.map((concert) => {
        const eventDate = concert.concert_date
          ? new Date(concert.concert_date + "T00:00:00")
          : new Date();

        const chatRoom = chatRooms?.find(
          (room) => room.concert_id === concert.concert_id
        );
        const lastMessage = latestMessages?.find(
          (msg) => msg.concert_id === concert.concert_id
        );

        console.log(`Formatting concert ${concert.concert_id}:`, {
          chatRoom,
          lastMessage,
          eventDate,
        });
        console.log("CHATROOM", chatRoom);
        return {
          ...concert,
          month: eventDate.toLocaleString("en-US", { month: "short" }),
          day: eventDate.getDate(),
          num_users: chatRoom?.num_users || 0,
          last_message_time: lastMessage?.created_at
            ? timeAgo(lastMessage.created_at)
            : "No messages yet",
        };
      });

      // Sort concerts by date in ascending order
      formattedConcerts.sort(
        (a, b) => new Date(a.concert_date) - new Date(b.concert_date)
      );

      console.log("Final formatted concerts:", formattedConcerts);
      setConcerts(formattedConcerts);
    } catch (error) {
      console.error("Error in fetchConcerts:", error);
    }
    setIsLoading(false);
  };

  // Add useEffect to trigger fetchConcerts when uuid changes
  useEffect(() => {
    if (uuid) {
      console.log("UUID changed, fetching concerts...");
      fetchConcerts();
    }
  }, [uuid]);
  const handleNavigate = (concert) => {
    router.push({
      pathname: "/tabs/chat/details",
      params: {
        concert_id: concert.concert_id,
        concert_name: concert.concert_name,
        concert_location: concert.location,
        address: concert.address,
        concert_date: concert.concert_date,
        num_users: concert.num_users,
      },
    });
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Theme.colors.text.primary} />
      </View>
    );
  }
  console.log("CONCERTS", concerts);
  return (
    <View style={styles.container}>
      {concerts.map((concert, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleNavigate(concert)}
          accessible={true}
          accessibilityLabel={`${concert.concert_name} in ${concert.location}, ${concert.num_users} members, Last message ${concert.last_message_time}`}
        >
          <View style={styles.artistContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>{concert.month}</Text>
              <Text style={styles.day}>{concert.day}</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text
                style={styles.concertNameText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {concert.concert_name}
              </Text>
              <View style={styles.lastMessageContainer}>
                <Text
                  style={styles.locationText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {concert.location}
                </Text>
                <Text style={styles.lastMessageTime}>
                  {concert.last_message_time}
                </Text>
              </View>
              <View style={styles.memberContainer}>
                <Image
                  source={Images.members_icon}
                  style={styles.memberIcon}
                  accessibilityElementsHidden={true}
                />
                <Text style={styles.memberCount}>
                  {concert.num_users.toLocaleString()}{" "}
                  {concert.num_users === 1 ? "member" : "members"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  artistContainer: {
    width: windowWidth * 0.9,
    height: 90,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  dateContainer: {
    width: 75,
    height: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  month: {
    fontSize: 16,
    fontFamily: "Doppio One",
    color: "#000000",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  day: {
    fontSize: 32,
    fontFamily: "Doppio One",
    color: "#000000",
    fontWeight: "500",
  },
  contentContainer: {
    minWidth: "40%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    height: "100%",
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  concertNameText: {
    fontSize: 18,
    fontFamily: "Doppio One",
    color: "#000000",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Doppio One",
    color: "#000000",
    marginBottom: 6,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberCount: {
    fontSize: 13,
    fontFamily: "Doppio One",
    color: "#000000",
    marginLeft: 4,
  },
  memberIcon: {
    width: 14,
    height: 14,
    tintColor: "#000000",
  },
  lastMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lastMessageTime: {
    fontSize: 13,
    fontFamily: "Doppio One",
    color: "#000000",
    marginRight: 16,
    flexWrap: "wrap",
  },
});

export default ConcertChats;
