import React from "react";
import {
  View,
  Text,
  StyleShee,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Theme from "../assets/theme";
import { useRouter } from "expo-router";

const windowWidth = Dimensions.get("window").width;

const ConcertChats = ({ concerts }) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push({
      pathname: "/tabs/chat/details",
    });
  };

  return (
    <View style={styles.container}>
      {concerts.map((concert, index) => (
        <TouchableOpacity key={index} onPress={() => handleNavigate(concert)}>
          <View style={styles.artistContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.month}>Dec</Text>
              <Text style={styles.day}>
                {new Date(concert.concert_date).getDate()}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.concertName}>
                  {concert.concert_name} • {concert.location}
                </Text>
              </View>
              <View style={styles.headerRow}>
                <Text style={styles.numGoing}>
                  {concert.num_going} people going
                </Text>
              </View>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.lastMessageTime}>
                {concert.last_message_time}
              </Text>
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
    paddingHorizontal: "4%",
    width: windowWidth,
  },
  artistContainer: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.background.primary,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    fontSize: 16,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    marginBottom: 2,
  },
  day: {
    fontSize: 24,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontSize: 18,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.secondary,
    flex: 1,
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goingButton: {
    backgroundColor: Theme.colors.primary.main,
    borderRadius: Theme.borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  goingText: {
    color: Theme.colors.text.white,
    fontFamily: Theme.typography.fontFamilies.primary,
    fontSize: 14,
  },
  artistName: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    marginTop: 4,
  },
  concertName: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.primary,
    marginTop: 4,
  },
  concertDate: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.secondary,
  },
  numGoing: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.secondary,
    marginTop: 4,
  },
  lastMessageTime: {
    fontSize: 12,
    fontFamily: Theme.typography.fontFamilies.primary,
    color: Theme.colors.text.tertiary,
    marginTop: 4,
  },
});

export default ConcertChats;
