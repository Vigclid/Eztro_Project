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

  goToChangePasswordSuccessful() {
    navigate("auth", { screen: "changePasswordSuccessful" });
  },

  goToCreateBoardingHouseAuth() {
    navigate("auth", { screen: "createBoardingHouse" });
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

  goToTrackingPaymentStatus() {
    navigate("mainscreen", { screen: "trackingPaymentStatus" });
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

  goToCreateInvoicesScreen() {
    navigate("mainstack", { screen: "createInvoicesScreen" });
  },
};
