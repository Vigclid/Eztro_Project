import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useState } from "react";
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
  AuthNavigationProp,
  AuthStackParamList,
} from "../../navigation/navigation.type";
import { getUserApi } from "../../api/user/user";
import { ApiResponse } from "../../types/app.common";
export const CreateNewPasswordScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, "createNewPassword">>();
  const email = route.params?.email || "";

  // State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = getUserApi;

  // Logic Handlers
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleResetPasswordPress = async () => {
    setError("");

    // Logic from Figma Code
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    if (!email) {
      setError("Thiếu email để đặt lại mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const response = (await resetPassword(
        email,
        newPassword,
      )) as ApiResponse<null>;
      if (response?.status === "success") {
        Alert.alert("Thành công", "Đặt lại mật khẩu thành công");
        navigation.navigate("changePasswordSuccessful");
      } else {
        setError(response?.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi hệ thống khi đặt lại mật khẩu");
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
            {/* Main Content */}
            <View style={styles.contentContainer}>
              {/* Lock Icon Box */}
              <View style={styles.iconBoxWrapper}>
                <LinearGradient
                  colors={["#d1fae5", "#ccfbf1"]} // emerald-100 -> teal-100
                  style={styles.iconBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Lock size={40} color="#059669" />
                </LinearGradient>
              </View>

              {/* Title & Description */}
              <Text style={styles.title}>Tạo mật khẩu mới</Text>
              <Text style={styles.subtitle}>
                Mật khẩu mới phải khác với mật khẩu cũ
              </Text>

              {/* Input 1: New Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mật khẩu mới</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.iconContainer}>
                    <Lock size={20} color="#9ca3af" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setError("");
                    }}
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Input 2: Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.iconContainer}>
                    <Lock size={20} color="#9ca3af" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError("");
                    }}
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
              </View>

              {/* Error Message Box */}
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtnShadow}
                onPress={handleResetPasswordPress}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10b981", "#0d9488"]} // emerald-500 -> teal-600
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>
                    {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                  </Text>
                </LinearGradient>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
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

  /* Input Styles */
  inputContainer: {
    marginBottom: 16, // Reduced margin between inputs
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

  /* Error Box */
  errorBox: {
    backgroundColor: "#fef2f2", // red-50
    borderColor: "#fecaca", // red-200
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626", // red-600
    fontSize: 14,
    fontWeight: "500",
  },

  /* Submit Button */
  submitBtnShadow: {
    marginTop: 8,
    shadowColor: "#10b981", // emerald-500
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateNewPasswordScreen;
