import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  auth: undefined;
  mainscreen: {
    screen: keyof MainTabParamList;
    params?: MainTabParamList[keyof MainTabParamList];
  };
  mainstack: {
    screen: keyof MainStackParamList;
    params?: MainStackParamList[keyof MainStackParamList];
  };
};
export type MainTabParamList = {
  blank: undefined;
  userProfile: undefined;
  viewBoardingHousePage: undefined;
};

export type MainStackParamList = {
  createBoardingHousePage: undefined;
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

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
