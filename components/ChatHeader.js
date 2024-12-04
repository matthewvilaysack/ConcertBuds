import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Theme from "@/assets/theme";
import { formatDate } from "../utils/getDate";

const ChatHeader = ({ concertName, address, location, date, numUsers }) => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log("LOCATTTION", location);
  const { dayOfWeek, month, day } = formatDate(date);

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={styles.ConcertChatHeaderContainer}>
      <View style={styles.ConcertChatHeaderRow}>
        <Text style={styles.ConcertName}>{concertName}</Text>
        <TouchableOpacity style={styles.infoIcon} onPress={toggleModal}>
          <Text style={styles.iconText}>i</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.ConcertDate}>{`${dayOfWeek}, ${month} ${day}`} </Text>
      <Text style={styles.ConcertDate}>@ {address}, {location} </Text>
      {numUsers !== undefined && (
        <Text style={styles.ConcertUserCount}>{`${numUsers} people in this chat`}</Text>
      )}
      {/* Modal Popup for Info */}
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
    padding: 8, // Reduced from 16
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 4, // Added to create slight spacing
    paddingTop: 0
  },
  ConcertChatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoIcon: {
    paddingHorizontal: 8,
  },
  iconText: {
    fontSize: 18, // Increased from 16
    color: Theme.colors.text.white,
  },
  ConcertName: {
    fontSize: 24, // Increased from 18
    fontWeight: "bold",
    color: Theme.colors.text.white,
    flex: 1,
    textAlign: "center",
  },
  ConcertDate: {
    fontSize: 16, // Increased from 14
    color: Theme.colors.text.white,
    textAlign: "center",
    marginTop: 2, // Reduced from 4
  },
  ConcertUserCount: {
    fontSize: 16, // Increased from 14
    color: Theme.colors.text.white,
    textAlign: "center",
    marginTop: 2, // Reduced from 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: Theme.colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default ChatHeader;