import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  aiInvoiceApi,
  getInvoiceApi,
  patchInvoiceApi,
} from "../../api/invoice/invoice";
import { getPaymentApi } from "../../api/payment/payment";
import { AppButton } from "../../components/misc/AppButton";
import { COLORS } from "../../constants/theme";
import { ApiResponse } from "../../types/app.common";
import { IInvoice } from "../../types/invoice";
import { IPayment } from "../../types/payment";

type Tab = "pending" | "history";
type AIStatus = "idle" | "checking" | "valid" | "invalid";

const PENDING_STATUS_LABEL: Record<string, string> = {
  "payment-processing": "CHỜ THANH TOÁN",
  "tenant-confirmed": "ĐÃ XÁC NHẬN",
};

// ─── Animated AI check overlay ───────────────────────────────────────────────
const AICheckOverlay: React.FC<{
  status: AIStatus;
  message: string;
}> = ({ status, message }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === "checking") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (status === "valid" || status === "invalid") {
      spinAnim.stopAnimation();
      pulseAnim.stopAnimation();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [status]);

  if (status === "idle") return null;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const bgColor =
    status === "checking"
      ? "rgba(0,0,0,0.55)"
      : status === "valid"
        ? "rgba(27,141,50,0.82)"
        : "rgba(198,40,40,0.82)";

  return (
    <Animated.View
      style={[
        styles.aiOverlay,
        { backgroundColor: bgColor, opacity: fadeAnim },
      ]}
    >
      {status === "checking" ? (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Animated.Text
            style={[styles.aiSpinner, { transform: [{ rotate: spin }] }]}
          >
            ⚙
          </Animated.Text>
          <Text style={styles.aiOverlayText}>AI đang kiểm tra...</Text>
        </Animated.View>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text style={styles.aiResultIcon}>
            {status === "valid" ? "✓" : "✕"}
          </Text>
          <Text style={styles.aiOverlayText}>{message}</Text>
        </View>
      )}
    </Animated.View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────
export const TenantInvoiceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<{
    invoiceId: string;
    uri: string;
    base64: string;
  } | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [aiMessage, setAiMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = (await getInvoiceApi.getMyInvoicesAsTenant()) as ApiResponse<
        IInvoice[]
      >;
      if (res.status === "success") setInvoices(res.data || []);
    } catch {}
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const res = (await getPaymentApi.getMyPaymentsAsTenant()) as ApiResponse<
        IPayment[]
      >;
      if (res.status === "success") setPayments(res.data || []);
    } catch {}
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchInvoices(), fetchPayments()]);
    setRefreshing(false);
  }, [fetchInvoices, fetchPayments]);

  useFocusEffect(
    useCallback(() => {
      fetchInvoices();
      fetchPayments();
    }, [fetchInvoices, fetchPayments]),
  );

  const formatCurrency = (amount: number | undefined) =>
    (amount || 0).toLocaleString("vi-VN") + " đ";

  // Pick image → read base64 → trigger AI check
  const pickImage = async (invoiceId: string, invoiceAmount: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });
    const base64String = `data:image/jpeg;base64,${base64}`;

    setPendingImage({ invoiceId, uri, base64: base64String });
    setAiStatus("idle");
    setAiMessage("");

    // Auto-trigger AI check
    runAICheck(base64String, invoiceAmount);
  };

  const runAICheck = async (base64String: string, invoiceAmount: number) => {
    setAiStatus("checking");
    try {
      const res = (await aiInvoiceApi.verifyTransactionImage(
        base64String,
        invoiceAmount,
      )) as ApiResponse<{
        isTransactionReceipt: boolean;
        amountMatches: boolean;
        message: string;
      }>;

      if (res.status === "success" && res.data) {
        const { isTransactionReceipt, amountMatches, message } = res.data;
        const valid = isTransactionReceipt && amountMatches;
        setAiStatus(valid ? "valid" : "invalid");
        setAiMessage(message);
      } else {
        setAiStatus("invalid");
        setAiMessage("Không thể xác minh ảnh");
      }
    } catch {
      setAiStatus("invalid");
      setAiMessage("Lỗi kiểm tra, vui lòng thử lại");
    }
  };

  const handleConfirm = async (invoiceId: string) => {
    // If AI flagged the image, warn the user before proceeding
    if (aiStatus === "invalid") {
      Alert.alert(
        "Cảnh báo từ AI",
        `${aiMessage}\n\nBạn vẫn muốn gửi xác nhận này?`,
        [
          { text: "Hủy", style: "cancel" },
          { text: "Vẫn gửi", onPress: () => doConfirm(invoiceId) },
        ],
      );
      return;
    }
    await doConfirm(invoiceId);
  };

  const doConfirm = async (invoiceId: string) => {
    setSubmitting(true);
    try {
      const base64String =
        pendingImage?.invoiceId === invoiceId
          ? pendingImage?.base64
          : undefined;

      const res = (await patchInvoiceApi.tenantConfirmInvoice(
        invoiceId,
        base64String,
      )) as ApiResponse<any>;

      if (res.status === "success") {
        Alert.alert("Thành công", "Xác nhận thanh toán thành công!");
        setPendingImage(null);
        setAiStatus("idle");
        setAiMessage("");
        await fetchInvoices();
      }
    } catch {
      Alert.alert("Lỗi", "Không thể xác nhận thanh toán");
    } finally {
      setSubmitting(false);
    }
  };

  const renderInvoiceBreakdown = (inv: IInvoice) => (
    <View style={styles.breakdown}>
      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Tiền phòng</Text>
        <Text style={styles.breakdownAmount}>
          {formatCurrency(inv.rentalFee ?? inv.roomId?.rentalFee)}
        </Text>
      </View>
      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Tiền điện</Text>
        <Text style={styles.breakdownAmount}>
          {formatCurrency(inv.electricityCharge)}
        </Text>
      </View>
      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Tiền nước</Text>
        <Text style={styles.breakdownAmount}>
          {formatCurrency(inv.waterCharge)}
        </Text>
      </View>
      {inv.utilities?.map((u: any, i: number) => (
        <View key={i} style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>{u.key}</Text>
          <Text style={styles.breakdownAmount}>{formatCurrency(u.value)}</Text>
        </View>
      ))}
    </View>
  );

  const renderPendingTab = () => (
    <ScrollView
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {invoices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có hóa đơn nào đang chờ thanh toán
          </Text>
        </View>
      ) : (
        invoices.map((inv) => {
          const isExpanded = expandedId === inv._id;
          const hasPending = pendingImage?.invoiceId === inv._id;
          const isPaymentProcessing = inv.status === "payment-processing";
          const showAI = hasPending && aiStatus !== "idle";

          // Confirm button state
          const confirmDisabled =
            submitting || (hasPending && aiStatus === "checking");
          const confirmTitle = submitting
            ? "Đang xử lý..."
            : aiStatus === "checking" && hasPending
              ? "Đang kiểm tra..."
              : "Xác nhận đã thanh toán";

          return (
            <View key={inv._id} style={styles.card}>
              {/* Card header */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setExpandedId(isExpanded ? null : (inv._id ?? null))
                }
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roomName}>
                      {inv.roomId?.roomName || "N/A"}
                    </Text>
                    <Text style={styles.houseNameSub}>
                      {inv.roomId?.houseId?.houseName || "Cơ sở nhà trọ"}
                    </Text>
                    <Text style={styles.dateText}>
                      Ngày tạo:{" "}
                      {inv.createDate
                        ? new Date(inv.createDate).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </Text>
                  </View>
                  <View
                    style={
                      inv.status === "tenant-confirmed"
                        ? styles.badgeConfirmed
                        : styles.badgePending
                    }
                  >
                    <Text
                      style={
                        inv.status === "tenant-confirmed"
                          ? styles.badgeConfirmedText
                          : styles.badgePendingText
                      }
                    >
                      {PENDING_STATUS_LABEL[inv.status ?? ""] ?? inv.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && renderInvoiceBreakdown(inv)}

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalAmount}>
                  {formatCurrency(inv.totalAmount)}
                </Text>
              </View>

              {/* Tenant action */}
              {isPaymentProcessing && (
                <View style={styles.actionArea}>
                  {/* Image picker with AI overlay */}
                  <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={() =>
                      pickImage(inv._id as string, inv.totalAmount ?? 0)
                    }
                    disabled={aiStatus === "checking" && hasPending}
                  >
                    {hasPending ? (
                      <View style={styles.imageWrapper}>
                        <Image
                          source={{ uri: pendingImage!.uri }}
                          style={styles.previewImage}
                          resizeMode="cover"
                        />
                        {showAI && (
                          <AICheckOverlay
                            status={aiStatus}
                            message={aiMessage}
                          />
                        )}
                      </View>
                    ) : inv.transactionImage ? (
                      <Image
                        source={{ uri: inv.transactionImage }}
                        style={styles.previewImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.uploadBtnText}>
                        Đính kèm ảnh chuyển khoản
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Re-check button shown when AI flagged invalid */}
                  {hasPending && aiStatus === "invalid" && (
                    <TouchableOpacity
                      style={styles.recheckBtn}
                      onPress={() =>
                        runAICheck(pendingImage!.base64, inv.totalAmount ?? 0)
                      }
                    >
                      <Text style={styles.recheckBtnText}>
                        Kiểm tra lại với AI
                      </Text>
                    </TouchableOpacity>
                  )}

                  <AppButton
                    title={confirmTitle}
                    disabled={confirmDisabled}
                    onPress={() => handleConfirm(inv._id as string)}
                  />
                </View>
              )}

              {/* Already confirmed */}
              {inv.status === "tenant-confirmed" && inv.transactionImage && (
                <View style={styles.confirmedImageArea}>
                  <Text style={styles.confirmedLabel}>
                    Ảnh chuyển khoản đã gửi:
                  </Text>
                  <Image
                    source={{ uri: inv.transactionImage }}
                    style={styles.confirmedImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có lịch sử thanh toán</Text>
        </View>
      ) : (
        payments.map((payment) => {
          const inv = payment.invoice;
          const isExpanded = expandedId === payment._id;

          return (
            <View key={payment._id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setExpandedId(isExpanded ? null : payment._id)}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roomName}>
                      {inv?.roomId?.roomName || "N/A"}
                    </Text>
                    <Text style={styles.houseNameSub}>
                      {inv?.roomId?.houseId?.houseName || "Cơ sở nhà trọ"}
                    </Text>
                    <Text style={styles.dateText}>
                      Thanh toán:{" "}
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.badgeCompleted}>
                    <Text style={styles.badgeCompletedText}>ĐÃ HOÀN THÀNH</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && inv && renderInvoiceBreakdown(inv)}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalAmount}>
                  {formatCurrency(inv?.totalAmount)}
                </Text>
              </View>

              {inv?.transactionImage && (
                <View style={styles.confirmedImageArea}>
                  <Text style={styles.confirmedLabel}>Ảnh chuyển khoản:</Text>
                  <Image
                    source={{ uri: inv.transactionImage }}
                    style={styles.confirmedImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Hóa đơn của tôi</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => {
            setActiveTab("pending");
            setExpandedId(null);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Chờ thanh toán
            {invoices.length > 0 && (
              <Text style={styles.tabBadge}> ({invoices.length})</Text>
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => {
            setActiveTab("history");
            setExpandedId(null);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "pending" ? renderPendingTab() : renderHistoryTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  tabContainer: {
    flexDirection: "row",
    margin: 15,
    marginBottom: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 10,
    padding: 3,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#FFF", elevation: 2 },
  tabText: { fontSize: 13, color: "#999", fontWeight: "bold" },
  activeTabText: { color: COLORS.GREEN_PRIMARY },
  tabBadge: { color: COLORS.GREEN_PRIMARY, fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: { fontSize: 15, color: "#999" },
  list: { paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 30 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  roomName: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  houseNameSub: { fontSize: 13, color: "#666", marginTop: 2 },
  dateText: { fontSize: 12, color: "#999", marginTop: 2 },
  badgePending: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePendingText: { color: "#1565C0", fontSize: 10, fontWeight: "bold" },
  badgeConfirmed: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeConfirmedText: { color: "#6A1B9A", fontSize: 10, fontWeight: "bold" },
  badgeCompleted: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCompletedText: { color: "#2E7D32", fontSize: 10, fontWeight: "bold" },
  breakdown: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breakdownLabel: { fontSize: 14, color: "#777" },
  breakdownAmount: { fontSize: 14, color: "#333", fontWeight: "500" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.GREEN_PRIMARY,
  },
  actionArea: { marginTop: 16, gap: 10 },
  uploadBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.GREEN_PRIMARY,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    overflow: "hidden",
  },
  uploadBtnText: {
    color: COLORS.GREEN_PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
  imageWrapper: { width: "100%", position: "relative" },
  previewImage: { width: "100%", height: 160, borderRadius: 8 },
  // AI overlay sits on top of the preview image
  aiOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  aiSpinner: { fontSize: 40, color: "#FFF", textAlign: "center" },
  aiOverlayText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 6,
    textAlign: "center",
  },
  aiResultIcon: { fontSize: 36, color: "#FFF", fontWeight: "bold" },
  recheckBtn: {
    borderWidth: 1,
    borderColor: "#E65100",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  recheckBtnText: { color: "#E65100", fontSize: 13, fontWeight: "600" },
  confirmedImageArea: { marginTop: 12 },
  confirmedLabel: { fontSize: 13, color: "#666", marginBottom: 6 },
  confirmedImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
});
