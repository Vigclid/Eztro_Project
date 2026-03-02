import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useDispatch } from "react-redux";

// Navigation & Store types
import { loginAsync } from "../../features/auth/authSlice";
import {
  AuthNavigationProp,
  NavigationProp,
} from "../../navigation/navigation.type";
import { AppDispatch } from "../../stores/store";

// SET UP GOOGLE LOGIN
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

// --- Social Icons (Google & Facebook) ---
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

export const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const navigation_main = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "EzTro_Alpha",
  });
  // LOGIN WITH GOOGLE SETUP
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "332795377963-6q4u83qobjnorpo5dsjp7ic9nsadmlgr.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@vigclid/EzTro_Alpha",
    scopes: ["profile", "email"],
  });

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Navigation Handlers
  const handleBackPress = () => navigation.goBack();
  const handleRegisterPress = () => navigation.navigate("register");
  const handleForgotPasswordPress = () => navigation.navigate("forgotPassword");

  // Validation Handlers
  const validateEmail = (text: string) => {
    setEmail(text);
    setError("");

    if (text === "") {
      setEmailError("");
      setEmailSuccess("");
      setIsFormValid(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(text)) {
      setEmailSuccess("✓ Email hợp lệ");
      setEmailError("");
      // Check if password is also valid
      if (password.length >= 8) {
        setIsFormValid(true);
      }
    } else {
      setEmailError("✕ Email không đúng định dạng");
      setEmailSuccess("");
      setIsFormValid(false);
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setError("");

    if (text === "") {
      setPasswordError("");
      setPasswordSuccess("");
      setIsFormValid(false);
      return;
    }

    if (text.length >= 8) {
      setPasswordSuccess("✓ Mật khẩu hợp lệ");
      setPasswordError("");
      // Check if email is also valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setIsFormValid(true);
      }
    } else {
      setPasswordError("✕ Mật khẩu phải có ít nhất 8 ký tự");
      setPasswordSuccess("");
      setIsFormValid(false);
    }
  };

  // Logic Handler
  const handleLoginPress = async () => {
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!isFormValid) {
      setError("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);

    try {
      // Execute Redux Action
      const result = await dispatch(loginAsync({ email, password }));
      if (loginAsync.fulfilled.match(result)) {
        Alert.alert("Thành công", "Đăng nhập thành công");
        navigation_main.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "mainscreen",
                params: { screen: "viewBoardingHousePage" },
              },
            ],
          }),
        );
      } else {
        setError(
          typeof result.payload === "string"
            ? result.payload
            : "Email hoặc mật khẩu không đúng",
        );
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
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
            {/* Title Section */}
            <Text style={styles.title}>Chào mừng trở lại! 👋</Text>
            <Text style={styles.subtitle}>
              Đăng nhập để tiếp tục quản lý nhà trọ
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Mail size={20} color="#9ca3af" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={validateEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {/* Email Validation Message */}
              {email && (emailError || emailSuccess) && (
                <Text
                  style={
                    emailError
                      ? styles.validationError
                      : styles.validationSuccess
                  }
                >
                  {emailError || emailSuccess}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Lock size={20} color="#9ca3af" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={validatePassword}
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
              {/* Password Validation Message */}
              {password && (passwordError || passwordSuccess) && (
                <Text
                  style={
                    passwordError
                      ? styles.validationError
                      : styles.validationSuccess
                  }
                >
                  {passwordError || passwordSuccess}
                </Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPasswordPress}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message Box */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginBtnShadow}
              onPress={handleLoginPress}
              disabled={loading || !isFormValid}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#10b981", "#0d9488"]} // emerald-500 -> teal-600
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.loginBtn, loading && styles.disabledBtn]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Đăng nhập</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.7}
                onPress={() => promptAsync()}
              >
                <GoogleIcon />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                <FacebookIcon />
                <Text style={styles.socialBtnText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={handleRegisterPress}>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
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
    marginTop: Platform.OS === "android" ? 30 : 0,
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
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

  /* Input Styles */
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151", // gray-700
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 16,
    height: 56,
  },
  iconContainer: {
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111827",
    paddingHorizontal: 12,
  },
  eyeIcon: {
    padding: 16,
  },

  /* Validation Messages */
  validationError: {
    color: "#dc2626", // red-600
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  validationSuccess: {
    color: "#059669", // emerald-600
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },

  /* Forgot Password */
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#059669", // emerald-600
    fontWeight: "600",
    fontSize: 14,
  },

  /* Error Box */
  errorBox: {
    backgroundColor: "#fef2f2", // red-50
    borderColor: "#fecaca", // red-200
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626", // red-600
    fontSize: 14,
    fontWeight: "500",
  },

  /* Login Button */
  loginBtnShadow: {
    shadowColor: "#10b981", // emerald-500
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  loginBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* Divider */
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb", // gray-200
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280", // gray-500
  },

  /* Social Buttons */
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    height: 56,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151", // gray-700
  },

  /* Footer */
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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

export default LoginScreen;
