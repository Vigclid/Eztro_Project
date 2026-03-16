import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getHouseApi } from "../../api/house/house";
import { getInvoiceApi, patchInvoiceApi } from "../../api/invoice/invoice";
import { AppButton } from "../../components/misc/AppButton";
import { COLORS } from "../../constants/theme";
import { ApiResponse } from "../../types/app.common";
import { IHouse } from "../../types/house";
import { IInvoice, InvoiceStatus } from "../../types/invoice";

// Must be declared before STATUS_CONFIG
const badgeStyles = StyleSheet.create({
  processing: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  processingText: { color: "#E65100", fontSize: 10, fontWeight: "bold" },
  paymentProcessing: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentProcessingText: { color: "#1565C0", fontSize: 10, fontWeight: "bold" },
  tenantConfirmed: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tenantConfirmedText: { color: "#6A1B9A", fontSize: 10, fontWeight: "bold" },
  completed: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: { color: "#2E7D32", fontSize: 10, fontWeight: "bold" },
});

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; badgeStyle: any; textStyle: any }
> = {
  processing: {
    label: "ĐANG SOẠN",
    badgeStyle: badgeStyles.processing,
    textStyle: badgeStyles.processingText,
  },
  "payment-processing": {
    label: "CHỜ THANH TOÁN",
    badgeStyle: badgeStyles.paymentProcessing,
    textStyle: badgeStyles.paymentProcessingText,
  },
  "tenant-confirmed": {
    label: "CẦN XÁC NHẬN",
    badgeStyle: badgeStyles.tenantConfirmed,
    textStyle: badgeStyles.tenantConfirmedText,
  },
  completed: {
    label: "ĐÃ THU",
    badgeStyle: badgeStyles.completed,
    textStyle: badgeStyles.completedText,
  },
};

