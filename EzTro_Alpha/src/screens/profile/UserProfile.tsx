import { useNavigation } from "@react-navigation/native";
import {
  ChevronRight,
  Edit,
  HelpCircle,
  LogOut,
  Mail,
  Phone,
  Settings,
  User,
  ShieldCheck,
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
import { appNavigator } from "../../navigation/navigationActions";
import { AppDispatch, RootState } from "../../stores/store";
import { UserProfileStyle } from "./styles/UserProfileStyle";

export const UserProfile: React.FC = () => {
  const theme = useContext(ThemeContext);
  const styles = UserProfileStyle(theme.theme);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const getRoleName = () => {
    if (user?.roleName) return user.roleName;
    if (user?.roleId && typeof user.roleId === "object" && "name" in user.roleId) {
      return user.roleId.name;
    }
    return "User";
  };

  const roleName = getRoleName();
  const isLandlord = roleName === "Landlord";

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      Landlord: "Chủ trọ",
      Tenant: "Người thuê",
    };
    return roleMap[role] || role;
  };

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "auth" as never }],
      });
    }
  }, [user]);

  const handleLogoutPress = () => {
    dispatch(logoutAsync());
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerGradient} />
          
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Avatar source={{ uri: user?.profilePicture }} size={100} />
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {user?.firstName + " " + user?.lastName}
                </Text>
              </View>
              <View style={styles.badge}>
                <View style={styles.badgeIcon}>
                  <ShieldCheck size={16} color={COLORS.PRIMARY} />
                </View>
                <Text style={styles.badgeText}>
                  {getRoleDisplayName(roleName)}
                </Text>
              </View>
            </View>
          </View>

          {/* New Dashboard Section (Thay thế cho Ví) */}
          <View style={[styles.walletContainer, { paddingVertical: 15 }]}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: 'bold' }}>
                {isLandlord ? "12" : "01"}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
                {isLandlord ? "Phòng trống" : "Hợp đồng"}
              </Text>
            </View>
            
            <View style={{ width: 1, height: '60%', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: 'bold' }}>05</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>Thông báo mới</Text>
            </View>

            <View style={{ width: 1, height: '60%', backgroundColor: 'rgba(255,255,255,0.3)' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: COLORS.WHITE, fontSize: 18, fontWeight: 'bold' }}>
                {isLandlord ? "02" : "0"}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
                {isLandlord ? "Sự cố" : "Hóa đơn"}
              </Text>
            </View>
          </View>

          {/* Section: Tài khoản */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tài khoản</Text>
            </View>
            <View style={[styles.sectionCard, SHADOW.CARD]}>
              <TouchableOpacity
                style={styles.sectionItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("mainstack", { screen: "editProfile" })}
              >
                <View style={styles.sectionIcon}>
                  <User size={24} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <Text style={styles.sectionItemTitle}>Thông tin cá nhân</Text>
                  <Text style={styles.sectionItemDescription}>Chỉnh sửa tên, email, số điện thoại</Text>
                </View>
                <ChevronRight size={18} color={COLORS.GRAY_LIGHT} />
              </TouchableOpacity>
              

              <View style={styles.sectionItemRow}>
                <View style={styles.sectionIcon}>
                  <Mail size={24} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <Text style={styles.sectionItemTitle}>Email</Text>
                  <Text style={styles.sectionItemDescription}>{user?.email || "Chưa cập nhật"}</Text>
                </View>
              </View>


              <View style={styles.sectionItemRow}>
                <View style={styles.sectionIcon}>
                  <Phone size={24} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <Text style={styles.sectionItemTitle}>Số điện thoại</Text>
                  <Text style={styles.sectionItemDescription}>{user?.phoneNumber || "Chưa cập nhật"}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section: Cài đặt */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cài đặt & Hỗ trợ</Text>
            </View>
            <View style={[styles.sectionCardSettings, SHADOW.CARD]}>
              <TouchableOpacity 
                style={styles.sectionItem}
                onPress={() => appNavigator.goToSettingScreen()}
              >
                <View style={styles.sectionIcon}>
                  <Settings size={24} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <Text style={styles.sectionItemTitle}>Cài đặt ứng dụng</Text>
                  <Text style={styles.sectionItemDescription}>Giao diện, thông báo, ngôn ngữ</Text>
                </View>
                <ChevronRight size={18} color={COLORS.GRAY_LIGHT} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sectionItem}
                onPress={() => appNavigator.goToSupportScreen()}
              >
                <View style={styles.sectionIcon}>
                  <HelpCircle size={24} color={COLORS.GRADIENT_START} />
                </View>
                <View style={styles.sectionItemContent}>
                  <Text style={styles.sectionItemTitle}>Trợ giúp & Hỗ trợ</Text>
                  <Text style={styles.sectionItemDescription}>Báo lỗi hoặc góp ý phát triển</Text>
                </View>
                <ChevronRight size={18} color={COLORS.GRAY_LIGHT} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.changePasswordButton, SHADOW.CARD]}
              onPress={() => appNavigator.goToChangePasswordPage()}
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
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};