
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const chatItems = [
  { id: '1', title: 'Daily Commute', subtitle: 'Join the chat for daily commute discussions!' },
  { id: '2', title: 'Billie Eilish Concert', subtitle: 'Join the chat for the upcoming concert!' },
  // Add more chat items here
];

const ChatList = () => {
  const navigation = useNavigation();

  const handlePress = (item) => {
    navigation.navigate('ChatDetails', { chatTitle: item.title });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handlePress(item)}>
      <Text style={styles.chatTitle}>{item.title}</Text>
      <Text style={styles.chatSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ChatList;