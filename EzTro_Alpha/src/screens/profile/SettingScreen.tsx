import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, ChevronLeft, Globe, Mail, Moon, Sun, Trash2, ShieldAlert, AlertTriangle } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
} from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";
import { appNavigator } from "../../navigation/navigationActions";
import { ISetting } from "../../types/setting";
import { getSettingApi, patchSettingApi } from "../../api/setting/setting";
import { ApiResponse } from "../../types/app.common";
import { logoutAsync } from "../../features/auth/authSlice";
import { RootState } from "../../stores/store";
import { deleteUserApi } from "../../api/user/user";

// ─── Theme Card Component ───────────────────────────────────────────────────

interface ThemeCardProps {
  type: "light" | "dark";
  selected: boolean;
  onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ type, selected, onSelect }) => {
  const isDark = type === "dark";
  return (
    <TouchableOpacity
      style={[
        styles.themeCard,
        selected && styles.themeCardSelected,
        isDark && styles.themeCardDisabled,
      ]}
      onPress={isDark ? undefined : onSelect}
      activeOpacity={isDark ? 1 : 0.8}
      disabled={isDark}
    >
      <View style={[styles.themePreview, isDark && styles.themePreviewDark]}>
        <LinearGradient
          colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.themePreviewBar}
        />
        <View style={[styles.themePreviewBody, isDark && styles.themePreviewBodyDark]}>
          <View style={[styles.themePreviewSkeleton, isDark && styles.themePreviewSkeletonDark]} />
          <View style={[styles.themePreviewSkeleton, isDark && styles.themePreviewSkeletonDark]} />
        </View>
      </View>

      {selected && (
        <LinearGradient
          colors={["rgba(16,185,129,0.2)", "rgba(20,184,166,0.2)"]}
          style={styles.themeCheckBadge}
        >
          <Text style={styles.themeCheckText}>✓</Text>
        </LinearGradient>
      )}

      <View style={styles.themeCardLabel}>
        {isDark ? <Moon size={20} color="#1f2937" /> : <Sun size={20} color="#1f2937" />}
        <View style={styles.themeCardLabelText}>
          <Text style={styles.themeCardTitle}>{isDark ? "Chế độ tối" : "Chế độ sáng"}</Text>
          <Text style={styles.themeCardDesc}>{isDark ? "Dễ nhìn ban đêm" : "Dễ nhìn ban ngày"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Section Header Component ────────────────────────────────────────────────

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const SettingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [setting, setSetting] = useState<ISetting | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSetting = async (signal?: AbortSignal) => {
    try {
      const res = await getSettingApi.getMySetting(signal) as ApiResponse<ISetting>;
      if (res.status === "success") {
        setSetting(res.data as ISetting);
      }
    } catch (err) { }
  };

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      fetchSetting(controller.signal);
      return () => controller.abort();
    }, [])
  );

  const handleUpdateNotification = async (action: "email" | "zalo") => {
    if (!setting) return;

    const previousSetting = { ...setting };
    const isEmail = action === "email";
    const currentValue = isEmail ? setting.notifyEmail : setting.notifyZalo;
    const newValue = !currentValue;

    setSetting({
      ...setting,
      [isEmail ? "notifyEmail" : "notifyZalo"]: newValue,
    });

    try {
      const payload = isEmail ? { notifyEmail: newValue } : { notifyZalo: newValue };
      const res = await patchSettingApi.updateSetting(payload) as ApiResponse<ISetting>;

      if (res.status !== "success") {
        throw new Error("Update failed");
      }
    } catch (err) {
      setSetting(previousSetting);
      Alert.alert("Thông báo", "Không thể cập nhật cài đặt. Vui lòng thử lại.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xóa tài khoản",
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
      [
        {
          text: "Hủy",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: confirmDeleteAccount,
          style: "destructive",
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteUserApi.deleteAccount(user?._id || "");

      if (response.status === "success") {
        Alert.alert("Thành công", "Tài khoản đã được xóa", [
          {
            text: "OK",
            onPress: () => {
              dispatch(logoutAsync() as any);
              appNavigator.goToLogin();
            },
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err.message || "Không thể xóa tài khoản. Vui lòng thử lại."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={22} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt ứng dụng</Text>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader icon={<Sun size={24} color="#1f2937" />} title="Giao diện" />
        <View style={styles.themeRow}>
          <ThemeCard
            type="light"
            selected={selectedTheme === "light"}
            onSelect={() => setSelectedTheme("light")}
          />
          <ThemeCard
            type="dark"
            selected={selectedTheme === "dark"}
            onSelect={() => setSelectedTheme("dark")}
          />
        </View>

        <SectionHeader icon={<Bell size={24} color="#1f2937" />} title="Kênh thông báo" />
        <View style={styles.card}>
          <View style={styles.row}>
            <LinearGradient colors={["#3b82f6", "#2563eb"]} style={styles.iconBox}>
              <Bell size={20} color={COLORS.WHITE} />
            </LinearGradient>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Thông báo đẩy</Text>
              <Text style={styles.rowDesc}>Nhận thông báo trên thiết bị</Text>
            </View>
            <Switch
              value={!!setting?.notifyEmail}
              onValueChange={() => handleUpdateNotification("email")}
              trackColor={{ false: COLORS.BORDER_GRAY, true: COLORS.GRADIENT_CARD_START }}
              thumbColor={COLORS.WHITE}
            />
          </View>

          <View style={styles.divider} />

          <View style={[styles.row, styles.rowLast]}>
            <LinearGradient colors={["#f97316", "#ea580c"]} style={styles.iconBox}>
              <Mail size={20} color={COLORS.WHITE} />
            </LinearGradient>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Zalo</Text>
              <Text style={styles.rowDesc}>Nhận thông báo qua Zalo</Text>
            </View>
            <Switch
              value={!!setting?.notifyZalo}
              onValueChange={() => handleUpdateNotification("zalo")}
              trackColor={{ false: COLORS.BORDER_GRAY, true: COLORS.GRADIENT_CARD_START }}
              thumbColor={COLORS.WHITE}
            />
          </View>
        </View>

        <SectionHeader icon={<Globe size={24} color="#1f2937" />} title="Ngôn ngữ" />
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.langRow, language === "vi" && styles.langRowSelected]}
            onPress={() => setLanguage("vi")}
          >
            <View style={styles.flagBox}><Text style={styles.flagEmoji}>🇻🇳</Text></View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Tiếng Việt</Text>
              <Text style={styles.rowDesc}>Vietnamese</Text>
            </View>
            {language === "vi" && (
              <LinearGradient colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]} style={styles.langCheck}>
                <Text style={styles.langCheckText}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={[styles.langRow, styles.rowLast, language === "en" && styles.langRowSelected]}
            onPress={() => setLanguage("en")}
          >
            <View style={styles.flagBox}><Text style={styles.flagEmoji}>🇬🇧</Text></View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>English</Text>
              <Text style={styles.rowDesc}>Tiếng Anh</Text>
            </View>
            {language === "en" && (
              <LinearGradient colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]} style={styles.langCheck}>
                <Text style={styles.langCheckText}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        <SectionHeader icon={<ShieldAlert size={24} color="#ef4444" />} title="Quản lý dữ liệu" />
        
        {user?.roleName === "Landlord" && (
          <View style={[styles.card, styles.dangerCard]}>
            <TouchableOpacity
              style={[styles.row, styles.rowLast]}
              onPress={() => appNavigator.goToDeleteBoardingHouseScreen()}
            >
              <View style={[styles.iconBox, styles.dangerIconBox]}>
                <Trash2 size={20} color="#ef4444" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: "#ef4444" }]}>Xóa cụm trọ</Text>
                <Text style={styles.rowDesc}>Xóa các cụm trọ không còn sử dụng</Text>
              </View>
              <ChevronLeft size={20} color="#ef4444" style={styles.rotateIcon} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.card, styles.deleteAccountCard]}>
          <TouchableOpacity
            style={[styles.row, styles.rowLast]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <View style={[styles.iconBox, styles.deleteAccountIconBox]}>
              <AlertTriangle size={20} color="#dc2626" />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: "#dc2626" }]}>Xóa tài khoản</Text>
              <Text style={styles.rowDesc}>Xóa tài khoản của bạn vĩnh viễn</Text>
            </View>
            {!isDeleting && <ChevronLeft size={20} color="#dc2626" style={styles.rotateIcon} />}
            {isDeleting && <Text style={{ color: "#dc2626" }}>Đang xóa...</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerEmoji}>🌐</Text>
          <Text style={styles.infoBannerText}>Hỗ trợ đa ngôn ngữ sẽ có trong phiên bản tới</Text>
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.PROFILE_BACKGROUND },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: SPACING.MEDIUM,
    paddingHorizontal: SPACING.XL,
    height: 100,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: COLORS.WHITE, fontSize: FONT_SIZE.HEADER_TITLE, fontWeight: "bold" },
  headerPlaceholder: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.PROFILE_CARD_MARGIN_HORIZONTAL,
    paddingTop: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginTop: SPACING.PROFILE_WALLET_MARGIN_BOTTOM,
  },
  sectionTitle: { color: "#1f2937", fontSize: 18, fontWeight: "bold" },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 20 },
  rowLast: { paddingBottom: 20 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  rowContent: { flex: 1, marginRight: 8 },
  rowTitle: {
    color: "#1f2937",
    fontSize: FONT_SIZE.PROFILE_SECTION_ITEM_TITLE,
    fontWeight: "600",
    marginBottom: 2,
  },
  rowDesc: { color: "#6b7280", fontSize: FONT_SIZE.PROFILE_SECTION_ITEM_DESCRIPTION },
  divider: { height: 1, backgroundColor: COLORS.GRAY_LIGHT, marginHorizontal: 24 },
  themeRow: { flexDirection: "row", gap: 20 },
  themeCard: {
    flex: 1,
    height: 189,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.BORDER_GRAY,
    backgroundColor: "#ecfdf5",
    overflow: "hidden",
    padding: 12,
    justifyContent: "space-between",
  },
  themeCardSelected: { borderColor: COLORS.GRADIENT_CARD_START },
  themeCardDisabled: { opacity: 0.4 },
  themePreview: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    overflow: "hidden",
    height: 90,
  },
  themePreviewDark: { backgroundColor: "#1f2937", borderColor: "#374151" },
  themePreviewBar: { height: 18, width: "100%" },
  themePreviewBody: { padding: 8, gap: 6, flex: 1 },
  themePreviewBodyDark: { backgroundColor: "#1f2937" },
  themePreviewSkeleton: { height: 14, borderRadius: 4, backgroundColor: COLORS.GRAY_LIGHT },
  themePreviewSkeletonDark: { backgroundColor: "#374151" },
  themeCheckBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  themeCheckText: { color: COLORS.WHITE, fontSize: 14, fontWeight: "bold" },
  themeCardLabel: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  themeCardLabelText: { flex: 1 },
  themeCardTitle: { color: "#1f2937", fontSize: 12, fontWeight: "bold" },
  themeCardDesc: { color: "#6b7280", fontSize: 9, marginTop: 1 },
  langRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 20 },
  langRowSelected: { backgroundColor: "#ecfdf5" },
  flagBox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    backgroundColor: COLORS.GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  flagEmoji: { fontSize: 22 },
  langCheck: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  langCheckText: { color: COLORS.WHITE, fontSize: 16, fontWeight: "bold" },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  infoBannerEmoji: { fontSize: 20 },
  infoBannerText: { flex: 1, color: "#1e40af", fontSize: 14, lineHeight: 20 },
  dangerCard: { borderColor: "#fee2e2", backgroundColor: "#fff5f5", marginBottom: 10 },
  dangerIconBox: { backgroundColor: "#fee2e2" },
  deleteAccountCard: { borderColor: "#fecaca", backgroundColor: "#fef2f2", marginBottom: 10 },
  deleteAccountIconBox: { backgroundColor: "#fecaca" },
  rotateIcon: { transform: [{ rotate: "180deg" }] },
  bottomPadding: { height: 60 },
});