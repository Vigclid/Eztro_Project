import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Types
import { AuthNavigationProp } from "../../navigation/navigation.type";

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  
  // State
  const [email, onChangeEmail] = useState("");
  const [error, setError] = useState("");

  // Logic Handlers (Preserved from your code)
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLoginPress = () => {
    navigation.navigate("login");
  };

  const handleSendCodePress = () => {
    setError("");

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Navigate to OTP verification logic
    navigation.navigate("otpVerification"); 
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
            {/* Main Content Area */}
            <View style={styles.contentContainer}>
              
              {/* Mail Icon Box */}
              <View style={styles.iconBoxWrapper}>
                <LinearGradient
                   colors={["#d1fae5", "#ccfbf1"]} // emerald-100 -> teal-100
                   style={styles.iconBox}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                >
                  <Mail size={40} color="#059669" /> 
                </LinearGradient>
              </View>

              {/* Title & Description */}
              <Text style={styles.title}>Quên mật khẩu?</Text>
              <Text style={styles.subtitle}>
                Nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu
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
                    onChangeText={(text) => {
                      onChangeEmail(text);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSendCodePress}
                  />
                </View>
              </View>

              {/* Error Message Box */}
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Send Code Button */}
              <TouchableOpacity 
                style={styles.sendBtnShadow} 
                onPress={handleSendCodePress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10b981", "#0d9488"]} // emerald-500 -> teal-600
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendBtn}
                >
                  <Text style={styles.sendBtnText}>Gửi mã xác thực</Text>
                </LinearGradient>
              </TouchableOpacity>

            </View>

            {/* Bottom Login Link (Pushed to bottom via flex) */}
            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Đã nhớ mật khẩu? </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={styles.linkText}>Quay lại đăng nhập</Text>
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
    justifyContent: 'space-between', // Push footer to bottom
  },
  contentContainer: {
    flex: 1,
  },
  
  /* Icon Box Styles */
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
    fontSize: 28, // ~text-3xl
    fontWeight: "bold",
    color: "#111827", // gray-900
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563", // gray-600
    marginBottom: 40,
    lineHeight: 24,
  },
  
  /* Input Styles */
  inputContainer: {
    marginBottom: 24,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111827",
    paddingHorizontal: 12,
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

  /* Send Button */
  sendBtnShadow: {
    shadowColor: "#10b981", // emerald-500
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  sendBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
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

export default ForgotPasswordScreen;