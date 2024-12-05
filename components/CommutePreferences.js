import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import supabase from "@/lib/supabase";
import {
  RSVPForConcert,
  unRSVPFromConcert,
  getUserConcerts,
  checkUserRSVPStatus,
} from "@/lib/concert-db"; // Update this import
import Theme from "../assets/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { placeholder } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";

const windowWidth = Dimensions.get("window").width;
const CommutePreferences = ({ item, onRSVPChange }) => {
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    id,
    name,
    artist,
    concertName,
    concertRawTime,
    date,
    dayOfWeek,
    concertTime,
    time,
    dateTime,
    address,
    location,
    city,
    state,
    venue,
    imageUrl,
    timezone,
  } = item || {};
  console.log("item in commutepreferences: ", item);


  // Format the date correctly
  const eventDate = date
    ? new Date(date + "T00:00:00") // Add time component to preserve local date
    : new Date();

  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();
  const [searchQuery, setSearchQuery] = useState(artist);
  const [chosenDate, setChosenDate] = useState(eventDate);
  const [modes, setModes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);

  // Use the passed dayOfWeek and concertTime or format from date if not provided
  const displayTime = concertTime || "Time TBD";

  useEffect(() => {
    const checkRSVPStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const hasRSVPed = await checkUserRSVPStatus(user.id, id);
          setIsRSVPed(hasRSVPed);
        }
      } catch (error) {
        console.error("Error checking RSVP status:", error);
      }
    };
    checkRSVPStatus();
  }, [id]);

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setChosenDate(selectedDate); // Ensure selectedDate is a valid Date object
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Bus", value: "bus" },
    { label: "Train", value: "train" },
    { label: "Subway", value: "subway" },
    { label: "Tram and light rail", value: "tram" },
  ]);

  const handleNavigate = () => {
    router.push({
      pathname: "/tabs/map/matching",
      params: item,
    });
  };

  return (
    <View style={styles.artistImageContainer}>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
          <View>
            <Text style={styles.artistName}>{time}</Text>
          </View>
        </View>

        <View style={styles.artistHeader}>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
          <View>
            <Text style={styles.artistName}>{address}</Text>
          </View>
        </View>
      </View>
      <View style={styles.goingContainer}>
        <TouchableOpacity style={styles.goingButton} onPress={handleNavigate}>
          <Text style={styles.goingText}>Find My Route</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.preferencesContainer}>
        <Text style={styles.searchName}>Start Location:</Text>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="459 Lagunita Dr, Stanford, CA 94305"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
        <Text style={styles.searchName}>Arrival Time:</Text>
        <View style={styles.searchInputContainer}>
          <View style={styles.timeInput}>
            <DateTimePicker
              value={chosenDate}
              mode="datetime"
              display="default"
              onChange={onDateChange}
            />
          </View>
        </View>
        <Text style={styles.searchName}>Transportation Modes:</Text>

        <View style={styles.modeInputContainer}>
          <DropDownPicker
            multiple={true}
            open={dropdownOpen}
            value={dropdownValue}
            items={dropdownItems}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            setItems={setDropdownItems}
            placeholder="Select items"
            mode="BADGE" // Shows selected items as badges
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={styles.dropdownText} // Customize font here
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artistImageContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
    position: "relative",
    width: windowWidth * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    marginBottom: 20,
    paddingBottom: 90,
  },
  artistContainer: {
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(255, 255, 255, .6)",
  },
  dateContainer: {
    marginTop: "5%",
    marginLeft: "5%",
    flexDirection: "column",
    alignItems: "center",
  },
  month: {
    fontFamily: "Doppio",
    fontSize: 20,
    color: "#000000",
  },
  day: {
    fontFamily: "Doppio",
    fontSize: 40,
    color: "#000000",
  },
  artistHeader: {
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "5%",
    paddingLeft: "5%",
    flex: 1,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 10,
  },
  variantRadius: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  location: {
    fontFamily: "Doppio",
    fontSize: 28,
    color: "#000000",
  },
  artistName: {
    fontFamily: "Doppio",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    marginTop: 5,
  },
  image: {
    width: windowWidth * 0.9,
    height: windowWidth * 0.7,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  preferencesContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 36,
  },
  goingContainer: {
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: "10%",
    paddingTop: 0,
    alignSelf: "stretch",
    paddingBottom: "8%",
    position: "absolute",
    top: 410,
    right: 0,
  },
  goingButton: {
    backgroundColor: "#846AE3",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginVertical: 20,
  },
  goingText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Doppio",
  },
  goingButtonRSVPed: {
    backgroundColor: "#a390e8",
  },
  goingButtonDisabled: {
    opacity: 0.5,
  },
  searchName: {
    fontFamily: "Doppio",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
  searchInputContainer: {
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 19,
    fontSize: 13,
    color: "#1A1A1A",
    height: "100%",
    fontFamily: "Doppio",
  },
  timeInput: {
    position: "absolute",
    left: 0,
    top: 7,
  },
  dateInputContainer: {
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  modeInputContainer: {
    // position: "absolute",
    // left: 36,
    // top: 250,
    height: 50,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  dropdown: {
    borderWidth: 0, // Removes the black border around the dropdown trigger
    backgroundColor: "white", // Optional: Adjust background color
  },
  dropdownList: {
    borderWidth: 0, // Removes the black border around the dropdown items
    backgroundColor: "white", // Optional: Adjust background color to match
  },
  dropdownText: {
    fontSize: 16, // Adjust font size
    fontFamily: "Doppio", // Use a specific font family (system font or custom)
  },
});

export default CommutePreferences;
