import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import NavBar from "../../components/layout/NavBar";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";
import { ViewBoardingHousePage } from "../../screens/boardingHouse/ViewBoardingHousePage";
import { CreateInvoices } from "../../screens/invoice/CreateInvoices";
import { TrackingInvoiceStatus } from "../../screens/invoice/TrackingInvoiceStatus";
import { UserProfile } from "../../screens/profile/UserProfile";

const Tab = createBottomTabNavigator();

const MainTab = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <NavBar {...props} />}
  >
    <Tab.Screen
      name="viewBoardingHousePage"
      component={ViewBoardingHousePage}
    />
    <Tab.Screen
      name="trackingInvoiceStatus"
      component={TrackingInvoiceStatus}
    />
    <Tab.Screen name="userProfile" component={UserProfile} />
    <Tab.Screen
      name="createBoardingHousePage"
      component={CreateBoardingHouseScreen}
    />
    <Tab.Screen name="createInvoicesScreen" component={CreateInvoices} />
  </Tab.Navigator>
);

export default MainTab;
