import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ViewBoardingHousePage } from "../../screens/boardingHouse/ViewBoardingHousePage";

const Stack = createNativeStackNavigator();

const BoardingHouseStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="viewBoardingHousePage" component={ViewBoardingHousePage} />
        </Stack.Navigator>
    );
};

export default BoardingHouseStack;