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
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/no0krzbp_expires_30_days.png";
const PASSWORD_ICON_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/rxn35f13_expires_30_days.png";

export const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [userId, onChangeUserId] = useState("");
  const [password, onChangePassword] = useState("");

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLoginPress = () => {
    // TODO: Implement login logic
    navigation.navigate("createBoardingHouse");
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate("forgotPassword");
  };

  const handleRegisterPress = () => {
    navigation.navigate("register");
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
          <Text style={styles.heading}>Chào Mừng!</Text>
        </View>

        <TextInput
          placeholder="Nhập ID của bạn"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={userId}
          onChangeText={onChangeUserId}
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Nhập mật khẩu"
            placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry
            style={styles.passwordInput}
          />
          <Image
            source={{ uri: PASSWORD_ICON_URI }}
            resizeMode="stretch"
            style={styles.passwordIcon}
          />
        </View>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={handleForgotPasswordPress}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <AppButton
          title="Đăng nhập"
          onPress={handleLoginPress}
          variant="primary"
          style={styles.loginButton}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.registerTextColor}> Register Now</Text>
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
    marginLeft: SPACING.HEADING_MARGIN_LEFT,
  },
  heading: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.HEADING,
    fontWeight: "bold",
  },
  input: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginBottom: SPACING.MEDIUM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    padding: SPACING.INPUT_PADDING,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.PASSWORD_CONTAINER_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    paddingRight: SPACING.PASSWORD_INPUT_PADDING_RIGHT,
    marginBottom: SPACING.MEDIUM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
  },
  passwordInput: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginRight: SPACING.ICON_MARGIN_RIGHT,
    flex: 1,
    paddingVertical: SPACING.INPUT_PADDING,
    paddingLeft: SPACING.PASSWORD_INPUT_PADDING_LEFT,
  },
  passwordIcon: {
    width: IMAGE_SIZE.PASSWORD_ICON_WIDTH,
    height: IMAGE_SIZE.PASSWORD_ICON_HEIGHT,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: SPACING.EXTRA_EXTRA_LARGE,
  },
  forgotPasswordText: {
    color: COLORS.SECONDARY_TEXT,
    fontSize: FONT_SIZE.LINK,
    marginRight: SPACING.FORGOT_PASSWORD_MARGIN_RIGHT,
  },
  loginButton: {
    marginBottom: SPACING.LOGIN_BUTTON_BOTTOM_MARGIN,
  },
  registerText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.BUTTON,
  },
  registerTextColor: {
    color: COLORS.HIGHLIGHT_TEXT,
    fontSize: FONT_SIZE.BUTTON,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.EXTRA_LARGE,
  },
});

export default LoginScreen;
