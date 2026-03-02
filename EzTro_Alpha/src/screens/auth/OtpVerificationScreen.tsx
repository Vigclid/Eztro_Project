import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Shield } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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
import {
  AuthStackParamList,
  NavigationProp,
} from "../../navigation/navigation.type";

export const OtpVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProp<AuthStackParamList, "otpVerification">>();
  const { email, tempToken } = route.params || {
    email: "người dùng",
    tempToken: "",
  }; // Fallback nếu không có params

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60); // Bộ đếm ngược 60s
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; // Sử dụng ReturnType để TS tự suy luận
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // --- Logic Handlers ---
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOtpChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputRefs.current[index - 1]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericText.slice(-1);
    setOtp(newOtp);

    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPress = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã xác thực gồm 6 chữ số");
      return;
    }

    if (otpCode === tempToken) {
      navigation.navigate("auth", {
        screen: "createNewPassword",
        params: { email },
      });
    } else {
      Alert.alert("Lỗi", "Mã xác thực không hợp lệ");
    }
  };

  const handleResendPress = () => {
    if (isResendDisabled) return;

    // Reset logic
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setIsResendDisabled(true);

    // TODO: Gọi hàm API gửi lại mã ở đây (ví dụ: sendMail(email))
    Alert.alert("Thông báo", `Đã gửi lại mã mới đến ${email}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#ecfdf5", "#ffffff", "#f0fdfa"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.blob} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              <View style={styles.iconBoxWrapper}>
                <LinearGradient
                  colors={["#d1fae5", "#ccfbf1"]}
                  style={styles.iconBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Shield size={40} color="#059669" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Nhập mã xác thực</Text>
              {/* Hiển thị email động */}
              <Text style={styles.subtitle}>
                Chúng tôi đã gửi mã 6 số đến email:{"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[styles.otpBox, value ? styles.otpBoxFilled : null]}
                    value={value}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    selectionColor="#10b981"
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.verifyBtnShadow}
                onPress={handleVerifyPress}
              >
                <LinearGradient
                  colors={["#10b981", "#0d9488"]}
                  style={styles.verifyBtn}
                >
                  <Text style={styles.verifyBtnText}>Xác thực</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Không nhận được mã? </Text>
              <TouchableOpacity
                onPress={handleResendPress}
                disabled={isResendDisabled}
              >
                <Text
                  style={[
                    styles.linkText,
                    isResendDisabled && styles.disabledText,
                  ]}
                >
                  {isResendDisabled ? `Gửi lại sau ${timer}s` : "Gửi lại ngay"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  background: { ...StyleSheet.absoluteFillObject },
  blob: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(167, 243, 208, 0.2)",
    transform: [{ scale: 1.2 }],
  },
  safeArea: { flex: 1, marginTop: Platform.OS === "android" ? 30 : 0 },
  keyboardView: { flex: 1 },
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
    elevation: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  contentContainer: { flex: 1 },
  iconBoxWrapper: { marginBottom: 24 },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#4b5563", marginBottom: 40 },
  emailHighlight: { color: "#111827", fontWeight: "bold" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  otpBox: {
    width: 45,
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  otpBoxFilled: { borderColor: "#10b981" },
  verifyBtnShadow: { shadowColor: "#10b981", elevation: 8 },
  verifyBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  footerText: { color: "#4b5563", fontSize: 14 },
  linkText: { color: "#059669", fontWeight: "bold", fontSize: 14 },
  disabledText: { color: "#9ca3af" },
});

export default OtpVerificationScreen;