export const TrackingInvoiceStatus: React.FC = () => {
  const now = new Date();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHouse, setSelectedHouse] = useState({
    id: "all",
    name: "Tất cả nhà",
  });
  const [selMonth, setSelMonth] = useState<number | null>(now.getMonth() + 1);
  const [selYear, setSelYear] = useState<number | null>(now.getFullYear());
  const [activePicker, setActivePicker] = useState<
    "house" | "month" | "year" | null
  >(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(
    null,
  );
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [boardingHouses, setBoardingHouses] = useState<IHouse[]>([]);

  const { getInvoicesByFilter } = getInvoiceApi;
  const { getAllHousesByLandlordId } = getHouseApi;

  const fetchInvoices = useCallback(async () => {
    try {
      const filterBody = {
        houseId: selectedHouse.id !== "all" ? selectedHouse.id : undefined,
        month: selMonth || undefined,
        year: selYear || undefined,
      };
      const res = (await getInvoicesByFilter(filterBody)) as ApiResponse<
        IInvoice[]
      >;
      if (res.status === "success") setInvoices(res.data || []);
    } catch (err) {}
  }, [selectedHouse.id, selMonth, selYear, getInvoicesByFilter]);

  useFocusEffect(
    useCallback(() => {
      const getAllHouses = async () => {
        try {
          const res = (await getAllHousesByLandlordId()) as ApiResponse<
            IHouse[]
          >;
          if (res.status === "success") setBoardingHouses(res.data || []);
        } catch (err) {}
      };
      getAllHouses();
    }, [getAllHousesByLandlordId]),
  );

  useFocusEffect(
    useCallback(() => {
      fetchInvoices();
    }, [fetchInvoices]),
  );

  const houseOptions = useMemo(() => {
    const list = boardingHouses.map((h) => ({ id: h._id, name: h.houseName }));
    return [{ id: "all", name: "Tất cả nhà" }, ...list];
  }, [boardingHouses]);

  const months = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const years = [
    null,
    now.getFullYear(),
    now.getFullYear() - 1,
    now.getFullYear() - 2,
  ];

  const displayInvoices = useMemo(() => {
    if (statusFilter === "all") return invoices;
    if (statusFilter === "paid")
      return invoices.filter((inv) => inv.status === "completed");
    return invoices.filter((inv) => inv.status !== "completed");
  }, [invoices, statusFilter]);

  const processingIds = useMemo(
    () =>
      displayInvoices
        .filter((inv) => inv.status === "processing")
        .map((inv) => inv._id as string),
    [displayInvoices],
  );

  const formatCurrency = (amount: number | undefined) =>
    (amount || 0).toLocaleString("vi-VN") + " đ";

  const handleFinalizeOne = async (invoiceId: string) => {
    try {
      await patchInvoiceApi.finalizeInvoices([invoiceId]);
      await fetchInvoices();
    } catch {
      Alert.alert("Lỗi", "Không thể chốt hóa đơn");
    }
  };

  const handleFinalizeAll = () => {
    if (processingIds.length === 0) return;
    Alert.alert(
      "Chốt hóa đơn hàng loạt",
      `Chốt ${processingIds.length} hóa đơn đang soạn?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Chốt tất cả",
          onPress: async () => {
            try {
              await patchInvoiceApi.finalizeInvoices(processingIds);
              await fetchInvoices();
            } catch {
              Alert.alert("Lỗi", "Không thể chốt hóa đơn");
            }
          },
        },
      ],
    );
  };

  const handleAccept = (invoiceId: string) => {
    Alert.alert("Xác nhận thu tiền", "Bạn đã nhận được tiền từ khách thuê?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xác nhận",
        onPress: async () => {
          try {
            await patchInvoiceApi.landlordAcceptInvoice(invoiceId);
            await fetchInvoices();
          } catch {
            Alert.alert("Lỗi", "Không thể xác nhận hóa đơn");
          }
        },
      },
    ]);
  };

  const renderBadge = (status: InvoiceStatus | undefined) => {
    if (!status || !STATUS_CONFIG[status]) return null;
    const { label, badgeStyle, textStyle } = STATUS_CONFIG[status];
    return (
      <View style={badgeStyle}>
        <Text style={textStyle}>{label}</Text>
      </View>
    );
  };

  const FilterColumn = ({ label, value, onPress }: any) => (
    <TouchableOpacity style={styles.filterCol} onPress={onPress}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.valueBox}>
        <Text style={styles.valueText} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Quản lý Thu Chi Phòng</Text>
      </LinearGradient>

      <View style={styles.filterRow}>
        <FilterColumn
          label="Nhà trọ"
          value={selectedHouse.name}
          onPress={() => setActivePicker("house")}
        />
        <FilterColumn
          label="Tháng"
          value={selMonth === null ? "Tất cả" : `Tháng ${selMonth}`}
          onPress={() => setActivePicker("month")}
        />
        <FilterColumn
          label="Năm"
          value={selYear === null ? "Tất cả" : selYear}
          onPress={() => setActivePicker("year")}
        />
      </View>

      <View style={styles.tabContainer}>
        {["all", "unpaid", "paid"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, statusFilter === t && styles.activeTab]}
            onPress={() => setStatusFilter(t)}
          >
            <Text
              style={[
                styles.tabText,
                statusFilter === t && styles.activeTabText,
              ]}
            >
              {t === "all" ? "Tất cả" : t === "paid" ? "Đã thu" : "Chưa thu"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {processingIds.length > 0 && statusFilter !== "paid" && (
        <TouchableOpacity
          style={styles.bulkFinalizeBtn}
          onPress={handleFinalizeAll}
        >
          <Text style={styles.bulkFinalizeBtnText}>
            Chốt tất cả đang soạn ({processingIds.length})
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {displayInvoices.map((inv) => {
          const isExpanded = expandedInvoiceId === inv._id;
          return (
            <View key={inv._id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setExpandedInvoiceId(isExpanded ? null : (inv._id ?? null))
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
                    <Text style={styles.rentalDateText}>
                      Ngày tạo:{" "}
                      {inv.createDate
                        ? new Date(inv.createDate).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </Text>
                  </View>
                  {renderBadge(inv.status)}
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <>
                  <View style={styles.breakdownList}>
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
                    {inv.utilities?.map((u: any, index: number) => (
                      <View key={index} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>{u.key}</Text>
                        <Text style={styles.breakdownAmount}>
                          {formatCurrency(u.value)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng cộng</Text>
                    <Text style={styles.totalAmountText}>
                      {formatCurrency(inv.totalAmount)}
                    </Text>
                  </View>

                  {inv.transactionImage && (
                    <View style={styles.transactionImageContainer}>
                      <Text style={styles.transactionImageLabel}>
                        Ảnh chuyển khoản:
                      </Text>
                      <Image
                        source={{ uri: inv.transactionImage }}
                        style={styles.transactionImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </>
              )}

              {inv.status === "processing" && (
                <View style={styles.actionButtonContainer}>
                  <AppButton
                    title="Chốt hóa đơn"
                    onPress={() => handleFinalizeOne(inv._id as string)}
                  />
                </View>
              )}
              {inv.status === "tenant-confirmed" && (
                <View style={styles.actionButtonContainer}>
                  <AppButton
                    title="Xác nhận đã thu tiền"
                    onPress={() => handleAccept(inv._id as string)}
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!activePicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Chọn{" "}
              {activePicker === "house"
                ? "Nhà"
                : activePicker === "month"
                  ? "Tháng"
                  : "Năm"}
            </Text>
            <FlatList
              data={
                (activePicker === "house"
                  ? houseOptions
                  : activePicker === "month"
                    ? months
                    : years) as any[]
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    if (activePicker === "house") setSelectedHouse(item);
                    if (activePicker === "month") setSelMonth(item);
                    if (activePicker === "year") setSelYear(item);
                    setActivePicker(null);
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {activePicker === "house"
                      ? item.name
                      : item === null
                        ? "Tất cả"
                        : activePicker === "month"
                          ? `Tháng ${item}`
                          : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  filterRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    justifyContent: "space-between",
  },
  filterCol: { flex: 1, paddingHorizontal: 5 },
  filterLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "bold",
    marginBottom: 4,
  },
  valueBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  valueText: { fontSize: 13, color: "#333", fontWeight: "600", flex: 1 },
  arrow: { fontSize: 10, color: "#CCC" },
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
  bulkFinalizeBtn: {
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: COLORS.GREEN_PRIMARY,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  bulkFinalizeBtnText: { color: "#FFF", fontSize: 13, fontWeight: "bold" },
  list: { paddingHorizontal: 15, paddingBottom: 20 },
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
  rentalDateText: { fontSize: 12, color: "#999", marginTop: 2 },
  breakdownList: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    marginTop: 12,
    marginBottom: 15,
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
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.GREEN_PRIMARY,
  },
  transactionImageContainer: { marginTop: 12 },
  transactionImageLabel: { fontSize: 13, color: "#666", marginBottom: 6 },
  transactionImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  actionButtonContainer: { marginTop: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "80%",
    maxHeight: "60%",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalItemText: { fontSize: 15, color: "#444", textAlign: "center" },
});
