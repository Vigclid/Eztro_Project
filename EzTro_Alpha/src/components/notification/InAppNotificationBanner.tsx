import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  CreditCard,
  Megaphone,
  MessageCircle,
  Receipt,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { COLORS } from "../../constants/theme";
import { INotification } from "../../features/notification/types";
import { navigate } from "../../navigation/navigationService";
import { RootState } from "../../stores/store";

// ─── Display helper (mirrors NotificationScreen) ─────────────────────
function getDisplay(notif: INotification) {
  const { type, metadata } = notif;
  switch (type) {
    case "LANDLORD_INVOICE":
      return {
        title: "Hóa đơn mới",
        body: "Bạn có hóa đơn mới từ chủ trọ.",
        gradient: ["#51A2FF", "#615FFF"] as [string, string],
        Icon: Receipt,
      };
    case "PAYMENT_DUE":
      return {
        title: "Nhắc nhở thanh toán",
        body: `Hóa đơn sắp đến hạn${metadata.dueDate ? ": " + metadata.dueDate : ""}. Vui lòng thanh toán sớm.`,
        gradient: ["#51A2FF", "#615FFF"] as [string, string],
        Icon: CreditCard,
      };
    case "PAYMENT_RECEIVED":
      return {
        title: "Thanh toán thành công",
        body: "Hóa đơn đã được thanh toán thành công.",
        gradient: ["#51A2FF", "#615FFF"] as [string, string],
        Icon: CreditCard,
      };
    case "LANDLORD_BROADCAST":
      return {
        title: "Thông báo từ chủ trọ",
        body: metadata.message ?? "Bạn có thông báo mới từ chủ trọ.",
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
        title: "Thông báo mới",
        body: "",
        gradient: ["#99A1AF", "#62748E"] as [string, string],
        Icon: Bell,
      };
  }
}

const BANNER_DURATION = 4500; // ms before auto-dismiss

// ─── Component ────────────────────────────────────────────────────────
export const InAppNotificationBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications,
  );

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<INotification | null>(null);

  // Tracks whether the initial notification load has been processed
  const hasInitializedRef = useRef(false);
  const prevFirstIdRef = useRef<string | undefined>(undefined);

  // Animations
  const translateY = useRef(new Animated.Value(-160)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<Animated.CompositeAnimation | null>(null);

  const slideIn = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 9,
    }).start();
  };

  const slideOut = (onDone?: () => void) => {
    Animated.timing(translateY, {
      toValue: -160,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setCurrent(null);
      onDone?.();
    });
  };

  const startProgress = () => {
    progressAnim.setValue(1);
    progressTimer.current = Animated.timing(progressAnim, {
      toValue: 0,
      duration: BANNER_DURATION,
      useNativeDriver: false,
    });
    progressTimer.current.start();
  };

  const scheduleAutoDismiss = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => slideOut(), BANNER_DURATION);
  };

  const showBanner = (notif: INotification) => {
    // Cancel any in-flight dismiss
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    progressTimer.current?.stop();

    setCurrent(notif);
    setVisible(true);
    slideIn();
    startProgress();
    scheduleAutoDismiss();
  };

  // Watch for new incoming notifications
  useEffect(() => {
    const first = notifications[0];

    if (!first) {
      // No notifications yet — mark as uninitialized
      hasInitializedRef.current = false;
      prevFirstIdRef.current = undefined;
      return;
    }

    if (!hasInitializedRef.current) {
      // First batch loaded (initial fetch on socket connect) — skip toast
      hasInitializedRef.current = true;
      prevFirstIdRef.current = first._id;
      return;
    }

    if (first._id !== prevFirstIdRef.current) {
      // A brand-new notification arrived via socket
      prevFirstIdRef.current = first._id;
      showBanner(first);
    }
  }, [notifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      progressTimer.current?.stop();
    };
  }, []);

  const handleTap = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    progressTimer.current?.stop();
    slideOut(() => {
      navigate("mainstack", { screen: "notificationScreen" });
    });
  };

  const handleDismiss = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    progressTimer.current?.stop();
    slideOut();
  };

  if (!visible || !current) return null;

  const { title, body, gradient, Icon } = getDisplay(current);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + (Platform.OS === "android" ? 8 : 4),
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={handleTap} style={styles.inner}>
        {/* Icon */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrap}
        >
          <Icon size={22} color="#fff" />
        </LinearGradient>

        {/* Text */}
        <View style={styles.textWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!!body && (
            <Text style={styles.body} numberOfLines={2}>
              {body}
            </Text>
          )}
        </View>

        {/* Dismiss */}
        <TouchableOpacity
          onPress={handleDismiss}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          style={styles.closeBtn}
        >
          <X size={16} color="#6A7282" />
        </TouchableOpacity>
      </Pressable>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: gradient[0],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
  },
  body: {
    fontSize: 13,
    color: "#4A5565",
    lineHeight: 18,
  },
  closeBtn: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressTrack: {
    height: 3,
    backgroundColor: COLORS.BORDER_GRAY,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },
});
