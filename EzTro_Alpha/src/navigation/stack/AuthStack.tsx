import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChangePasswordSuccessfulPage from "../../screens/auth/ChangePasswordSuccessfulPage";
import CreateNewPasswordScreen from "../../screens/auth/CreateNewPasswordScreen";
import ForgotPasswordScreen from "../../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../../screens/auth/LoginScreen";
import OtpVerificationScreen from "../../screens/auth/OtpVerificationScreen";
import RegisterScreen from "../../screens/auth/RegisterScreen";
import WelcomeScreen from "../../screens/auth/WelcomeScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="welcome"
  >
    <Stack.Screen name="welcome" component={WelcomeScreen} />
    <Stack.Screen name="login" component={LoginScreen} />
    <Stack.Screen name="register" component={RegisterScreen} />
    <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="otpVerification" component={OtpVerificationScreen} />
    <Stack.Screen
      name="createNewPassword"
      component={CreateNewPasswordScreen}
    />
    <Stack.Screen
      name="changePasswordSuccessful"
      component={ChangePasswordSuccessfulPage}
    />
  </Stack.Navigator>
);

export default AuthStack;
