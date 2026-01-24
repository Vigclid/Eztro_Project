import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthStack from "./stack/AuthStack";
import BoardingHouseStack from "./stack/BoardingHouseStack";
import MainTab from "./stack/MainTab";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" component={AuthStack} />
      <Stack.Screen name="boardingHouse" component={BoardingHouseStack} />
      <Stack.Screen name="authscreen" component={AuthStack} />
      <Stack.Screen name="mainscreen" component={MainTab} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
