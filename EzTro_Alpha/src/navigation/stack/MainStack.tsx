import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BoardingHouseDetailsScreen from "../../screens/boardingHouse/BoardingHouseDetailsScreen";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";
import { CreateInvoices } from "../../screens/boardingHouse/CreateInvoices";

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="createBoardingHousePage"
      component={CreateBoardingHouseScreen}
    />
    <Stack.Screen
      name="boardingHouseDetailsScreen"
      component={BoardingHouseDetailsScreen}
    />
    <Stack.Screen name="createInvoicesScreen" component={CreateInvoices} />
  </Stack.Navigator>
);

export default MainStack;
