import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
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
import Svg, { Path } from "react-native-svg";
import { AuthNavigationProp } from "../../navigation/navigation.type";
import { getUserApi } from "../../api/user/user"; // Import từ file chức năng
import { ApiResponse } from "../../types/app.common";
import { IUser } from "../../types/users";

// --- Components for Social Icons ---
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

const FacebookIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </Svg>
);

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { createUser } = getUserApi;

  // --- States từ file UI ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- States Validation từ file Chức năng ---
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // --- Effect kiểm tra tổng quát form ---
  useEffect(() => {
    const isValid =
      email &&
      !emailError &&
      password &&
      !passwordError &&
      confirmPassword &&
      !confirmPasswordError &&
      phoneNumber &&
      !phoneNumberError &&
      firstName &&
      lastName;
    setIsFormValid(!!isValid);
  }, [
    email,
    emailError,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    phoneNumber,
    phoneNumberError,
    firstName,
    lastName,
  ]);

  // --- Handlers Validation Logic ---
  const handleEmailChange = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) setEmailError("");
    else if (!emailRegex.test(text))
      setEmailError("Email không đúng định dạng");
    else setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) setPasswordError("");
    else if (text.length < 8)
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự");
    else setPasswordError("");
  };

  const handleConfirmChange = (text: string) => {
    setConfirmPassword(text);
    if (!text) setConfirmPasswordError("");
    else if (text !== password) setConfirmPasswordError("Mật khẩu không khớp");
    else setConfirmPasswordError("");
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!text) setPhoneNumberError("");
    else if (!phoneRegex.test(text))
      setPhoneNumberError("SĐT phải từ 10-11 số");
    else setPhoneNumberError("");
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Thông báo", "Vui lòng kiểm tra lại thông tin đăng ký");
      console.log("Form is not valid");
      return;
    }

    setLoading(true);
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phoneNumber: phoneNumber.trim(),
      createdAt: new Date(),
      statusActive: true,
      profilePicture: "https://via.placeholder.com/150",
      lastLogin: null,
    };

    try {
      const response = (await createUser(userData)) as ApiResponse<IUser>;
      console.log("Register response:", response);
      if (response.status === "success") {
        Alert.alert("Thành công", "Đăng ký tài khoản thành công");
        navigation.navigate("login");
      } else {
        Alert.alert("Lỗi", response.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
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
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Tạo tài khoản mới 🚀</Text>
            <Text style={styles.subtitle}>
              Bắt đầu quản lý nhà trọ thông minh hơn
            </Text>

            <View style={styles.formContainer}>
              {/* Họ & Tên */}
              <View style={styles.rowContainer}>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.label}>Họ</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.iconContainer}>
                      <User size={18} color="#9ca3af" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Nguyễn"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.label}>Tên</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, { paddingLeft: 16 }]}
                      placeholder="Văn A"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    emailError ? styles.inputErrorBorder : null,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Mail size={18} color="#9ca3af" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Phone */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    phoneNumberError ? styles.inputErrorBorder : null,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Phone size={18} color="#9ca3af" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="0901234567"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                </View>
                {phoneNumberError ? (
                  <Text style={styles.errorText}>{phoneNumberError}</Text>
                ) : null}
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    passwordError ? styles.inputErrorBorder : null,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Lock size={18} color="#9ca3af" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    confirmPasswordError ? styles.inputErrorBorder : null,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Lock size={18} color="#9ca3af" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChangeText={handleConfirmChange}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerBtnShadow,
                  !isFormValid && { opacity: 0.5 },
                ]}
                onPress={handleRegister}
                disabled={loading || !isFormValid}
              >
                <LinearGradient
                  colors={["#10b981", "#0d9488"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerBtn}
                >
                  <Text style={styles.registerBtnText}>
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <GoogleIcon />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <FacebookIcon />
                  <Text style={styles.socialBtnText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerLink}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("login")}>
                  <Text style={styles.linkText}>Đăng nhập ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// --- Styles Tối ưu ---
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
  },
  safeArea: { flex: 1, marginTop: Platform.OS === "android" ? 30 : 0 },
  keyboardView: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, marginBottom: 20 },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowOpacity: 0.1,
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: "#4b5563", marginBottom: 25 },
  formContainer: { gap: 12 },
  rowContainer: { flexDirection: "row", gap: 10 },
  halfInputContainer: { flex: 1 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    height: 52,
  },
  inputErrorBorder: { borderColor: "#ef4444" },
  iconContainer: { paddingLeft: 14 },
  input: { flex: 1, fontSize: 15, color: "#111827", paddingHorizontal: 10 },
  eyeIcon: { padding: 12 },
  errorText: { color: "#ef4444", fontSize: 11, marginTop: 2, marginLeft: 4 },
  registerBtnShadow: { marginTop: 10, elevation: 4 },
  registerBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  registerBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { fontSize: 12, color: "#9ca3af" },
  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialBtnText: { fontSize: 14, fontWeight: "500" },
  footerLink: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#6b7280" },
  linkText: { color: "#059669", fontWeight: "bold" },
  inputContainer: { marginBottom: 12 },
});

export default RegisterScreen;
