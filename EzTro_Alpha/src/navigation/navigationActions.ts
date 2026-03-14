import * as NavigationService from "./navigationService";
import { navigate } from "./navigationService";

export const appNavigator = {
  // NHỚ CODE ĐÚNG SESSION!
  goBack() {
    NavigationService.goBack();
  },
  // ─── AUTH ─────────────────────────────────────────────────────────────────

  goToWelcome() {
    navigate("auth", { screen: "welcome" });
  },

  goToLogin() {
    navigate("auth", { screen: "login" });
  },

  goToRegister() {
    navigate("auth", { screen: "register" });
  },

  goToForgotPassword() {
    navigate("auth", { screen: "forgotPassword" });
  },

  goToOtpVerification(email: string, tempToken: string) {
    navigate("auth", {
      screen: "otpVerification",
      params: { email, tempToken },
    });
  },

  goToCreateNewPassword(email: string) {
    navigate("auth", {
      screen: "createNewPassword",
      params: { email },
    });
  },

  goToChangePasswordSuccessful(fromMain: any) {
    navigate("auth", {
      screen: "changePasswordSuccessful",
      params: { fromMain },
    });
  },
  goToCreateBoardingHouseAuth() {
    navigate("auth", { screen: "createBoardingHouse" });
  },
  goToChangePasswordPage() {
    navigate("auth", { screen: "changePasswordPage" });
  },
  // ─── MAIN TAB ─────────────────────────────────────────────────────────────

  goToBlank() {
    navigate("mainscreen", { screen: "blank" });
  },

  goToUserProfile() {
    navigate("mainscreen", { screen: "userProfile" });
  },

  goToViewBoardingHousePage() {
    navigate("mainscreen", { screen: "viewBoardingHousePage" });
  },

  goToTrackingInvoiceStatus() {
    navigate("mainscreen", { screen: "trackingInvoiceStatus" });
  },

  goToCreateInvoicesScreen() {
    navigate("mainscreen", { screen: "createInvoicesScreen" });
  },
  
  // ─── MAIN STACK ───────────────────────────────────────────────────────────

  goToCreateBoardingHousePage() {
    navigate("mainstack", { screen: "createBoardingHousePage" });
  },

  goToEditProfile() {
    navigate("mainstack", { screen: "editProfile" });
  },

  goToCreateNewPasswordFromMain(email: string) {
    navigate("mainstack", {
      screen: "createNewPassword",
      params: { email, fromMain: true },
    });
  },

  goToChangePasswordSuccessfulFromMain() {
    navigate("mainstack", {
      screen: "changePasswordSuccessful",
      params: { fromMain: true },
    });
  },

  goToBoardingHouseDetailsScreen(_id: string | undefined) {
    navigate("mainstack", {
      screen: "boardingHouseDetailsScreen",
      params: { _id },
    });
  },

  goToCreateNewRoomScreen(
    houseId: string | undefined,
    room?: import("../types/room").IRoom,
  ) {
    navigate("mainstack", {
      screen: "createNewRoomScreen",
      params: { houseId, room },
    });
  },

  goToAddTenantScreen(roomId: string, room?: import("../types/room").IRoom) {
    navigate("mainstack", {
      screen: "addTenantScreen",
      params: { roomId, room },
    });
  },

  goToPackagePaymentScreen(houseData?: any) {
    navigate("mainstack", {
      screen: "packagePaymentScreen",
      params: { houseData },
    });
  },

  goToQRScanScreen(houseData?: any, packageId?: any, paymentType?: any) {
    navigate("mainstack", {
      screen: "qrScanScreen",
      params: { houseData, packageId, paymentType },
    });
  },
  goToNotificationScreen() {
    navigate("mainstack", { screen: "notificationScreen" });
  },
};
