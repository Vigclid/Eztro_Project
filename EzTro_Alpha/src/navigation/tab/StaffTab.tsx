import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import StaffNavBar from "../../components/layout/StaffNavBar";
import { StaffDashboardScreen } from "../../screens/staff/StaffDashboardScreen";
import { StaffSupportScreen } from "../../screens/staff/StaffSupportScreen";
import { UserProfile } from "../../screens/profile/UserProfile";
import BlankScreen from "../../screens/BlankScreen";

const Tab = createBottomTabNavigator();

const StaffTab = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <StaffNavBar {...props} />}
  >
    <Tab.Screen name="staffDashboard" component={StaffDashboardScreen} />
    <Tab.Screen name="staffUsers" component={BlankScreen} />
    <Tab.Screen name="staffSupport" component={StaffSupportScreen} />
    <Tab.Screen name="staffActivity" component={BlankScreen} />
    <Tab.Screen name="userProfile" component={UserProfile} />
  </Tab.Navigator>
);

export default StaffTab;
