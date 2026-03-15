import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthStack from "./stack/AuthStack";
import MainStack from "./stack/MainStack";
import MainTab from "./tab/MainTab";
import TenantTab from "./tab/TenantTab";
import { StaffRedirectScreen } from "../screens/auth/StaffRedirectScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" component={AuthStack} />
      <Stack.Screen name="mainscreen" component={MainTab} />
      <Stack.Screen name="tenantscreen" component={TenantTab} />
      <Stack.Screen name="mainstack" component={MainStack} />
      <Stack.Screen name="staffRedirect" component={StaffRedirectScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
