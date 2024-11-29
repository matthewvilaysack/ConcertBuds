
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommuteChats = () => {
  return (
    <View style={styles.container}>
      <Text>Commute Chats</Text>
      {/* Add your commute chat UI components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommuteChats;