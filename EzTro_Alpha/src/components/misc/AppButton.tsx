import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
} from "../../constants/theme";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "gradient";
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  leftIcon,
}) => {
  if (variant === "gradient") {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
          style={[styles.button, styles.gradientButton]}
        >
          {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
          <Text style={[styles.text, styles.gradientText]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

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
      {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
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
    paddingHorizontal: SPACING.SMALL,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondaryButton: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  gradientButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
  },
  text: {
    fontSize: FONT_SIZE.BUTTON,
    fontWeight: "bold",
  },
  primaryText: {
    color: COLORS.WHITE,
  },
  secondaryText: {
    color: COLORS.PRIMARY,
  },
  gradientText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    fontWeight: "bold",
  },
  iconWrapper: {
    marginRight: SPACING.ICON_MARGIN_RIGHT,
  },
});
