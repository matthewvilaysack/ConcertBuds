import React, { useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from "react-native";
import Theme from "@/assets/theme";
import Images from "@/assets/Images";
import { formatDate } from "../utils/getDate";

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

const ChatHeader = ({ concertName, address, location, date, numUsers }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { dayOfWeek, month, day } = formatDate(date);

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={styles.ConcertChatHeaderContainer}>
      <View style={styles.ConcertChatHeaderRow}>
        <Text numberOfLines={1} style={styles.ConcertName}>{concertName}</Text>
        <TouchableOpacity style={styles.infoIcon} onPress={toggleModal}>
          <Text style={styles.iconText}>i</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.ConcertDate}>{`${dayOfWeek}, ${month} ${day}`}</Text>
      <Text numberOfLines={2} style={styles.ConcertDate}>@ {address}, {location}</Text>
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
            <Text style={styles.modalText}>Info about this chat or artist</Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    fontSize: normalize(24),
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
    right: normalize(25),
    top: '25%',
    transform: [{ translateY: -normalize(9) }],
    padding: normalize(4),
  },

  iconText: {
    fontSize: normalize(18),
    color: Theme.colors.text.white,
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
    backgroundColor: "white",
    borderRadius: normalize(10),
    padding: normalize(20),
    alignItems: "center",
    maxWidth: 400, // Maximum width for larger screens
  },

  modalText: {
    fontSize: normalize(16),
    color: "#000",
    marginBottom: normalize(20),
    textAlign: "center",
  },

  closeButton: {
    backgroundColor: Theme.colors.primary,
    padding: normalize(10),
    borderRadius: normalize(5),
  },

  closeButtonText: {
    color: "#fff",
    fontSize: normalize(14),
  },
});

export default ChatHeader;