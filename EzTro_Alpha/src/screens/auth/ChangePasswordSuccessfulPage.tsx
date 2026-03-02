import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2 } from "lucide-react-native";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types
import {
  AuthStackParamList,
  NavigationProp,
} from "../../navigation/navigation.type";

export const ChangePasswordSuccessfulPage = () => {
  const mainNav = useNavigation<NavigationProp>();
  const route =
    useRoute<RouteProp<AuthStackParamList, "changePasswordSuccessful">>();
  const fromMain = route.params?.fromMain ?? false;

  const handleBackToLogin = () => {
    if (fromMain) {
      mainNav.navigate("mainscreen", { screen: "userProfile" });
    } else {
      mainNav.navigate("auth", { screen: "login" });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Gradient (emerald-50 via white to teal-50) */}
      <LinearGradient
        colors={["#ecfdf5", "#ffffff", "#f0fdfa"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Blobs */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Success Icon */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={["#34d399", "#14b8a6"]} // emerald-400 -> teal-500
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CheckCircle2 size={64} color="#ffffff" strokeWidth={3} />
            </LinearGradient>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Thành công! 🎉</Text>
          <Text style={styles.subtitle}>
            Mật khẩu của bạn đã được thay đổi{"\n"}thành công
          </Text>

          {/* Back to Login Button */}
          <TouchableOpacity
            style={styles.buttonShadow}
            onPress={handleBackToLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#10b981", "#0d9488"]} // emerald-500 -> teal-600
              start={{ x: 0, y: 0.5 }} // Horizontal gradient
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Quay lại đăng nhập</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  /* Decorative Blobs */
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobTop: {
    top: 0,
    right: 0,
    width: 256,
    height: 256,
    backgroundColor: "rgba(167, 243, 208, 0.2)", // emerald-200/20
    transform: [{ translateX: 50 }, { translateY: -50 }],
  },
  blobBottom: {
    bottom: 0,
    left: 0,
    width: 384,
    height: 384,
    backgroundColor: "rgba(153, 246, 228, 0.1)", // teal-200/10
    transform: [{ translateX: -50 }, { translateY: 50 }],
  },

  safeArea: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  /* Icon Styles */
  iconWrapper: {
    marginBottom: 32,
    // Shadow for the circle
    shadowColor: "#10b981", // emerald-500
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGradient: {
    width: 128, // w-32 (32 * 4)
    height: 128, // h-32
    borderRadius: 64, // rounded-full
    alignItems: "center",
    justifyContent: "center",
  },

  /* Typography */
  title: {
    fontSize: 30, // text-3xl
    fontWeight: "bold",
    color: "#111827", // gray-900
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563", // gray-600
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 24,
  },

  /* Button */
  buttonShadow: {
    width: "100%",
    maxWidth: 380,
    shadowColor: "#10b981", // emerald-500
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangePasswordSuccessfulPage;
