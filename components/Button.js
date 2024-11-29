import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Theme from "@/assets/theme";
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
    backgroundColor: Theme.colors.primary, // Use primary color from theme
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: Theme.colors.secondary, // Use secondary color from theme
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: Theme.colors.danger, // Use danger color from theme
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Theme.colors.disabled, // Use disabled color from theme
  },
  buttonText: {
    color: Theme.colors.text.button, // Use button text color from theme
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Arial",
  },
  disabledText: {
    color: Theme.colors.text.disabled, // Use disabled text color from theme
  },
});

export default Button;
