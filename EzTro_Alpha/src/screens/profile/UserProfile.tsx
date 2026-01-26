import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "../../components/misc/Avatar";
import { COLORS, SHADOW } from "../../constants/theme";
import { ThemeContext } from "../../context/ThemeContext";
import { logoutAsync } from "../../features/auth/authSlice";
import { AuthNavigationProp } from "../../navigation/navigation.type";
import { AppDispatch, RootState } from "../../stores/store";
import { UserProfileStyle } from "./styles/UserProfileStyle";

export const UserProfile: React.FC = () => {
  const theme = useContext(ThemeContext);
  const styles = UserProfileStyle(theme.theme);
  const navigation = useNavigation<AuthNavigationProp>();
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
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/c1i9zv6k_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.badgeIcon}
                />
                <Text style={styles.badgeText}>Chủ trọ</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.walletContainer}>
            <View style={styles.walletInfoContainer}>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/7gsiz2xu_expires_30_days.png",
                }}
                resizeMode="stretch"
                style={styles.walletIcon}
              />
              <View style={styles.walletInfo}>
                <Text style={styles.walletLabel}>Số dư ví</Text>
                <Text style={styles.walletValue}>5.000.000 đ</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ah703gqa_expires_30_days.png",
                }}
                resizeMode="stretch"
                style={styles.walletArrow}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tài khoản</Text>
            </View>
            <View style={[styles.sectionCard, SHADOW.CARD]}>
              <View style={styles.sectionItem}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/coksd6pv_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.sectionIcon}
                />
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
              </View>
              <View style={styles.sectionItemRow}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ryf3uiex_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.sectionIcon}
                />
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
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/g5r9a6e8_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.sectionIcon}
                />
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
              <View style={styles.sectionItemLast}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ivmn7zsx_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.sectionIcon}
                />
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
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cài đặt</Text>
            </View>
            <View style={[styles.sectionCardSettings, SHADOW.CARD]}>
              <View style={styles.sectionItem}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/k8ot8pt8_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.sectionIcon}
                />
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
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/gm200nyu_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.sectionIcon}
                />
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
            style={[styles.logoutButton, SHADOW.CARD]}
            onPress={handleLogoutPress}
          >
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/zthcnzqh_expires_30_days.png",
              }}
              resizeMode="stretch"
              style={styles.logoutIcon}
            />
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
