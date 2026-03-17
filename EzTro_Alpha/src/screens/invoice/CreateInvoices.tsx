import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getHouseApi } from "../../api/house/house";
import { getInvoiceApi, patchInvoiceApi } from "../../api/invoice/invoice";
import { AppButton } from "../../components/misc/AppButton";
import { COLORS } from "../../constants/theme";
import { ApiResponse } from "../../types/app.common";
import { IHouse } from "../../types/house";
import { IRoomInvoice } from "../../types/invoice";

interface UtilityEdit {
  key: string;
  value: string;
}

interface DraftEdit {
  currentElectricityNumber: string;
  currentWaterNumber: string;
  rentalFee: string;
  utilities: UtilityEdit[];
  dirty: boolean;
  saving: boolean;
}

const calcCosts = (
  edit: DraftEdit,
  electricityPrice: number,
  waterPrice: number,
  previousElec: number,
  previousWater: number,
): { electricityCost: number; waterCost: number; total: number } => {
  const elecNum = parseFloat(edit.currentElectricityNumber) || 0;
  const waterNum = parseFloat(edit.currentWaterNumber) || 0;
  const elecUsage = Math.max(elecNum - previousElec, 0);
  const waterUsage = Math.max(waterNum - previousWater, 0);
  const electricityCost = elecUsage * electricityPrice;
  const waterCost = waterUsage * waterPrice;
  const rentalFee = parseFloat(edit.rentalFee) || 0;
  const utilitiesCost = edit.utilities.reduce(
    (s, u) => s + (parseFloat(u.value) || 0),
    0,
  );
  const total = rentalFee + electricityCost + waterCost + utilitiesCost;
  return { electricityCost, waterCost, total };
};

const buildEditMap = (list: IRoomInvoice[]): Record<string, DraftEdit> => {
  const map: Record<string, DraftEdit> = {};
  list.forEach((inv) => {
    const key = (inv.invoiceId ?? inv._id) as string;
    map[key] = {
      currentElectricityNumber: String(
        inv.currentElectricityNumber ?? inv.previousElectricityNumber ?? 0,
      ),
      currentWaterNumber: String(
        inv.currentWaterNumber ?? inv.previousWaterNumber ?? 0,
      ),
      rentalFee: String(inv.rentalFee ?? 0),
      utilities: (inv.utilities ?? []).map((u) => ({
        key: u.key,
        value: String(u.value ?? 0),
      })),
      dirty: false,
      saving: false,
    };
  });
  return map;
};

