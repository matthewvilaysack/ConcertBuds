import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "@/lib/supabase";
import { unRSVPFromConcert } from "@/lib/concert-db";

const windowWidth = Dimensions.get("window").width;

const ConcertItem = ({ item, destination, hasRSVPed = false, onRSVPChange }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!item) return null;

  const { name, dates, _embedded, id, formattedData } = item || {};
  const venue = _embedded?.venues?.[0];
  const city = venue?.city?.name || "San Jose";
  const state = venue?.state?.stateCode;
  const artist = formattedData?.artist;

  const eventDate = dates?.start?.localDate
    ? new Date(dates.start.localDate + 'T00:00:00')
    : new Date();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();
  const locationText = city && state ? `${city}, ${state}` : `${city}`;

  const handleNavigate = () => {
    router.push({
      pathname: destination,
      params: getParams(item),
    });
  };

  const getParams = (item) => ({
    ...getBasicDetails(item),
    ...getDateTimeDetails(item),
    ...getLocationDetails(item),
    ...getAdditionalDetails(item),
  });

  const getBasicDetails = (item) => ({
    id: item.id,
    name: item.name,
    artist: formattedData?.artist,
    concertName: formattedData?.concertName,
  });

  const getDateTimeDetails = (item) => ({
    date: item.dates?.start?.localDate,
    time: formattedData?.time,
    dayOfWeek: formattedData?.dayOfWeek,
    concertTime: formattedData?.concertTime,
    dateTime: item.dates?.start?.dateTime,
  });

  const getLocationDetails = (item) => {
    const venue = item._embedded?.venues?.[0];
    return {
      location: formattedData?.location,
      city: venue?.city?.name,
      state: venue?.state?.stateCode,
      venue: venue?.name,
    };
  };

  const getAdditionalDetails = (item) => ({
    imageUrl: formattedData?.imageUrl,
    timezone: formattedData?.timezone,
    address: item._embedded?.venues?.[0]?.address?.line1,
  });

  const handleUnRSVP = async (e) => {
    e.stopPropagation(); // Prevent navigation
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Please sign in first");
        return;
      }
      await unRSVPFromConcert(user.id, id);
      if (onRSVPChange) {
        onRSVPChange(id, false); // Notify parent about RSVP change
      }
      Alert.alert("Success", "You've removed your RSVP");
    } catch (error) {
      console.error("Error removing RSVP:", error);
      Alert.alert("Error", "Failed to remove RSVP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.artistContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
        </View>
        <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.location}>{locationText}</Text>
          <View style={styles.actionsContainer}>
            {hasRSVPed ? (
              <>
                <View style={styles.goingButton}>
                  <Text style={styles.goingText}>Going</Text>
                </View>
                <TouchableOpacity
                  onPress={handleUnRSVP}
                  disabled={loading}
                  style={styles.trashContainer}
                >
                  <Image
                    source={require('@/assets/Images/trash.png')}
                    style={styles.trashIcon}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.notGoingButton}>
                <Text style={styles.notGoingText}>Not Going</Text>
              </View>
            )}
          </View>
        </View>
          <Text style={styles.artistName}>{name || "Event Name TBD"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  artistContainer: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    width: 65,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  month: {
    fontSize: 16,
    fontFamily: 'Doppio',
    color: '#333333',
    marginBottom: 2,
  },
  day: {
    fontSize: 24,
    fontFamily: 'Doppio',
    color: '#333333',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 18,
    fontFamily: 'Doppio',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  artistName: {
    fontSize: 14,
    fontFamily: 'Doppio',
    color: '#666666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goingButton: {
    backgroundColor: '#846AE3',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  goingText: {
    color: '#FFFFFF',
    fontFamily: 'Doppio',
    fontSize: 14,
  },
  trashContainer: {
    padding: 6,
  },
  trashIcon: {
    width: 16,
    height: 16,
    tintColor: '#666666',
    resizeMode: 'contain',
  }
});
export default ConcertItem;

