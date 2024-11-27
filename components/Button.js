import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  style = {},
}) => {
  // Define styles for the different variants
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton;
      case "danger":
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style, disabled && styles.disabledButton]} // Combine styles
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
    height: "100%",
    flex: "column",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#6C757D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dangerButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    color: "#000000",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Doppio",
  },
  disabledText: {
    color: "#B0B0B0",
  },
});

export default Button;
