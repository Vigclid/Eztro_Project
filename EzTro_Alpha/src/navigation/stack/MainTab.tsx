import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import NavBar from "../../components/layout/NavBar";
import BlankScreen from "../../screens/BlankScreen";

const Tab = createBottomTabNavigator();

const MainTab = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <NavBar {...props} />}
  >
    <Tab.Screen name="blank" component={BlankScreen} />
  </Tab.Navigator>
);

export default MainTab;
