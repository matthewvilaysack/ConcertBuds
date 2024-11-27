import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MOCK_ATTENDEES = [
  { id: 1, name: "Izzy", uri: "" },
  { id: 2, name: "Abby", uri: "" },
  { id: 3, name: "Natalia", uri: "" },
  { id: 4, name: "Diego", uri: "" },
  { id: 5, name: "Matt", uri: "" },
  {
    id: 6,
    name: "Sarah",
    uri: "https://adobe.design/stories/community/media_1c16716150c58f613fabac586a799f543bd967c70.jpeg?width=750&format=jpeg&optimize=medium",
  },
  { id: 7, name: "Eli", uri: "" },
  { id: 8, name: "Henry", uri: "" },
  { id: 9, name: "Grace", uri: "" },
  { id: 10, name: "Eli", uri: "" },
  { id: 11, name: "Henry", uri: "" },
  { id: 12, name: "Grace", uri: "" },
];

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const ConcertUsersGoing = () => {
  const groupedData = chunkArray(MOCK_ATTENDEES, 3);

  const renderItem = ({ item }) => (
    <View style={styles.attendeesRow}>
      {item.map((attendee) => (
        <View key={attendee.id} style={styles.attendeeContainer}>
          <Image
            style={styles.avatarCircle}
            source={
              attendee.uri
                ? { uri: attendee.uri, width: 65, height: 65 }
                : require("../assets/Images/profile-icon-1.png")
            }
          ></Image>
          <Text style={styles.attendeeName} numberOfLines={1}>
            {attendee.name}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.attendeesSection}>
      <View style={styles.attendeesHeader}>
        <Text style={styles.attendeesTitle}>
          {MOCK_ATTENDEES.length} ConcertBuds Going
        </Text>
      </View>
      <FlatList
        persistentScrollbar={true}
        data={groupedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  attendeesSection: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginVertical: 15,
    paddingBottom: 20,
  },
  attendeesHeader: {
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },

  attendeesRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 10,
  },
  attendeesTitle: {
    color: "#846AE3",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Doppio",
  },
  attendeeContainer: {
    alignItems: "center",
    margin: 2.5,
  },
  avatarCircle: {
    width: 65,
    height: 65,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  attendeeName: {
    color: "#846AE3",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Doppio",
  },
});

export default ConcertUsersGoing;
