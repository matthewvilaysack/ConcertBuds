import React from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CommuteChats from './CommuteChats';
import ConcertChats from './ConcertChats';
import Theme from '@/assets/theme';
import Images from '@/assets/Images';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.background} />
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <View style={styles.chatSection}>
          <Text style={styles.chatTitle}>Commute Chats</Text>
          <CommuteChats />
        </View>
        <View style={styles.chatSection}>
          <Text style={styles.chatTitle}>Concert Chats</Text>
          <ConcertChats />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    position: "absolute",
    top: "11%",
    alignItems: "center",
    width: "100%",
    height: "78%", // Adjust height to squish vertically
    padding: 20,
  },
  chatSection: {
    flex: 1,
    width: '90%', // Adjust width to fit within the screen
    backgroundColor: 'transparent', // Make background transparent
    borderColor: '#FFFFFF', // Add a white border
    borderWidth: 1,
    borderRadius: 20,
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: {
    fontFamily: 'Doppio One',
    fontSize: 38,
    color: '#FFFFFF',
    marginBottom: 20,
  },
});

export default ChatScreen;