import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  auth: {
    screen: keyof AuthStackParamList;
    params?: AuthStackParamList[keyof AuthStackParamList];
  };
  mainscreen: {
    screen: keyof MainTabParamList;
    params?: MainTabParamList[keyof MainTabParamList];
  };
  tenantscreen: {
    screen: keyof TenantTabParamList;
    params?: TenantTabParamList[keyof TenantTabParamList];
  };
  staffscreen: {
    screen: keyof StaffTabParamList;
    params?: StaffTabParamList[keyof StaffTabParamList];
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
  trackingInvoiceStatus: undefined;
  createInvoicesScreen: undefined;
};

export type TenantTabParamList = {
  tenantHome: undefined;
  trackingInvoiceStatus: undefined;
  userProfile: undefined;
};

export type StaffTabParamList = {
  staffDashboard: undefined;
  staffUsers: undefined;
  staffSupport: undefined;
  staffActivity: undefined;
  userProfile: undefined;
};

export type MainStackParamList = {
  createBoardingHousePage: undefined;
  editProfile: undefined;
  createNewPassword: { email: string; fromMain: true } | undefined;
  changePasswordSuccessful: { fromMain: true } | undefined;
  boardingHouseDetailsScreen: { _id: string | undefined };
  createNewRoomScreen:
    | {
        houseId: string | undefined;
        room?: import("../types/room").IRoom;
        onRefresh?: () => void;
      }
    | undefined;
  addTenantScreen:
    | {
        roomId: string;
        room?: import("../types/room").IRoom;
      }
    | undefined;
  createInvoicesScreen: undefined;
  ticketListScreen: undefined;
  createTicketScreen: undefined;
  ticketDetailScreen: { ticketId: string };
  packagePaymentScreen: { houseData: any | undefined };
  qrScanScreen: {
    houseData: any;
    packageId: any;
    paymentType: any | undefined;
  };
  notificationScreen: undefined;
  createNotificationScreen: undefined;
  supportScreen: undefined;
  myReportsScreen: undefined;
  reportDetailScreen: { reportId: string };
};

export type AuthStackParamList = {
  welcome: undefined;
  login: undefined;
  register: undefined;
  forgotPassword: undefined;
  changePasswordPage: undefined;
  otpVerification: { email: string; tempToken: string } | undefined;
  createNewPassword: { email: string } | undefined;
  changePasswordSuccessful: { fromMain?: boolean } | undefined;
  createBoardingHouse: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
