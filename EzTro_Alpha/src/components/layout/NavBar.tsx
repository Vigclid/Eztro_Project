import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { logoutAsync } from "../../features/auth/authSlice";
import { AppDispatch, RootState } from "../../stores/store";

const NavBar = ({ state, navigation, descriptors }: BottomTabBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const currentRouteName = state.routes[state.index].name;
  const isActive = (routeName: string) => currentRouteName === routeName;

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

  const logout = async () => {
    await dispatch(logoutAsync());
    navigation.reset({
      index: 0,
      routes: [{ name: "auth" as never }],
    });
  };

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
      <TouchableOpacity style={styles.item}>
        <Icon name="apartment" size={36} color={theme.color3} />
        <Text style={{ color: theme.color3 }}>Nhà trọ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          (navigation.getParent() as any)?.navigate("mainstack", {
            screen: "createInvoicesScreen",
          })
        }
      >
        <Icon name="credit-card" size={36} color={theme.color3} />
        <Text style={{ color: theme.color3 }}>Hóa đơn</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Icon name="history" size={36} color={theme.color3} />
        <Text style={{ color: theme.color3 }}>Lịch sử</Text>
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
});

export default NavBar;
