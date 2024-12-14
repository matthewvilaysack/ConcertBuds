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
    backgroundColor: Theme.colors.primary.main, // Use primary main color from theme
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: Theme.colors.secondary.pink, // Use secondary pink color from theme
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: Theme.colors.ui.buttonDanger, // Use button danger color from theme
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Theme.colors.ui.inputBackground, // Use input background color from theme
  },
  buttonText: {
    color: Theme.colors.text.white, // Use white text color from theme
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Arial",
  },
  disabledText: {
    color: Theme.colors.text.medium, // Use medium text color from theme
  },
});

export default Button;
