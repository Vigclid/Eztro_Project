import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Bell } from "lucide-react-native";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { appNavigator } from "../../navigation/navigationActions";
import { RootState } from "../../stores/store";

const NavBar = ({ state, navigation }: BottomTabBarProps) => {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const currentRouteName = state.routes[state.index].name;
  const isActive = (routeName: string) => currentRouteName === routeName;
  const unreadCount = useSelector((s: RootState) => s.notification.unreadCount);

  // const isRootScreen = () => {
  //   const currentRouteName = state.routes[state.index].name;
  //   const rootScreens = ["home", "forum-list", "ArtHubAI"];
  //   return rootScreens.includes(currentRouteName || "");
  // };

  // const handleBackPress = () => {
  //   const currentRouteName = state.routes[state.index].name;

  //   if (currentRouteName === "forum-list") {
  //     navigation.getParent()?.navigate("homescreen", { screen: "home" });
  //   } else {
  //     navigation.goBack();
  //   }
  // };

  return (
    <LinearGradient
      colors={["rgba(28, 28, 30, 0.78)", "rgba(20, 30, 28, 0.72)"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={[
        styles.headerContainer,
        {
          bottom:
            Platform.OS === "ios" ? insets.bottom - 13 : insets.bottom - 6,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("viewBoardingHousePage")}
      >
        <Icon
          name="home"
          size={36}
          color={isActive("viewBoardingHousePage") ? theme.color : theme.color3}
        />
        <Text
          style={{
            color: isActive("viewBoardingHousePage")
              ? theme.color
              : theme.color3,
          }}
        >
          Trang chủ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("createInvoicesScreen")}
      >
        <Icon
          name="credit-card"
          size={36}
          color={isActive("createInvoicesScreen") ? theme.color : theme.color3}
        />
        <Text
          style={{
            color: isActive("createInvoicesScreen")
              ? theme.color
              : theme.color3,
          }}
        >
          Hóa đơn
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("trackingInvoiceStatus")}
      >
        <Icon
          name="history"
          size={36}
          color={isActive("trackingInvoiceStatus") ? theme.color : theme.color3}
        />
        <Text
          style={{
            color: isActive("trackingInvoiceStatus")
              ? theme.color
              : theme.color3,
          }}
        >
          Tra soát
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => appNavigator.goToNotificationScreen()}
      >
        <View style={styles.iconWrap}>
          <Bell
            size={36}
            color={isActive("notificationScreen") ? theme.color : theme.color3}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{
            color: isActive("notificationScreen") ? theme.color : theme.color3,
          }}
        >
          Thông báo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("userProfile")}
      >
        <Icon
          name="person"
          size={36}
          color={isActive("userProfile") ? theme.color : theme.color3}
        />
        <Text
          style={{
            color: isActive("userProfile") ? theme.color : theme.color3,
          }}
        >
          Cá nhân
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 80,
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
  },
  iconWrap: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E7000A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "rgba(28,28,30,0.78)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default NavBar;
