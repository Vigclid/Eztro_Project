import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  authscreen: undefined;
  boardingHouse: {
    screen?: keyof BoardingHouseStackParamList;
    params?: BoardingHouseStackParamList[keyof BoardingHouseStackParamList];
  }
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

export type BoardingHouseStackParamList = {
  viewBoardingHousePage: undefined;
};

export type BoardingHouseNavigationProp = NativeStackNavigationProp<BoardingHouseStackParamList>;