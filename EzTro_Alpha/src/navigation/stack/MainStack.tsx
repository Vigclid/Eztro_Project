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
  </Stack.Navigator>
);

export default MainStack;
