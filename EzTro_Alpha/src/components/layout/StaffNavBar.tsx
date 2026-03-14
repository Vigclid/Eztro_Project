import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Users, LifeBuoy, Activity, User } from "lucide-react-native";

interface StaffNavBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const StaffNavBar: React.FC<StaffNavBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const icons: Record<string, any> = {
    staffDashboard: Home,
    staffUsers: Users,
    staffSupport: LifeBuoy,
    staffActivity: Activity,
    userProfile: User,
  };

  const labels: Record<string, string> = {
    staffDashboard: "Trang chủ",
    staffUsers: "Người dùng",
    staffSupport: "Hỗ trợ",
    staffActivity: "Hoạt động",
    userProfile: "Cá nhân",
  };

  const activeColor = "#10b981"; // emerald-500
  const inactiveColor = "#9ca3af"; // gray-400

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
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const Icon = icons[route.name];
        const label = labels[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.item}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Icon
              size={36}
              color={isFocused ? activeColor : inactiveColor}
              strokeWidth={isFocused ? 2.5 : 2}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? activeColor : inactiveColor },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});

export default StaffNavBar;
