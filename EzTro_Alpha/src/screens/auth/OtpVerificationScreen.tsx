import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
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
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/9wlpm91n_expires_30_days.png";

export const OtpVerificationScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText === "") {
      // If empty (deleted), clear the box and focus previous
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericText.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // If backspace is pressed on an empty box, focus previous
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPress = () => {
    navigation.navigate("createNewPassword");
  };

  const handleResendPress = () => {
    // TODO: Implement resend logic
    alert("Resend code!");
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
          <Text style={styles.heading}>OTP Verification</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.otpBox}
              value={value}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <AppButton
          title="Verify"
          onPress={handleVerifyPress}
          variant="primary"
          style={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't received code?</Text>
          <TouchableOpacity onPress={handleResendPress}>
            <Text style={styles.resendTextColor}> Resend</Text>
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
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContent: {
    paddingTop: SPACING.OTP_SCREEN_TOP_PADDING,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.OTP_IMAGE_MARGIN_BOTTOM,
    marginHorizontal: SPACING.CONTENT_MARGIN_HORIZONTAL,
    gap: SPACING.OTP_BOX_MARGIN,
  },
  otpBox: {
    width: IMAGE_SIZE.OTP_BOX_SIZE,
    height: IMAGE_SIZE.OTP_BOX_SIZE,
    backgroundColor: COLORS.PASSWORD_CONTAINER_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.OTP_BOX,
    borderWidth: 1,
    fontSize: FONT_SIZE.HEADING,
    fontWeight: "bold",
    padding: 5,
    color: COLORS.BLACK,
    textAlign: "center",
  },
  verifyButton: {
    marginBottom: SPACING.FORGOT_PASSWORD_BUTTON_BOTTOM_MARGIN,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.EXTRA_LARGE,
  },
  resendText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.BUTTON,
  },
  resendTextColor: {
    color: COLORS.HIGHLIGHT_TEXT,
    fontSize: FONT_SIZE.BUTTON,
  },
});

export default OtpVerificationScreen;
