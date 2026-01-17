import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  authscreen: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type AuthStackParamList = {
  welcome: undefined;
  login: undefined;
  register: undefined;
  forgotPassword: undefined;
  otpVerification: undefined;
  createNewPassword: undefined;
  changePasswordSuccessful: undefined;
  createBoardingHouse: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
