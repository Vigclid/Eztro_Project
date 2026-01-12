import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthStack from "./stack/AuthStack";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
