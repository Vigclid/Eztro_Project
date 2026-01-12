import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from "../constants/theme";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
}) => {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  const textStyle =
    variant === "primary" ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.BUTTON,
    paddingVertical: SPACING.MEDIUM,
    marginHorizontal: SPACING.LARGE,
  },
  primaryButton: {
    backgroundColor: COLORS.BLACK,
  },
  secondaryButton: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
  },
  text: {
    fontSize: FONT_SIZE.BUTTON,
    fontWeight: "bold",
  },
  primaryText: {
    color: COLORS.WHITE,
  },
  secondaryText: {
    color: COLORS.BLACK,
  },
});
