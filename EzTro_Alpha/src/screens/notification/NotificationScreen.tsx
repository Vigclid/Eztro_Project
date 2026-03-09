import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  ChevronLeft,
  CreditCard,
  Megaphone,
  MessageCircle,
  Receipt,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants/theme";
import {
  markAllReadAsync,
  markReadAsync,
  removeNotification,
} from "../../features/notification/notificationSlice";
import { INotification } from "../../features/notification/types";
import { NavigationProp } from "../../navigation/navigation.type";
import { AppDispatch, RootState } from "../../stores/store";

// ─── Category + Priority ─────────────────────────────────────────────
type Category =
  | "all"
  | "payment"
  | "maintenance"
  | "contract"
  | "room"
  | "tenant";
type Priority = "all" | "urgent" | "important" | "medium" | "low";

const CATEGORY_MAP: Record<string, Category> = {
  LANDLORD_INVOICE: "payment",
  PAYMENT_DUE: "payment",
  PAYMENT_RECEIVED: "payment",
  LANDLORD_BROADCAST: "all",
  LANDLORD_RULE_UPDATE: "all",
  SYSTEM_ANNOUNCEMENT: "all",
  SYSTEM_MAINTENANCE: "all",
  INTERACTION_COMMENT: "maintenance",
  INTERACTION_LIKE: "maintenance",
  INTERACTION_MENTION: "maintenance",
};

const PRIORITY_MAP: Record<string, Priority> = {
  PAYMENT_DUE: "urgent",
  LANDLORD_INVOICE: "important",
  LANDLORD_RULE_UPDATE: "important",
  LANDLORD_BROADCAST: "medium",
  INTERACTION_COMMENT: "medium",
  PAYMENT_RECEIVED: "low",
  INTERACTION_LIKE: "low",
  SYSTEM_ANNOUNCEMENT: "low",
  SYSTEM_MAINTENANCE: "low",
};

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; bg: string; border: string; text: string }
> = {
  all: { label: "Tất cả", bg: "#F9FAFB", border: "#E5E7EB", text: "#4A5565" },
  urgent: {
    label: "Khẩn cấp",
    bg: "#FEF2F2",
    border: "#FFC9C9",
    text: "#E7000B",
  },
  important: {
    label: "Quan trọng",
    bg: "#FFF7ED",
    border: "#FFD6A8",
    text: "#F54900",
  },
  medium: {
    label: "Trung bình",
    bg: "#FEFCE8",
    border: "#FFF085",
    text: "#D08700",
  },
  low: { label: "Thấp", bg: "#F9FAFB", border: "#E5E7EB", text: "#4A5565" },
};

// ─── Display helpers ──────────────────────────────────────────────────
function getNotificationDisplay(notif: INotification) {
  const { type, metadata } = notif;
  switch (type) {
    case "LANDLORD_INVOICE":
      return {
        title: "Hóa đơn mới",
        body: `Bạn có hóa đơn mới cho ${metadata.roomId ?? "phòng của bạn"}. Tổng: ${formatVND(metadata.amount)}`,
        gradient: ["#51A2FF", "#615FFF"] as [string, string],
        Icon: Receipt,
      };
    case "PAYMENT_DUE":
      return {
        title: "Nhắc nhở thanh toán",
        body: `Hóa đơn sẽ quá hạn vào ${metadata.dueDate ?? ""}. Vui lòng thanh toán sớm để tránh phí phạt.`,
        gradient: ["#51A2FF", "#615FFF"] as [string, string],
        Icon: CreditCard,
      };
    case "PAYMENT_RECEIVED":
      return {
        title: "Thanh toán thành công",
        body: `Đã thanh toán hóa đơn thành công. Số tiền: ${formatVND(metadata.amount)}`,
        gradient: ["#51A2FF", "#615FFF"] as [string, string],
        Icon: CreditCard,
      };
    case "LANDLORD_BROADCAST":
      return {
        title: "Thông báo từ chủ trọ",
        body: metadata.message ?? "",
        gradient: ["#FFB900", "#FF6900"] as [string, string],
        Icon: Megaphone,
      };
    case "LANDLORD_RULE_UPDATE":
      return {
        title: "Cập nhật nội quy",
        body: metadata.message ?? "Nội quy nhà trọ vừa được cập nhật.",
        gradient: ["#FFB900", "#FF6900"] as [string, string],
        Icon: Megaphone,
      };
    case "INTERACTION_COMMENT":
      return {
        title: "Bình luận mới",
        body: metadata.preview ?? "Ai đó vừa bình luận vào bài viết của bạn.",
        gradient: ["#C27AFF", "#F6339A"] as [string, string],
        Icon: MessageCircle,
      };
    case "INTERACTION_LIKE":
    case "INTERACTION_MENTION":
      return {
        title: "Tương tác mới",
        body: metadata.preview ?? "Ai đó vừa tương tác với bài viết của bạn.",
        gradient: ["#C27AFF", "#F6339A"] as [string, string],
        Icon: MessageCircle,
      };
    case "SYSTEM_ANNOUNCEMENT":
    case "SYSTEM_MAINTENANCE":
      return {
        title:
          type === "SYSTEM_MAINTENANCE"
            ? "Bảo trì hệ thống"
            : "Thông báo hệ thống",
        body: metadata.message ?? "",
        gradient: ["#99A1AF", "#62748E"] as [string, string],
        Icon: Bell,
      };
    default:
      return {
        title: "Thông báo",
        body: "",
        gradient: ["#99A1AF", "#62748E"] as [string, string],
        Icon: Bell,
      };
  }
}

