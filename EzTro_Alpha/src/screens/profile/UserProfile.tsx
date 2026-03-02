import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  ChevronRight,
  Edit,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Phone,
  User,
  Wallet,
} from "lucide-react-native";
import React, { useContext, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "../../components/misc/Avatar";
import { COLORS, SHADOW } from "../../constants/theme";
import { ThemeContext } from "../../context/ThemeContext";
import { logoutAsync } from "../../features/auth/authSlice";
import { NavigationProp } from "../../navigation/navigation.type";
import { AppDispatch, RootState } from "../../stores/store";
import { UserProfileStyle } from "./styles/UserProfileStyle";

export const UserProfile: React.FC = () => {
  const theme = useContext(ThemeContext);
  const styles = UserProfileStyle(theme.theme);
  const navigation = useNavigation<NavigationProp>();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "auth" as never }],
      });
    }
  }, [user]);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogoutPress = () => {
    const result = dispatch(logoutAsync());
    if (logoutAsync.fulfilled.match(result)) {
      navigation.reset({
        index: 0,
        routes: [{ name: "auth" as never }],
      });
    }
  };
  const navigateToChangePasswordPage = () => {
    navigation.navigate("auth", { screen: "forgotPassword" });
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.headerGradient} />
          <View style={styles.profileCard}>
            <Avatar source={{ uri: user?.profilePicture }} size={100} />
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {user?.firstName + " " + user?.lastName}
                </Text>
              </View>
              <TouchableOpacity style={styles.badge}>
                <View style={styles.badgeIcon}>
                  <Icon name="home" size={26} color={theme.theme.color} />
                </View>
                <Text style={styles.badgeText}>Chủ trọ</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.walletContainer}>
            <View style={styles.walletInfoContainer}>
              <View style={styles.walletIcon}>
                <Wallet size={30} color={COLORS.WHITE} />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletLabel}>Số dư ví</Text>
                <Text style={styles.walletValue}>5.000.000 đ</Text>
              </View>
            </View>
            <TouchableOpacity>
              <View style={styles.walletArrow}>
                <ChevronRight size={20} color={COLORS.WHITE} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tài khoản</Text>
            </View>
            <View style={[styles.sectionCard, SHADOW.CARD]}>
              <TouchableOpacity
                style={styles.sectionItem}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("mainstack", { screen: "editProfile" })
                }
              >
                <View style={styles.sectionIcon}>
                  <User size={26} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <View style={styles.sectionItemTitleContainer}>
                    <Text style={styles.sectionItemTitle}>
                      Thông tin cá nhân
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.sectionItemDescription}>
                      Chỉnh sửa tên, email, số điện thoại
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.sectionItemRow}>
                <View style={styles.sectionIcon}>
                  <Mail size={26} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <View style={styles.sectionItemTitleContainer}>
                    <Text style={styles.sectionItemTitle}>Email</Text>
                  </View>
                  <View style={styles.sectionItemDescriptionContainer}>
                    <Text style={styles.sectionItemDescription}>
                      {user?.email || "Chưa cập nhật"}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.sectionItemRow}>
                <View style={styles.sectionIcon}>
                  <Phone size={26} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <View style={styles.sectionItemTitleContainer}>
                    <Text style={styles.sectionItemTitle}>Số điện thoại</Text>
                  </View>
                  <View>
                    <Text style={styles.sectionItemDescription}>
                      {user?.phoneNumber || "Chưa cập nhật"}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.sectionItemLast}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("mainstack", {
                    screen: "createNewPassword",
                    params: { email: user?.email ?? "", fromMain: true },
                  })
                }
              >
                <View style={styles.sectionIcon}>
                  <Lock size={26} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <View style={styles.sectionItemTitleContainer}>
                    <Text style={styles.sectionItemTitle}>Đổi mật khẩu</Text>
                  </View>
                  <View>
                    <Text style={styles.sectionItemDescription}>
                      Cập nhật mật khẩu bảo mật
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cài đặt</Text>
            </View>
            <View style={[styles.sectionCardSettings, SHADOW.CARD]}>
              <View style={styles.sectionItem}>
                <View style={styles.sectionIcon}>
                  <Bell size={26} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <View style={styles.sectionItemTitleContainer}>
                    <Text style={styles.sectionItemTitle}>Thông báo</Text>
                  </View>
                  <View>
                    <Text style={styles.sectionItemDescription}>
                      Quản lý thông báo ứng dụng
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.sectionItemRow}>
                <View style={styles.sectionIcon}>
                  <HelpCircle size={26} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <View style={styles.sectionItemTitleContainerLarge}>
                    <Text style={styles.sectionItemTitle}>
                      Trợ giúp & Hỗ trợ
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.sectionItemDescription}>
                      Câu hỏi thường gặp, liên hệ
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[
              COLORS.TRANSPARENT,
              COLORS.DIVIDER_GRAY,
              COLORS.TRANSPARENT,
            ]}
            style={styles.divider}
          />
          <TouchableOpacity
            style={[styles.changePasswordButton, SHADOW.CARD]}
            onPress={navigateToChangePasswordPage}
          >
            <View style={styles.logoutIcon}>
              <Edit size={16} color={COLORS.HIGHLIGHT_TEXT} />
            </View>
            <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutButton, SHADOW.CARD]}
            onPress={handleLogoutPress}
          >
            <View style={styles.logoutIcon}>
              <LogOut size={16} color={COLORS.RED_TEXT} />
            </View>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
