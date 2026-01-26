import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  authscreen: undefined;
  mainscreen: {
    screen: keyof MainStackParamList;
    params?: MainStackParamList[keyof MainStackParamList];
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type AuthStackParamList = {
  welcome: undefined;
  login: undefined;
  register: undefined;
  forgotPassword: undefined;
  otpVerification: { email: string; tempToken: string } | undefined;
  createNewPassword: { email: string } | undefined;
  changePasswordSuccessful: undefined;
  createBoardingHouse: undefined;
};

export type MainStackParamList = {
  blank: undefined;
  userProfile: undefined;
};
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
