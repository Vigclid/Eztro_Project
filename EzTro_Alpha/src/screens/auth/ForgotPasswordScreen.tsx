import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppButton } from "../../components/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { AuthNavigationProp } from "../../navigation/navigation.type";

const BACK_BUTTON_ICON_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/ourkfwr3_expires_30_days.png";

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, onChangeEmail] = useState("");

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSendCodePress = () => {
    navigation.navigate("otpVerification");
  };

  const handleLoginPress = () => {
    navigation.navigate("login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: BACK_BUTTON_ICON_URI }}
            resizeMode="stretch"
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Forgot Password?</Text>
        </View>

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <AppButton
          title="Send Code"
          onPress={handleSendCodePress}
          variant="primary"
          style={styles.sendCodeButton}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Remember Password?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.loginTextColor}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    paddingTop: SPACING.EXTRA_EXTRA_LARGE,
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContent: {
    paddingTop: SPACING.EXTRA_EXTRA_LARGE,
    paddingBottom: SPACING.SCROLL_BOTTOM_PADDING,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.BACK_BUTTON,
    borderWidth: 1,
    paddingVertical: SPACING.MEDIUM_SMALL,
    paddingHorizontal: SPACING.SMALL,
    marginBottom: SPACING.SECTION_SPACING,
    marginLeft: SPACING.BACK_BUTTON_MARGIN_LEFT,
  },
  backButtonIcon: {
    width: IMAGE_SIZE.BACK_BUTTON_ICON_WIDTH,
    height: IMAGE_SIZE.BACK_BUTTON_ICON_HEIGHT,
  },
  headingContainer: {
    alignSelf: "flex-start",
    paddingBottom: SPACING.XS,
    marginBottom: SPACING.LARGE_SECTION_SPACING,
    marginLeft: SPACING.BACK_BUTTON_MARGIN_LEFT,
  },
  heading: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.HEADING,
    fontWeight: "bold",
  },
  input: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginBottom: SPACING.FORGOT_PASSWORD_INPUT_MARGIN_BOTTOM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    backgroundColor: COLORS.PASSWORD_CONTAINER_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    padding: SPACING.INPUT_PADDING,
  },
  sendCodeButton: {
    marginBottom: SPACING.FORGOT_PASSWORD_BUTTON_BOTTOM_MARGIN,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.EXTRA_LARGE,
  },
  loginText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.BUTTON,
  },
  loginTextColor: {
    color: COLORS.HIGHLIGHT_TEXT,
    fontSize: FONT_SIZE.BUTTON,
  },
});

export default ForgotPasswordScreen;
