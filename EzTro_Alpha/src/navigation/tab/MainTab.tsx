import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import NavBar from "../../components/layout/NavBar";
import BlankScreen from "../../screens/BlankScreen";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";
import { TrackingPaymentStatus } from "../../screens/boardingHouse/TrackingPaymentStatus";
import { ViewBoardingHousePage } from "../../screens/boardingHouse/ViewBoardingHousePage";
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
      name="trackingPaymentStatus"
      component={TrackingPaymentStatus}
    />
    <Tab.Screen name="userProfile" component={UserProfile} />
    <Tab.Screen
      name="createBoardingHousePage"
      component={CreateBoardingHouseScreen}
    />
    <Tab.Screen name="blank" component={BlankScreen} />
  </Tab.Navigator>
);

export default MainTab;
