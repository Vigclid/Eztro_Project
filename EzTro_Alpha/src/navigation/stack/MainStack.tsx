import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="createBoardingHousePage"
      component={CreateBoardingHouseScreen}
    />
  </Stack.Navigator>
);

export default MainStack;
