import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BoardingHouseDetailsScreen from "../../screens/boardingHouse/BoardingHouseDetailsScreen";
import CreateNewRoomScreen from "../../screens/room/CreateNewRoomScreen";
import AddTenantScreen from "../../screens/room/AddTenantScreen";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";
import { CreateInvoices } from "../../screens/boardingHouse/CreateInvoices";
import { EditProfilePage } from "../../screens/profile/EditProfilePage";
import { ChangePasswordSuccessfulPage } from "../../screens/auth/ChangePasswordSuccessfulPage";
import { CreateNewPasswordScreen } from "../../screens/auth/CreateNewPasswordScreen";
import { TicketListScreen } from "../../screens/ticket/TicketListScreen";
import { CreateTicketScreen } from "../../screens/ticket/CreateTicketScreen";
import { TicketDetailScreen } from "../../screens/ticket/TicketDetailScreen";
import { PackagePaymentScreen } from '../../screens/payment/PackagePaymentScreen';
import { QRScanScreen } from "../../screens/payment/QRScanScreen";
import { NotificationScreen } from "../../screens/notification/NotificationScreen";
import { SupportScreen } from "../../screens/support/SupportScreen";
import { MyReportsScreen } from "../../screens/support/MyReportsScreen";
import { ReportDetailScreen } from "../../screens/support/ReportDetailScreen";

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="createBoardingHousePage" component={CreateBoardingHouseScreen} />
    <Stack.Screen name="editProfile" component={EditProfilePage} />
    <Stack.Screen name="createNewPassword" component={CreateNewPasswordScreen} />
    <Stack.Screen name="changePasswordSuccessful" component={ChangePasswordSuccessfulPage} />
    <Stack.Screen name="boardingHouseDetailsScreen" component={BoardingHouseDetailsScreen} />
    <Stack.Screen name="createNewRoomScreen" component={CreateNewRoomScreen} />
    <Stack.Screen name="addTenantScreen" component={AddTenantScreen} />
    <Stack.Screen name="createInvoicesScreen" component={CreateInvoices} />
    <Stack.Screen name="ticketListScreen" component={TicketListScreen} />
    <Stack.Screen name="createTicketScreen" component={CreateTicketScreen} />
    <Stack.Screen name="ticketDetailScreen" component={TicketDetailScreen} />
    <Stack.Screen name="packagePaymentScreen" component={PackagePaymentScreen} />
    <Stack.Screen name="qrScanScreen" component={QRScanScreen} />
    <Stack.Screen name="notificationScreen" component={NotificationScreen} />
    <Stack.Screen name="supportScreen" component={SupportScreen} />
    <Stack.Screen name="myReportsScreen" component={MyReportsScreen} />
    <Stack.Screen name="reportDetailScreen" component={ReportDetailScreen} />
  </Stack.Navigator>
);

export default MainStack;