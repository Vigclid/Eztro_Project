import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, ChevronLeft, Globe, Mail, Moon, Sun } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
} from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";

// ─── Theme Card ───────────────────────────────────────────────────────────────

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
      {/* Mini UI preview */}
      <View style={[styles.themePreview, isDark && styles.themePreviewDark]}>
        <LinearGradient
          colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.themePreviewBar}
        />
        <View
          style={[
            styles.themePreviewBody,
            isDark && styles.themePreviewBodyDark,
          ]}
        >
          <View
            style={[
              styles.themePreviewSkeleton,
              isDark && styles.themePreviewSkeletonDark,
            ]}
          />
          <View
            style={[
              styles.themePreviewSkeleton,
              isDark && styles.themePreviewSkeletonDark,
            ]}
          />
        </View>
      </View>

      {/* Checkmark badge */}
      {selected && (
        <LinearGradient
          colors={["rgba(16,185,129,0.2)", "rgba(20,184,166,0.2)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.themeCheckBadge}
        >
          <Text style={styles.themeCheckText}>✓</Text>
        </LinearGradient>
      )}

      {/* Bottom label */}
      <View style={styles.themeCardLabel}>
        {isDark ? (
          <Moon size={20} color="#1f2937" />
        ) : (
          <Sun size={20} color="#1f2937" />
        )}
        <View style={styles.themeCardLabelText}>
          <Text style={styles.themeCardTitle}>
            {isDark ? "Chế độ tối" : "Chế độ sáng"}
          </Text>
          <Text style={styles.themeCardDesc}>
            {isDark ? "Dễ nhìn ban đêm" : "Dễ nhìn ban ngày"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const SettingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  return (
    <SafeAreaProvider style={styles.container}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
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
        {/* ── Giao diện ───────────────────────────────────────────────── */}
        <SectionHeader
          icon={<Sun size={24} color="#1f2937" />}
          title="Giao diện"
        />
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

        {/* ── Kênh thông báo ──────────────────────────────────────────── */}
        <SectionHeader
          icon={<Bell size={24} color="#1f2937" />}
          title="Kênh thông báo"
        />
        <View style={styles.card}>
          {/* Thông báo đẩy */}
          <View style={styles.row}>
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBox}
            >
              <Bell size={20} color={COLORS.WHITE} />
            </LinearGradient>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Thông báo đẩy</Text>
              <Text style={styles.rowDesc}>Nhận thông báo trên thiết bị</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{
                false: COLORS.BORDER_GRAY,
                true: COLORS.GRADIENT_CARD_START,
              }}
              thumbColor={COLORS.WHITE}
            />
          </View>
          <View style={styles.divider} />
          {/* Email */}
          <View style={[styles.row, styles.rowLast]}>
            <LinearGradient
              colors={["#f97316", "#ea580c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBox}
            >
              <Mail size={20} color={COLORS.WHITE} />
            </LinearGradient>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Email</Text>
              <Text style={styles.rowDesc}>Nhận thông báo qua email</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{
                false: COLORS.BORDER_GRAY,
                true: COLORS.GRADIENT_CARD_START,
              }}
              thumbColor={COLORS.WHITE}
            />
          </View>
        </View>

        {/* ── Ngôn ngữ ────────────────────────────────────────────────── */}
        <SectionHeader
          icon={<Globe size={24} color="#1f2937" />}
          title="Ngôn ngữ"
        />
        <View style={styles.card}>
          {/* Tiếng Việt */}
          <TouchableOpacity
            style={[
              styles.langRow,
              language === "vi" && styles.langRowSelected,
            ]}
            onPress={() => setLanguage("vi")}
            activeOpacity={0.8}
          >
            <View style={styles.flagBox}>
              <Text style={styles.flagEmoji}>🇻🇳</Text>
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Tiếng Việt</Text>
              <Text style={styles.rowDesc}>Vietnamese</Text>
            </View>
            {language === "vi" && (
              <LinearGradient
                colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.langCheck}
              >
                <Text style={styles.langCheckText}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
          <View style={styles.divider} />
          {/* English */}
          <TouchableOpacity
            style={[
              styles.langRow,
              styles.rowLast,
              language === "en" && styles.langRowSelected,
            ]}
            onPress={() => setLanguage("en")}
            activeOpacity={0.8}
          >
            <View style={styles.flagBox}>
              <Text style={styles.flagEmoji}>🇬🇧</Text>
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>English</Text>
              <Text style={styles.rowDesc}>Tiếng Anh</Text>
            </View>
            {language === "en" && (
              <LinearGradient
                colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.langCheck}
              >
                <Text style={styles.langCheckText}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerEmoji}>🌐</Text>
          <Text style={styles.infoBannerText}>
            Hỗ trợ đa ngôn ngữ sẽ có trong phiên bản tới
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaProvider>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PROFILE_BACKGROUND,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: SPACING.EXTRA_LARGE,
    paddingBottom: SPACING.MEDIUM,
    paddingHorizontal: SPACING.XL,
    height: SPACING.PROFILE_HEADER_HEIGHT,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.HEADER_TITLE,
    fontWeight: "bold",
  },
  headerPlaceholder: {
    width: 40,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.PROFILE_CARD_MARGIN_HORIZONTAL,
    paddingTop: SPACING.XL,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginTop: SPACING.PROFILE_WALLET_MARGIN_BOTTOM,
  },
  sectionTitle: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Card
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  rowLast: {
    paddingBottom: 20,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    color: "#1f2937",
    fontSize: FONT_SIZE.PROFILE_SECTION_ITEM_TITLE,
    fontWeight: "600",
    marginBottom: 2,
  },
  rowDesc: {
    color: "#6b7280",
    fontSize: FONT_SIZE.PROFILE_SECTION_ITEM_DESCRIPTION,
  },
  emojiIcon: {
    fontSize: 20,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY_LIGHT,
    marginHorizontal: 24,
  },

  // Theme section
  themeRow: {
    flexDirection: "row",
    gap: 20,
  },
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
  themeCardSelected: {
    borderColor: COLORS.GRADIENT_CARD_START,
  },
  themeCardDisabled: {
    opacity: 0.4,
    borderColor: COLORS.BORDER_GRAY,
  },
  themePreview: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    overflow: "hidden",
    height: 90,
  },
  themePreviewDark: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
  },
  themePreviewBar: {
    height: 18,
    width: "100%",
  },
  themePreviewBody: {
    padding: 8,
    gap: 6,
    flex: 1,
  },
  themePreviewBodyDark: {
    backgroundColor: "#1f2937",
  },
  themePreviewSkeleton: {
    height: 14,
    borderRadius: 4,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  themePreviewSkeletonDark: {
    backgroundColor: "#374151",
  },
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
  themeCheckText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: "bold",
  },
  themeCardLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  themeCardLabelText: {
    flex: 1,
  },
  themeCardTitle: {
    color: "#1f2937",
    fontSize: 12,
    fontWeight: "bold",
  },
  themeCardDesc: {
    color: "#6b7280",
    fontSize: 9,
    marginTop: 1,
  },

  // Language rows
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  langRowSelected: {
    backgroundColor: "#ecfdf5",
  },
  flagBox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    backgroundColor: COLORS.GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  flagEmoji: {
    fontSize: 22,
  },
  langCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  langCheckText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Info banner
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
  infoBannerEmoji: {
    fontSize: 20,
  },
  infoBannerText: {
    flex: 1,
    color: "#1e40af",
    fontSize: 14,
    lineHeight: 20,
  },

  // Join room card
  joinRoomCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.GRADIENT_CARD_START,
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 16,
  },
  joinRoomIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  joinRoomTitle: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },

  bottomPadding: {
    height: 40,
  },
});
