import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { NavigationProp } from "../../navigation/navigation.type";
import { RootState } from "../../stores/store";

const WelcomeScreen = () => {
  const { user, role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<NavigationProp>();
  useEffect(() => {
    if (user) {
      // Get role name from user object
      const getRoleName = () => {
        if (user?.roleName) return user.roleName;
        if (user?.roleId && typeof user.roleId === "object" && "name" in user.roleId) {
          return (user.roleId as any).name;
        }
        return role;
      };

      const userRole = getRoleName();

      if (userRole === "Tenant") {
        navigation.reset({
          index: 0,
          routes: [{ name: "tenantscreen" }],
        });
      } else if (userRole === "Staff" || userRole === "Admin") {
        navigation.reset({
          index: 0,
          routes: [{ name: "staffscreen" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "mainscreen" }],
        });
      }
    }
  }, [user, role]);

  const handleLoginPress = () => {
    navigation.navigate("auth", { screen: "login" });
  };

  const handleRegisterPress = () => {
    navigation.navigate("auth", { screen: "register" });
  };

  const features = [
    { icon: "🏠", text: "Quản lý nhiều nhà trọ" },
    { icon: "💰", text: "Theo dõi thu chi tự động" },
    { icon: "👥", text: "Quản lý khách thuê dễ dàng" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../../assets/images/icon.png")}
                style={styles.logo}
              />

              {/* Sparkle Icon */}
              <View style={styles.sparkleWrapper}>
                <Sparkles size={32} color="#fbbf24" />
              </View>
            </View>
          </View>

          {/* Texts */}
          <Text style={styles.subtitle}>Quản lý nhà trọ</Text>
          <Text style={styles.description}>
            Giải pháp toàn diện cho chủ trọ hiện đại. Quản lý dễ dàng, thu chi
            minh bạch.
          </Text>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.footer}>
          {/* Login Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLoginPress}
            style={styles.buttonShadow}
          >
            <LinearGradient
              colors={["#10b981", "#0d9488"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Đăng nhập</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleRegisterPress}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Tạo tài khoản mới</Text>
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
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },

  /* Decorative Background Blobs */
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobTop: {
    top: -50,
    right: -50,
    width: 256,
    height: 256,
    backgroundColor: "rgba(167, 243, 208, 0.3)", // emerald-200/30
  },
  blobBottom: {
    bottom: -50,
    left: -50,
    width: 384,
    height: 384,
    backgroundColor: "rgba(153, 246, 228, 0.2)", // teal-200/20
  },

  /* Logo Styles */
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    position: "relative",
  },
  logo: {
    width: 168,
    height: 168,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleWrapper: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },

  /* Text Styles */
  subtitle: {
    fontSize: 20,
    color: "#4b5563", // gray-600
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6b7280", // gray-500
    textAlign: "center",
    maxWidth: 300,
    marginBottom: 48,
    lineHeight: 20,
  },

  /* Feature List Styles */
  featuresContainer: {
    width: "100%",
    maxWidth: 380,
    gap: 12,
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1fae5", // emerald-100
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151", // gray-700
  },

  /* Button Section */
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: "100%",
    gap: 16,
  },
  buttonShadow: {
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#10b981", // emerald-500
  },
  secondaryButtonText: {
    color: "#059669", // emerald-600
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
