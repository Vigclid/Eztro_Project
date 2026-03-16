import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
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