function formatVND(amount?: number): string {
  if (!amount) return "";
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

// ─── Filter tab config ────────────────────────────────────────────────
const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "payment", label: "Thanh toán" },
  { key: "maintenance", label: "Bảo trì" },
  { key: "contract", label: "Hợp đồng" },
  { key: "room", label: "Phòng" },
  { key: "tenant", label: "Khách thuê" },
];

const PRIORITY_TABS: { key: Priority; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "urgent", label: "Khẩn cấp" },
  { key: "important", label: "Quan trọng" },
  { key: "medium", label: "Trung bình" },
  { key: "low", label: "Thấp" },
];

// ─── Notification Detail Modal ────────────────────────────────────────
const NotificationDetailModal = ({
  notif,
  onClose,
  onDelete,
}: {
  notif: INotification | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) => {
  if (!notif) return null;
  const { title, body, gradient, Icon } = getNotificationDisplay(notif);
  const priority = PRIORITY_MAP[notif.type] ?? "low";
  const pCfg = PRIORITY_CONFIG[priority];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          {/* Icon */}
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalIcon}
          >
            <Icon size={32} color="#fff" />
          </LinearGradient>

          {/* Title + time */}
          <View style={styles.modalTitleRow}>
            <Text style={styles.modalTitle}>{title}</Text>
            {notif.status === "unread" && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.modalTime}>{timeAgo(notif.sendAt)}</Text>

          {/* Body */}
          <ScrollView
            style={styles.modalBodyScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalBody}>{body}</Text>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: pCfg.bg, borderColor: pCfg.border },
              ]}
            >
              <Text style={[styles.priorityText, { color: pCfg.text }]}>
                {pCfg.label}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                onDelete(notif._id);
                onClose();
              }}
            >
              <Trash2 size={14} color="#E7000B" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Notification Card ────────────────────────────────────────────────
const NotificationCard = ({
  notif,
  onDelete,
  onPress,
}: {
  notif: INotification;
  onDelete: (id: string) => void;
  onPress: (notif: INotification) => void;
}) => {
  const { title, body, gradient, Icon } = getNotificationDisplay(notif);
  const priority = PRIORITY_MAP[notif.type] ?? "low";
  const pCfg = PRIORITY_CONFIG[priority];
  const isUnread = notif.status === "unread";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(notif)}
      style={[styles.card, isUnread && styles.cardUnread]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardIcon}
      >
        <Icon size={22} color="#fff" />
      </LinearGradient>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {title}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.cardTime}>{timeAgo(notif.sendAt)}</Text>
        </View>

        <Text style={styles.cardBody} numberOfLines={2}>
          {body}
        </Text>

        <View style={styles.cardFooter}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: pCfg.bg, borderColor: pCfg.border },
            ]}
          >
            <Text style={[styles.priorityText, { color: pCfg.text }]}>
              {pCfg.label}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(notif._id);
            }}
          >
            <Trash2 size={14} color="#E7000B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────
