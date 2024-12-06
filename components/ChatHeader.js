import React, { useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from "react-native";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import { formatDate } from "../utils/getDate";
import { useRouter } from 'expo-router';
import {leaveChatRoom} from "@/lib/concert-db";
import useSession from '../utils/useSession';
// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scale factor based on screen width
const scale = SCREEN_WIDTH / 375; // 375 is baseline width (iPhone X)

// Function to make fonts responsive
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize);
};
const ChatHeader = ({ user_id, artistName, concertName, address, location, date, numUsers, concertId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { dayOfWeek, month, day } = formatDate(date);
  const router = useRouter();
  const session = useSession();

  console.log("ARTIST NAME", artistName)

  const toggleModal = () => setModalVisible(!modalVisible);
  console.log("ARTIST NAME", artistName)
  const handleLeave = () => {
    leaveChatRoom(user_id, concertId);
    toggleModal();
    router.push(`/tabs/chat`);
  };

  return (
    <View style={styles.ConcertChatHeaderContainer}>
      <View style={styles.ConcertChatHeaderRow}>
      <Text numberOfLines={1} style={styles.ConcertName}>{artistName.toUpperCase()}</Text>
      <TouchableOpacity style={styles.infoIcon} onPress={toggleModal}>
          <Image 
            source={Images.info_icon}
            style={styles.infoIconImage}
            resizeMode="contain"
          />
      </TouchableOpacity>
      </View>
      <Text style={styles.ConcertDate}>{`${dayOfWeek}, ${month} ${day}`}</Text>
      <Text numberOfLines={2} style={styles.ConcertDate}>@ {address}, {location} </Text>
      {numUsers !== undefined && (
        <View style={styles.userCountContainer}>
          <Image 
            source={Images.active_status} 
            style={styles.activeStatusIcon} 
            resizeMode="contain"
          />
          <Text style={styles.ConcertUserCount}>{`${numUsers} active users`}</Text>
        </View>
      )}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to leave the chat?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleLeave}>
                <Text style={styles.closeButtonText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ConcertChatHeaderContainer: {
    padding: normalize(8),
    borderBottomWidth: Theme.colors.backgroundPrimary,
    paddingTop: normalize(0),
    width: '100%',
  },

  ConcertChatHeaderRow: {
    position: 'relative',
    width: '100%',
    alignItems: "center",
    marginBottom: normalize(8),
    paddingHorizontal: normalize(24), // Add padding for info icon
  },

  ConcertName: {
    fontSize: normalize(30),
    fontWeight: "bold",
    color: Theme.colors.text.white,
    width: '100%',
    textAlign: "center",
    marginBottom: normalize(4),
  },

  ConcertDate: {
    fontSize: normalize(16),
    color: Theme.colors.text.white,
    textAlign: "center",
    marginBottom: normalize(6),
    paddingHorizontal: normalize(16),
  },

  userCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  infoIcon: {
    position: 'absolute',
    right: normalize(20),
    top: "10%",
    transform: [{ translateY: -normalize(9) }],
    padding: normalize(4),
  },

  infoIconImage: {
    width: normalize(36),
    height: normalize(36),
    tintColor: Theme.colors.text.white,
  },
  activeStatusIcon: {
    width: normalize(12),
    height: normalize(12),
    marginRight: normalize(5),
  },
  
  ConcertUserCount: {
    fontSize: normalize(16),
    color: Theme.colors.text.white,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: SCREEN_WIDTH * 0.8,
    fontFamily: Theme.typography.fontFamilies.primary,
    backgroundColor: Theme.colors.text.white,
    borderRadius: normalize(10),
    padding: normalize(20),
    alignItems: "center",
    maxWidth: 400, // Maximum width for larger screens
  },

  modalText: {
    fontFamily: Theme.typography.fontFamilies.primary,
    fontSize: normalize(16),
    color: "#000",
    marginBottom: normalize(20),
    textAlign: "center",
  },

  closeButton: {
    backgroundColor: Theme.colors.background.primary,
    padding: normalize(10),
    borderRadius: normalize(5),
  },

  closeButtonText: {
    color:  Theme.colors.text.white,
    fontSize: normalize(14),
    fontFamily: Theme.typography.fontFamilies.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: normalize(20),
  },
});

export default ChatHeader;