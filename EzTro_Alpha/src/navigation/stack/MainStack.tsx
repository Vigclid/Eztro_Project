import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";
import BoardingHouseDetailsScreen from "../../screens/boardingHouse/BoardingHouseDetailsScreen";
import CreateNewRoomScreen from "../../screens/room/CreateNewRoomScreen";

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
    <Stack.Screen
      name="createNewRoomScreen"
      component={CreateNewRoomScreen}
    />
  </Stack.Navigator>
);

export default MainStack;