export const CreateInvoices: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState({
    id: "all",
    name: "Tất cả nhà",
  });
  const [activePicker, setActivePicker] = useState<"house" | null>(null);
  const [drafts, setDrafts] = useState<IRoomInvoice[]>([]);
  const [editMap, setEditMap] = useState<Record<string, DraftEdit>>({});
  const [boardingHouses, setBoardingHouses] = useState<IHouse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { getProcessingInvoicesByHouse } = getInvoiceApi;
  const { getAllHousesByLandlordId } = getHouseApi;

  const fetchDrafts = useCallback(
    async (houses?: IHouse[]) => {
      const houseList = houses ?? boardingHouses;
      try {
        let list: IRoomInvoice[] = [];
        if (selectedHouse.id === "all") {
          const results = await Promise.all(
            houseList
              .filter((h) => h._id)
              .map((h) =>
                (
                  getProcessingInvoicesByHouse(h._id as string) as Promise<
                    ApiResponse<IRoomInvoice[]>
                  >
                )
                  .then((res) =>
                    res.status === "success" ? res.data || [] : [],
                  )
                  .catch(() => []),
              ),
          );
          list = results.flat();
        } else {
          const res = (await getProcessingInvoicesByHouse(
            selectedHouse.id,
          )) as ApiResponse<IRoomInvoice[]>;
          if (res.status === "success") list = res.data || [];
        }
        setDrafts(list);
        setEditMap(buildEditMap(list));
      } catch {}
    },
    [selectedHouse.id, boardingHouses, getProcessingInvoicesByHouse],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDrafts();
    setRefreshing(false);
  }, [fetchDrafts]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const res = (await getAllHousesByLandlordId()) as ApiResponse<
            IHouse[]
          >;
          const houses = res.status === "success" ? res.data || [] : [];
          setBoardingHouses(houses);
          await fetchDrafts(houses);
        } catch {}
      };
      load();
    }, [selectedHouse.id]),
  );

  const houseOptions = useMemo(() => {
    const list = boardingHouses.map((h) => ({ id: h._id, name: h.houseName }));
    return [{ id: "all", name: "Tất cả nhà" }, ...list];
  }, [boardingHouses]);

  const updateEdit = (
    key: string,
    field: keyof Omit<DraftEdit, "utilities" | "dirty" | "saving">,
    value: string,
  ) => {
    setEditMap((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value, dirty: true },
    }));
  };

  const updateUtility = (
    key: string,
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setEditMap((prev) => {
      const utils = [...(prev[key]?.utilities ?? [])];
      utils[index] = { ...utils[index], [field]: value };
      return {
        ...prev,
        [key]: { ...prev[key], utilities: utils, dirty: true },
      };
    });
  };

  const addUtility = (key: string) => {
    setEditMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        utilities: [...(prev[key]?.utilities ?? []), { key: "", value: "0" }],
        dirty: true,
      },
    }));
  };

  const removeUtility = (key: string, index: number) => {
    setEditMap((prev) => {
      const utils = (prev[key]?.utilities ?? []).filter((_, i) => i !== index);
      return {
        ...prev,
        [key]: { ...prev[key], utilities: utils, dirty: true },
      };
    });
  };

  const handleSave = async (inv: IRoomInvoice) => {
    const key = (inv.invoiceId ?? inv._id) as string;
    const edit = editMap[key];
    if (!edit) return;
    const { electricityCost, waterCost, total } = calcCosts(
      edit,
      inv.electricityPrice ?? 0,
      inv.waterPrice ?? 0,
      inv.previousElectricityNumber ?? 0,
      inv.previousWaterNumber ?? 0,
    );
    setEditMap((prev) => ({ ...prev, [key]: { ...prev[key], saving: true } }));
    try {
      await patchInvoiceApi.updateProcessingInvoice(key, {
        currentElectricityNumber:
          parseFloat(edit.currentElectricityNumber) || 0,
        currentWaterNumber: parseFloat(edit.currentWaterNumber) || 0,
        rentalFee: parseFloat(edit.rentalFee) || 0,
        electricityCharge: electricityCost,
        waterCharge: waterCost,
        utilities: edit.utilities.map((u) => ({
          key: u.key,
          value: parseFloat(u.value) || 0,
        })),
        totalAmount: total,
      });
      setEditMap((prev) => ({
        ...prev,
        [key]: { ...prev[key], dirty: false, saving: false },
      }));
    } catch {
      Alert.alert("Lỗi", "Không thể lưu hóa đơn");
      setEditMap((prev) => ({
        ...prev,
        [key]: { ...prev[key], saving: false },
      }));
    }
  };

  const handleFinalizeOne = async (inv: IRoomInvoice) => {
    const key = (inv.invoiceId ?? inv._id) as string;
    const edit = editMap[key];
    if (edit?.dirty) await handleSave(inv);
    Alert.alert(
      "Chốt hóa đơn",
      `Gửi hóa đơn phòng ${inv.roomName} cho khách thuê?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Chốt",
          onPress: async () => {
            try {
              await patchInvoiceApi.finalizeInvoices([key]);
              await fetchDrafts();
            } catch {
              Alert.alert("Lỗi", "Không thể chốt hóa đơn");
            }
          },
        },
      ],
    );
  };

  const handleFinalizeAll = () => {
    if (drafts.length === 0) return;
    Alert.alert("Chốt tất cả", `Gửi ${drafts.length} hóa đơn cho khách thuê?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Chốt tất cả",
        onPress: async () => {
          try {
            for (const inv of drafts) {
              const k = (inv.invoiceId ?? inv._id) as string;
              if (editMap[k]?.dirty) await handleSave(inv);
            }
            const ids = drafts.map(
              (inv) => (inv.invoiceId ?? inv._id) as string,
            );
            await patchInvoiceApi.finalizeInvoices(ids);
            await fetchDrafts();
          } catch {
            Alert.alert("Lỗi", "Không thể chốt hóa đơn");
          }
        },
      },
    ]);
  };

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("vi-VN") + " đ";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Soạn Hóa Đơn</Text>
      </LinearGradient>

      {/* House selector */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterCol}
          onPress={() => setActivePicker("house")}
        >
          <Text style={styles.filterLabel}>Nhà trọ</Text>
          <View style={styles.valueBox}>
            <Text style={styles.valueText} numberOfLines={1}>
              {selectedHouse.name}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      {drafts.length > 0 && (
        <TouchableOpacity
          style={styles.bulkFinalizeBtn}
          onPress={handleFinalizeAll}
        >
          <Text style={styles.bulkFinalizeBtnText}>
            Chốt tất cả ({drafts.length})
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {drafts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có hóa đơn đang soạn</Text>
          </View>
        ) : (
          drafts.map((inv) => {
            const key = (inv.invoiceId ?? inv._id) as string;
            const edit = editMap[key] ?? {
              currentElectricityNumber: "0",
              currentWaterNumber: "0",
              rentalFee: "0",
              utilities: [],
              dirty: false,
              saving: false,
            };
            const { electricityCost, waterCost, total } = calcCosts(
              edit,
              inv.electricityPrice ?? 0,
              inv.waterPrice ?? 0,
              inv.previousElectricityNumber ?? 0,
              inv.previousWaterNumber ?? 0,
            );
            const elecUsage = Math.max(
              (parseFloat(edit.currentElectricityNumber) || 0) -
                (inv.previousElectricityNumber ?? 0),
              0,
            );
            const waterUsage = Math.max(
              (parseFloat(edit.currentWaterNumber) || 0) -
                (inv.previousWaterNumber ?? 0),
              0,
            );

            return (
              <View key={key} style={styles.card}>
                {/* Card header */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roomName}>{inv.roomName}</Text>
                    <Text style={styles.tenantName}>
                      Khách: {inv.tenantName || "Chưa có"}
                    </Text>
                  </View>
                  <View style={styles.totalBadge}>
                    <Text style={styles.totalBadgeText}>
                      {formatCurrency(total)}
                    </Text>
                  </View>
                </View>

                {/* Room fee */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tiền phòng</Text>
                  <View style={styles.inlineInputRow}>
                    <TextInput
                      style={styles.inlineInput}
                      keyboardType="numeric"
                      value={edit.rentalFee}
                      onChangeText={(v) => updateEdit(key, "rentalFee", v)}
                    />
                    <Text style={styles.inlineUnit}>đ / tháng</Text>
                  </View>
                </View>

                {/* Electricity */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Điện</Text>
                  <View style={styles.meterRow}>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Số cũ</Text>
                      <Text style={styles.meterValue}>
                        {inv.previousElectricityNumber ?? 0}
                      </Text>
                    </View>
                    <Text style={styles.meterArrow}>→</Text>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Số mới</Text>
                      <TextInput
                        style={styles.meterInput}
                        keyboardType="numeric"
                        value={edit.currentElectricityNumber}
                        onChangeText={(v) =>
                          updateEdit(key, "currentElectricityNumber", v)
                        }
                      />
                    </View>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Dùng</Text>
                      <Text style={styles.meterValue}>{elecUsage} kWh</Text>
                    </View>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Thành tiền</Text>
                      <Text
                        style={[
                          styles.meterValue,
                          { color: COLORS.GREEN_PRIMARY },
                        ]}
                      >
                        {formatCurrency(electricityCost)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Water */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Nước</Text>
                  <View style={styles.meterRow}>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Số cũ</Text>
                      <Text style={styles.meterValue}>
                        {inv.previousWaterNumber ?? 0}
                      </Text>
                    </View>
                    <Text style={styles.meterArrow}>→</Text>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Số mới</Text>
                      <TextInput
                        style={styles.meterInput}
                        keyboardType="numeric"
                        value={edit.currentWaterNumber}
                        onChangeText={(v) =>
                          updateEdit(key, "currentWaterNumber", v)
                        }
                      />
                    </View>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Dùng</Text>
                      <Text style={styles.meterValue}>{waterUsage} m³</Text>
                    </View>
                    <View style={styles.meterField}>
                      <Text style={styles.meterLabel}>Thành tiền</Text>
                      <Text
                        style={[
                          styles.meterValue,
                          { color: COLORS.GREEN_PRIMARY },
                        ]}
                      >
                        {formatCurrency(waterCost)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Utilities */}
                <View style={styles.section}>
                  <View style={styles.utilitiesHeader}>
                    <Text style={styles.sectionTitle}>Dịch vụ khác</Text>
                    <TouchableOpacity
                      style={styles.addUtilBtn}
                      onPress={() => addUtility(key)}
                    >
                      <Text style={styles.addUtilBtnText}>+ Thêm</Text>
                    </TouchableOpacity>
                  </View>
                  {edit.utilities.length === 0 ? (
                    <Text style={styles.emptyUtils}>Không có dịch vụ</Text>
                  ) : (
                    edit.utilities.map((u, i) => (
                      <View key={i} style={styles.utilRow}>
                        <TextInput
                          style={[styles.utilInput, { flex: 2 }]}
                          placeholder="Tên dịch vụ"
                          value={u.key}
                          onChangeText={(v) => updateUtility(key, i, "key", v)}
                        />
                        <TextInput
                          style={[
                            styles.utilInput,
                            { flex: 1, textAlign: "right" },
                          ]}
                          placeholder="0"
                          keyboardType="numeric"
                          value={u.value}
                          onChangeText={(v) =>
                            updateUtility(key, i, "value", v)
                          }
                        />
                        <Text style={styles.utilUnit}>đ</Text>
                        <TouchableOpacity
                          style={styles.removeUtilBtn}
                          onPress={() => removeUtility(key, i)}
                        >
                          <Text style={styles.removeUtilBtnText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>

                {/* Total summary */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>
                  <Text style={styles.totalAmountText}>
                    {formatCurrency(total)}
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  {edit.dirty && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.saveBtn]}
                      onPress={() => handleSave(inv)}
                      disabled={edit.saving}
                    >
                      <Text style={styles.saveBtnText}>
                        {edit.saving ? "Đang lưu..." : "Lưu"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={{ flex: 1 }}>
                    <AppButton
                      title="Chốt & gửi khách"
                      onPress={() => handleFinalizeOne(inv)}
                    />
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* House picker modal */}
      <Modal
        visible={activePicker === "house"}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn Nhà</Text>
            <FlatList
              data={houseOptions}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedHouse(item as any);
                    setActivePicker(null);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
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
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  filterCol: {},
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

  bulkFinalizeBtn: {
    margin: 15,
    marginBottom: 0,
    backgroundColor: COLORS.GREEN_PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  bulkFinalizeBtnText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },

  list: { padding: 15, paddingTop: 12 },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: { fontSize: 15, color: "#999", textAlign: "center" },

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
    marginBottom: 14,
  },
  roomName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  tenantName: { fontSize: 13, color: "#666", marginTop: 3 },
  totalBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  totalBadgeText: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.GREEN_PRIMARY,
  },

  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#AAA",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  inlineInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  inlineInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1565C0",
    paddingVertical: 2,
  },
  inlineUnit: { fontSize: 13, color: "#AAA" },

  meterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  meterField: { flex: 1, alignItems: "center" },
  meterLabel: { fontSize: 10, color: "#AAA", marginBottom: 4 },
  meterValue: { fontSize: 13, fontWeight: "600", color: "#333" },
  meterArrow: { fontSize: 16, color: "#CCC", paddingHorizontal: 2 },
  meterInput: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1565C0",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1565C0",
    textAlign: "center",
    minWidth: 48,
    paddingVertical: 2,
  },

  utilitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  addUtilBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  addUtilBtnText: { fontSize: 12, fontWeight: "bold", color: "#1565C0" },
  emptyUtils: { fontSize: 13, color: "#CCC", fontStyle: "italic" },
  utilRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  utilInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: "#333",
  },
  utilUnit: { fontSize: 12, color: "#AAA" },
  removeUtilBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
  },
  removeUtilBtnText: { fontSize: 11, color: "#C62828", fontWeight: "bold" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  totalAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.GREEN_PRIMARY,
  },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  saveBtn: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#1565C0",
  },
  saveBtnText: { fontSize: 14, fontWeight: "bold", color: "#1565C0" },

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
