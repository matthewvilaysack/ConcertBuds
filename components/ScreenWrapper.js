import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, bg }) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top ? top + 5 : 30; // Add padding depending on safe area insets

  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg }}>
      {children}
    </View>
  );
};

export default ScreenWrapper;
