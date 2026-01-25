import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ViewBoardingHousePage } from "../../screens/boardingHouse/ViewBoardingHousePage";
import { CreateBoardingHouseScreen } from "../../screens/boardingHouse/CreateBoardingHouseScreen";

const Stack = createNativeStackNavigator();

const BoardingHouseStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="viewBoardingHousePage" component={ViewBoardingHousePage} />
            <Stack.Screen name="createBoardingHouse" component={CreateBoardingHouseScreen} />
        </Stack.Navigator>
    );
};

export default BoardingHouseStack;