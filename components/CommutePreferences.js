import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import supabase from "@/lib/supabase";
import {
  RSVPForConcert,
  getUserConcerts,
  checkUserRSVPStatus,
} from "@/lib/concert-db"; // Update this import
import Theme from "../assets/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ENV from "@/utils/env";
import "react-native-get-random-values";

const windowWidth = Dimensions.get("window").width;
const CommutePreferences = ({ item, onRSVPChange }) => {
  const GOOGLE_MAPS_API_KEY = ENV.MAPS_API_KEY; // Replace with your API key
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    id,
    name,
    artist,
    concertName,
    concertRawTime,
    dates,
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

  // // Format the date correctly
  const eventDate = dates.start.localDate
    ? new Date(dates.start.localDate + "T00:00:00") // Add time component to preserve local date
    : new Date();

  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();
  const [startLocation, setStartLocation] = useState(artist);
  const [chosenDate, setChosenDate] = useState(eventDate);
  const [suggestions, setSuggestions] = useState([]);
  const [modes, setModes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
      params: { address, startLocation, chosenDate, location },
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
          <Text style={styles.artistName}>{time}</Text>
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
        <View
          style={[
            styles.startContainer,
            dropdownVisible && styles.expandedContainer,
          ]}
        >
          <GooglePlacesAutocomplete
            placeholder="Search for a location"
            onPress={(data, details = null) => {
              setStartLocation(data.description);
              console.log("Selected location:", data, details);
              setDropdownVisible(false); // Hide dropdown after selection
            }}
            onChangeText={(text) => {
              console.log("Selected location:", text);
              setIsTyping(text.length > 0); // Show dropdown only when user types
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en", // Language of the results
            }}
            fetchDetails // Fetch additional details for the location
            onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
            onBlur={() => setDropdownVisible(false)} // Hide dropdown on blur
            styles={{
              textInput: styles.searchInput,
              listView: styles.listView,
            }}
            debounce={200} // Debounce for API calls
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
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: "10%",
    paddingTop: 0,
    alignSelf: "stretch",
    paddingBottom: "8%",
    position: "absolute",
    bottom: 0,
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
    marginBottom: 40,
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
  listViewVisible: {
    position: "absolute",
    top: 60, // Adjust as needed to match the height of the text input
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it overlays other components
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  listViewHidden: {
    display: "none",
  },
  expandedContainer: {
    flex: 2,
  },
  startContainer: {
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
});

export default CommutePreferences;
