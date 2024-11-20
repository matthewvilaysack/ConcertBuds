import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import theme from "../assets/theme";

const HeaderButton = ({ title, onPress, disabled, colors }) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : null} // Disable the button
      style={styles.button}
    >
      <Text
        style={[
          styles.text,
          {
            color: disabled ? colors[1] : colors[0],
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    padding: 5,
  },
  text: {
    // color: theme.colors.textPrimary, // Default iOS-style blue
    fontSize: 16,
  },
});

export default HeaderButton;
