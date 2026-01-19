import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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

import { getUserApi } from "../../api/user/user";
import { ApiResponse } from "../../types/app.common";

const BACK_BUTTON_ICON_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/cyxenem9_expires_30_days.png";

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [phoneNumber, onchangephoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneNumberSuccess, setphoneNumberSuccess] = useState("");
  const [phoneNumberError, setphoneNumberError] = useState("");
  const [checkValid, setCheckValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const { createUser } = getUserApi;

  useEffect(() => {
    setCheckValid(
      isEmailValid && isPasswordValid && isConfirmPasswordValid && isPhoneValid,
    );
  }, [isEmailValid, isPasswordValid, isConfirmPasswordValid, isPhoneValid]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRegisterPress = async () => {
    if (!checkValid) return;

    const user = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      createdAt: new Date(),
      statusActive: true,
      profilePicture:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/cyxenem9_expires_30_days.png",
      lastLogin: null,
    };
    try {
      const responseRegister = await createUser(user);
      if (responseRegister) {
        alert("Đăng ký thành công");
        navigation.navigate("login");
      } else {
        alert("Đăng ký thất bại");
      }
    } catch (error: any) {
      alert(error?.message || "Đăng ký thất bại");
    }
  };

  const renderPasswordMessage = () => {
    if (!password) return null;

    if (passwordError) {
      return <Text style={styles.error}>{passwordError}</Text>;
    }

    return <Text style={styles.message}>{passwordSuccess}</Text>;
  };

  const renderEmailMessage = () => {
    if (!email) return null;

    if (emailError) {
      return <Text style={styles.error}>{emailError}</Text>;
    }

    return <Text style={styles.message}>{emailSuccess}</Text>;
  };

  const renderConfirmPasswordMessage = () => {
    if (!confirmPassword) return null;

    if (confirmPasswordError) {
      return <Text style={styles.error}>{confirmPasswordError}</Text>;
    }

    return <Text style={styles.message}>{confirmPasswordSuccess}</Text>;
  };

  const renderphoneNumberMessage = () => {
    if (!phoneNumber) return null;

    if (phoneNumberError) {
      return <Text style={styles.error}>{phoneNumberError}</Text>;
    }

    return <Text style={styles.message}>{phoneNumberSuccess}</Text>;
  };
  const handleLoginPress = () => {
    navigation.navigate("login");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);

    if (!text) {
      setEmailError("");
      setEmailSuccess("");
      setIsEmailValid(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(text)) {
      setEmailSuccess("Email hợp lệ");
      setEmailError("");
      setIsEmailValid(true);
    } else {
      setEmailError("Email không đúng định dạng");
      setEmailSuccess("");
      setIsEmailValid(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    if (!text) {
      setPasswordError("");
      setPasswordSuccess("");
      setIsPasswordValid(false);
      return;
    }

    if (text.length >= 8) {
      setPasswordSuccess("Mật khẩu hợp lệ");
      setPasswordError("");
      setIsPasswordValid(true);
    } else {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự");
      setPasswordSuccess("");
      setIsPasswordValid(false);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    onChangeConfirmPassword(text);

    if (!text) {
      setConfirmPasswordError("");
      setConfirmPasswordSuccess("");
      setIsConfirmPasswordValid(false);
      return;
    }

    if (text === password && password.length >= 8) {
      setConfirmPasswordSuccess("Mật khẩu xác nhận hợp lệ");
      setConfirmPasswordError("");
      setIsConfirmPasswordValid(true);
    } else {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp");
      setConfirmPasswordSuccess("");
      setIsConfirmPasswordValid(false);
    }
  };

  const handlephoneNumberChange = (text: string) => {
    onchangephoneNumber(text);

    if (!text) {
      setphoneNumberError("");
      setphoneNumberSuccess("");
      setIsPhoneValid(false);
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;

    if (phoneRegex.test(text)) {
      setphoneNumberSuccess("Số điện thoại hợp lệ");
      setphoneNumberError("");
      setIsPhoneValid(true);
    } else {
      setphoneNumberError("Số điện thoại không đúng định dạng");
      setphoneNumberSuccess("");
      setIsPhoneValid(false);
    }
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
          <Text style={styles.heading}>Đăng ký</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ho"
            placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
            value={firstName}
            onChangeText={onChangeFirstName}
            autoCapitalize="none"
            style={styles.inputName}
          />

          <TextInput
            placeholder="Ten"
            placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
            value={lastName}
            onChangeText={onChangeLastName}
            autoCapitalize="none"
            style={styles.inputName}
          />
        </View>

        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {renderEmailMessage()}

        <TextInput
          placeholder="so dien thoai"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={phoneNumber}
          onChangeText={handlephoneNumberChange}
          style={styles.input}
        />
        {renderphoneNumberMessage()}

        <TextInput
          placeholder="mat khau"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={styles.passwordInput}
        />
        {renderPasswordMessage()}

        <TextInput
          placeholder="xac nhan mat khau"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          style={styles.confirmPasswordInput}
        />
        {renderConfirmPasswordMessage()}

        <AppButton
          title="dang ky"
          onPress={handleRegisterPress}
          variant="primary"
          style={styles.registerButton}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.loginTextColor}> Login Now</Text>
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
    marginLeft: SPACING.REGISTER_HEADING_MARGIN_LEFT,
  },
  heading: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.HEADING,
    fontWeight: "bold",
  },
  input: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginBottom: SPACING.INPUT_MARGIN_BOTTOM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    padding: SPACING.INPUT_PADDING,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.INPUT_MARGIN_BOTTOM,
  },
  inputName: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    padding: SPACING.INPUT_PADDING,
    width: 150,
  },
  passwordInput: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginBottom: SPACING.INPUT_MARGIN_BOTTOM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    backgroundColor: COLORS.PASSWORD_CONTAINER_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    padding: SPACING.INPUT_PADDING,
  },
  confirmPasswordInput: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginBottom: SPACING.INPUT_MARGIN_BOTTOM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    backgroundColor: COLORS.PASSWORD_CONTAINER_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    padding: SPACING.INPUT_PADDING,
  },
  registerButton: {
    marginBottom: SPACING.REGISTER_BUTTON_BOTTOM_MARGIN,
  },
  loginText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.BUTTON,
  },
  loginTextColor: {
    color: COLORS.HIGHLIGHT_TEXT,
    fontSize: FONT_SIZE.BUTTON,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.EXTRA_LARGE,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: SPACING.SMALL,
  },
  message: {
    color: COLORS.SUCCESS_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginLeft: 25,
    marginBottom: 10,
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: SPACING.SMALL,
  },
  error: {
    color: COLORS.ERROR_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginLeft: 25,
    marginBottom: 10,
  },
});

export default RegisterScreen;
