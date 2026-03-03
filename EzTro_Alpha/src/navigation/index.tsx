import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import { navigationRef } from "./navigationService";

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