export const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // ── Redux state ──────────────────────────────────────────────────────
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification,
  );

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activePriority, setActivePriority] = useState<Priority>("all");

  const getCategoryCount = (key: Category) =>
    key === "all"
      ? unreadCount
      : notifications.filter(
          (n) => CATEGORY_MAP[n.type] === key && n.status === "unread",
        ).length;

  const filtered = notifications.filter((n) => {
    const catMatch =
      activeCategory === "all" || CATEGORY_MAP[n.type] === activeCategory;
    const prioMatch =
      activePriority === "all" || PRIORITY_MAP[n.type] === activePriority;
    return catMatch && prioMatch;
  });

  const unread = filtered.filter((n) => n.status === "unread");
  const read = filtered.filter((n) => n.status === "read");

  const [selectedNotif, setSelectedNotif] = useState<INotification | null>(
    null,
  );

  const handleDelete = (id: string) => dispatch(removeNotification(id));
  const handleMarkAllRead = () => dispatch(markAllReadAsync());

  const handleCardPress = (notif: INotification) => {
    if (notif.status === "unread") dispatch(markReadAsync(notif._id));
    setSelectedNotif(notif);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Thông báo{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllRead}>
          <Text style={styles.readAllText}>Đọc tất cả</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* ── Category tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabRow}
          contentContainerStyle={styles.tabRowContent}
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.key;
            const count = getCategoryCount(tab.key);
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.categoryTab,
                  isActive && styles.categoryTabActive,
                ]}
                onPress={() => setActiveCategory(tab.key)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    isActive && styles.categoryTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      styles.countBadge,
                      isActive && styles.countBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countText,
                        isActive && styles.countTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Priority tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabRow}
          contentContainerStyle={styles.tabRowContent}
        >
          {PRIORITY_TABS.map((tab) => {
            const isActive = activePriority === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.priorityTab,
                  isActive && styles.priorityTabActive,
                ]}
                onPress={() => setActivePriority(tab.key)}
              >
                <Text
                  style={[
                    styles.priorityTabText,
                    isActive && styles.priorityTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Unread section ── */}
        {unread.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chưa đọc</Text>
            {unread.map((n) => (
              <NotificationCard
                key={n._id}
                notif={n}
                onDelete={handleDelete}
                onPress={handleCardPress}
              />
            ))}
          </View>
        )}

        {/* ── Read section ── */}
        {read.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đã đọc</Text>
            {read.map((n) => (
              <NotificationCard
                key={n._id}
                notif={n}
                onDelete={handleDelete}
                onPress={handleCardPress}
              />
            ))}
          </View>
        )}

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={48} color={COLORS.BORDER_GRAY} />
            <Text style={styles.emptyText}>Không có thông báo nào</Text>
          </View>
        )}

        <View style={{ height: 96 }} />
      </ScrollView>

      <NotificationDetailModal
        notif={selectedNotif}
        onClose={() => setSelectedNotif(null)}
        onDelete={handleDelete}
      />
    </SafeAreaProvider>
  );
};

export default NotificationScreen;

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_GRAY },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  readAllBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readAllText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // Tabs
  body: { flex: 1 },
  tabRow: { marginTop: 16 },
  tabRowContent: { paddingHorizontal: 16, gap: 8 },

  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    backgroundColor: COLORS.WHITE,
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: COLORS.GRADIENT_START,
    borderColor: COLORS.GRADIENT_START,
  },
  categoryTabText: { fontSize: 14, fontWeight: "600", color: "#4A5565" },
  categoryTabTextActive: { color: "#fff" },
  countBadge: {
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countBadgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  countText: { fontSize: 12, fontWeight: "bold", color: "#4A5565" },
  countTextActive: { color: "#fff" },

  priorityTab: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    backgroundColor: COLORS.WHITE,
  },
  priorityTabActive: {
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_PRIMARY,
  },
  priorityTabText: { fontSize: 14, fontWeight: "600", color: "#4A5565" },
  priorityTabTextActive: { color: COLORS.GREEN_PRIMARY },

  // Section
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101828",
    marginBottom: 12,
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 14,
  },
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.GRADIENT_START,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
    marginRight: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#101828", flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.GRADIENT_START,
    flexShrink: 0,
  },
  cardTime: { fontSize: 12, color: "#6A7282", flexShrink: 0 },
  cardBody: {
    fontSize: 14,
    color: "#4A5565",
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.3,
  },
  priorityText: { fontSize: 12, fontWeight: "bold" },
  deleteBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.PLACEHOLDER_GRAY },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101828",
    flex: 1,
  },
  modalTime: { fontSize: 13, color: "#6A7282" },
  modalBodyScroll: { maxHeight: 200 },
  modalBody: { fontSize: 15, color: "#4A5565", lineHeight: 22 },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
