import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Shield } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Types
import { AuthNavigationProp } from "../../navigation/navigation.type";

export const OtpVerificationScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  
  // --- Logic State (Preserved) ---
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // --- Logic Handlers (Preserved) ---
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
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP");
        return;
    }
    navigation.navigate("createNewPassword");
  };

  const handleResendPress = () => {
    // TODO: Implement resend logic
    setOtp(["", "", "", "", "", ""]);
    Alert.alert("Thông báo", "Đã gửi lại mã xác thực!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={["#ecfdf5", "#ffffff", "#f0fdfa"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Decorative Blob */}
      <View style={styles.blob} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Header Back Button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Content */}
            <View style={styles.contentContainer}>
              
              {/* Shield Icon Box */}
              <View style={styles.iconBoxWrapper}>
                <LinearGradient
                   colors={["#d1fae5", "#ccfbf1"]} // emerald-100 -> teal-100
                   style={styles.iconBox}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                >
                  <Shield size={40} color="#059669" /> 
                </LinearGradient>
              </View>

              {/* Title & Description */}
              <Text style={styles.title}>Nhập mã xác thực</Text>
              <Text style={styles.subtitle}>
                Chúng tôi đã gửi mã 6 số đến email của bạn
              </Text>

              {/* OTP Input Container */}
              <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                        styles.otpBox,
                        value ? styles.otpBoxFilled : null // Optional: Style change when filled
                    ]}
                    value={value}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    selectionColor="#10b981" // emerald-500
                    cursorColor="#10b981"
                  />
                ))}
              </View>

              {/* Verify Button */}
              <TouchableOpacity 
                style={styles.verifyBtnShadow} 
                onPress={handleVerifyPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10b981", "#0d9488"]} // emerald-500 -> teal-600
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verifyBtn}
                >
                  <Text style={styles.verifyBtnText}>Xác thực</Text>
                </LinearGradient>
              </TouchableOpacity>

            </View>

            {/* Resend Code Link */}
            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Không nhận được mã? </Text>
              <TouchableOpacity onPress={handleResendPress}>
                <Text style={styles.linkText}>Gửi lại</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(167, 243, 208, 0.2)", // emerald-200/20
    transform: [{ scale: 1.2 }],
  },
  safeArea: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  
  /* Icon Box */
  iconBoxWrapper: {
    marginBottom: 24,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Text Styles */
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827", // gray-900
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563", // gray-600
    marginBottom: 40,
  },

  /* OTP Styles */
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Distribute evenly
    alignItems: "center",
    marginBottom: 32,
    gap: 8, // Fallback gap
  },
  otpBox: {
    flex: 1, // Take available width
    aspectRatio: 1, // Keep square shape
    maxWidth: 50, // Limit size on large screens
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 12, // rounded-2xl look (approx)
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827", // gray-900
    textAlign: "center",
    padding: 0, // Reset default padding
  },
  otpBoxFilled: {
    borderColor: "#10b981", // emerald-500 (Visual feedback when typed)
  },

  /* Verify Button */
  verifyBtnShadow: {
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  verifyBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* Footer Link */
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    color: "#4b5563", // gray-600
    fontSize: 14,
  },
  linkText: {
    color: "#059669", // emerald-600
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default OtpVerificationScreen;