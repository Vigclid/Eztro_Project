import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthStack from "./stack/AuthStack";
import MainStack from "./stack/MainStack";
import MainTab from "./tab/MainTab";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" component={AuthStack} />
      <Stack.Screen name="mainscreen" component={MainTab} />
      <Stack.Screen name="mainstack" component={MainStack} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
