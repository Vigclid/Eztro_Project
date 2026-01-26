import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import NavBar from "../../components/layout/NavBar";
import BlankScreen from "../../screens/BlankScreen";
import { UserProfile } from "../../screens/profile/UserProfile";

const Tab = createBottomTabNavigator();

const MainTab = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <NavBar {...props} />}
  >
    <Tab.Screen name="blank" component={BlankScreen} />
    <Tab.Screen name="userProfile" component={UserProfile} />
  </Tab.Navigator>
);

export default MainTab;
