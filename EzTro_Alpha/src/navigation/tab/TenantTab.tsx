import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import TenantNavBar from "../../components/layout/TenantNavBar";
import { TenantInvoiceScreen } from "../../screens/invoice/TenantInvoiceScreen";
import { UserProfile } from "../../screens/profile/UserProfile";
import TenantHomeScreen from "../../screens/tenant/TenantHomeScreen";
import { ConversationListScreen } from "../../screens/chat/ConversationListScreen";

const Tab = createBottomTabNavigator();

const TenantTab = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <TenantNavBar {...props} />}
  >
    <Tab.Screen name="tenantHome" component={TenantHomeScreen} />
    <Tab.Screen name="trackingInvoiceStatus" component={TenantInvoiceScreen} />
    <Tab.Screen name="conversationList" component={ConversationListScreen} />
    <Tab.Screen name="userProfile" component={UserProfile} />
  </Tab.Navigator>
);

export default TenantTab;
