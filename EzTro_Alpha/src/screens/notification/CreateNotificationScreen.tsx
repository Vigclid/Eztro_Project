import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  DoorOpen,
  Home,
  Megaphone,
  ScrollText,
  Send,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getHouseApi } from "../../api/house/house";
import { sendNotificationApi } from "../../api/notification/notification";
import { getRoomApi } from "../../api/room/room";
import { COLORS } from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";
import { IHouse } from "../../types/house";
import { IRoom, IRoomMember } from "../../types/room";
import { IUser } from "../../types/users";

// ─── Types ────────────────────────────────────────────────────────────
type NotifType = "LANDLORD_BROADCAST" | "LANDLORD_RULE_UPDATE";
type TargetScope = "landlord-all" | "house" | "room" | "tenant";

// ─── Config ───────────────────────────────────────────────────────────
const NOTIF_TYPES: { value: NotifType; label: string; desc: string }[] = [
  {
    value: "LANDLORD_BROADCAST",
    label: "Thông báo chung",
    desc: "Gửi tin nhắn hoặc thông tin tới người thuê",
  },
  {
    value: "LANDLORD_RULE_UPDATE",
    label: "Cập nhật nội quy",
    desc: "Thông báo thay đổi nội quy nhà trọ",
  },
];

const TARGET_SCOPES: {
  value: TargetScope;
  label: string;
  desc: string;
  Icon: React.FC<any>;
}[] = [
  {
    value: "landlord-all",
    label: "Tất cả nhà trọ",
    desc: "Gửi tới mọi người thuê",
    Icon: Home,
  },
  {
    value: "house",
    label: "Một nhà trọ",
    desc: "Chọn một nhà trọ cụ thể",
    Icon: Building2,
  },
  {
    value: "room",
    label: "Một phòng",
    desc: "Chọn phòng trong nhà trọ",
    Icon: DoorOpen,
  },
  {
    value: "tenant",
    label: "Khách thuê",
    desc: "Gửi tới khách thuê cụ thể",
    Icon: Users,
  },
];

// ─── Picker Sheet Component ───────────────────────────────────────────
interface PickerProps {
  label: string;
  value: string;
  placeholder: string;
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
  loading?: boolean;
}

const InlinePicker: React.FC<PickerProps> = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <View style={pickerStyles.wrapper}>
      <Text style={pickerStyles.label}>{label}</Text>
      <TouchableOpacity
        style={pickerStyles.trigger}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            pickerStyles.triggerText,
            !selected && pickerStyles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.GRADIENT_START} />
        ) : (
          <ChevronDown
            size={18}
            color={open ? COLORS.GRADIENT_START : "#6A7282"}
          />
        )}
      </TouchableOpacity>

      {open && options.length > 0 && (
        <View style={pickerStyles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[
                pickerStyles.option,
                opt.id === value && pickerStyles.optionActive,
              ]}
              onPress={() => {
                onSelect(opt.id);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  pickerStyles.optionText,
                  opt.id === value && pickerStyles.optionTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {open && options.length === 0 && !loading && (
        <View style={pickerStyles.dropdown}>
          <Text style={pickerStyles.emptyOption}>Không có dữ liệu</Text>
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────
export const CreateNotificationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  // Form state
  const [notifType, setNotifType] = useState<NotifType>("LANDLORD_BROADCAST");
  const [targetScope, setTargetScope] = useState<TargetScope>("landlord-all");
  const [message, setMessage] = useState("");

  // Selection IDs
  const [selectedHouseId, setSelectedHouseId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");

  // Data
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [members, setMembers] = useState<IRoomMember[]>([]);

  // Loading states
  const [loadingHouses, setLoadingHouses] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [sending, setSending] = useState(false);

  // Load houses when scope requires it
  useEffect(() => {
    if (targetScope === "landlord-all") return;
    if (houses.length > 0) return;
    setLoadingHouses(true);
    getHouseApi
      .getAllHousesByLandlordId()
      .then((res: any) => setHouses(res?.data ?? []))
      .catch(() => setHouses([]))
      .finally(() => setLoadingHouses(false));
  }, [targetScope]);

  // Load rooms when house is selected
  useEffect(() => {
    if (!selectedHouseId) {
      setRooms([]);
      setSelectedRoomId("");
      setMembers([]);
      setSelectedTenantId("");
      return;
    }
    setLoadingRooms(true);
    setRooms([]);
    setSelectedRoomId("");
    setMembers([]);
    setSelectedTenantId("");
    getRoomApi
      .getAllRoomsByHouseId(selectedHouseId)
      .then((res: any) => setRooms(res?.data ?? []))
      .catch(() => setRooms([]))
      .finally(() => setLoadingRooms(false));
  }, [selectedHouseId]);

  // Load room members when room is selected
  useEffect(() => {
    if (!selectedRoomId || targetScope !== "tenant") {
      setMembers([]);
      setSelectedTenantId("");
      return;
    }
    setLoadingMembers(true);
    setMembers([]);
    setSelectedTenantId("");
    getRoomApi
      .getRoomMembers(selectedRoomId)
      .then((res: any) => setMembers(res?.data ?? []))
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false));
  }, [selectedRoomId, targetScope]);

  // Reset sub-selections when scope changes
  useEffect(() => {
    setSelectedHouseId("");
    setSelectedRoomId("");
    setSelectedTenantId("");
  }, [targetScope]);

  const handleScopeChange = (scope: TargetScope) => {
    setTargetScope(scope);
  };

  const buildTarget = (): object | null => {
    switch (targetScope) {
      case "landlord-all":
        return { kind: "landlord-all" };
      case "house":
        if (!selectedHouseId) return null;
        return { kind: "house", houseId: selectedHouseId };
      case "room":
        if (!selectedRoomId) return null;
        return { kind: "room", roomId: selectedRoomId };
      case "tenant":
        if (!selectedTenantId) return null;
        return { kind: "user", userId: selectedTenantId };
      default:
        return null;
    }
  };

  const validate = (): string | null => {
    if (!message.trim()) return "Vui lòng nhập nội dung thông báo.";
    if (targetScope === "house" && !selectedHouseId)
      return "Vui lòng chọn nhà trọ.";
    if (targetScope === "room" && !selectedRoomId)
      return "Vui lòng chọn phòng.";
    if (targetScope === "tenant" && !selectedTenantId)
      return "Vui lòng chọn khách thuê.";
    return null;
  };

  const handleSend = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Thiếu thông tin", error);
      return;
    }

    const target = buildTarget();
    if (!target) {
      Alert.alert("Lỗi", "Không thể xác định đối tượng nhận thông báo.");
      return;
    }

    setSending(true);
    try {
      await sendNotificationApi.broadcast({
        type: notifType,
        target,
        metadata: { message: message.trim() },
      });
      Alert.alert("Thành công", "Thông báo đã được gửi.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Gửi thất bại",
        err?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.",
      );
    } finally {
      setSending(false);
    }
  };

  // Derived picker options
  const houseOptions = houses.map((h) => ({
    id: h._id ?? "",
    label: h.houseName ?? "Nhà trọ",
  }));
  const roomOptions = rooms.map((r) => ({
    id: r._id ?? "",
    label: r.roomName ?? "Phòng",
  }));
  const tenantOptions = members.map((m) => ({
    id: (m.userId as IUser)._id ?? "",
    label:
      [(m.userId as IUser).firstName, (m.userId as IUser).lastName]
        .filter(Boolean)
        .join(" ") ||
      (m.userId as IUser).email ||
      "Khách thuê",
  }));
  const canSend = !!message.trim() && !sending;

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
          <View>
            <Text style={styles.headerTitle}>Tạo thông báo</Text>
            <Text style={styles.headerSub}>Gửi thông báo tới người thuê</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Section: Notification Type ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loại thông báo</Text>
          <View style={styles.typeGrid}>
            {NOTIF_TYPES.map((t) => {
              const isActive = notifType === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.typeCard, isActive && styles.typeCardActive]}
                  onPress={() => setNotifType(t.value)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      t.value === "LANDLORD_BROADCAST"
                        ? (["#FFB900", "#FF6900"] as [string, string])
                        : (["#00BC7C", "#00BBA6"] as [string, string])
                    }
                    style={[
                      styles.typeIcon,
                      !isActive && styles.typeIconInactive,
                    ]}
                  >
                    {t.value === "LANDLORD_BROADCAST" ? (
                      <Megaphone size={20} color="#fff" />
                    ) : (
                      <ScrollText size={20} color="#fff" />
                    )}
                  </LinearGradient>
                  <View style={styles.typeTextWrap}>
                    <Text
                      style={[
                        styles.typeLabel,
                        isActive && styles.typeLabelActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                    <Text style={styles.typeDesc} numberOfLines={2}>
                      {t.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      isActive && styles.radioCircleActive,
                    ]}
                  >
                    {isActive && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Section: Target Scope ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đối tượng nhận</Text>
          <View style={styles.scopeGrid}>
            {TARGET_SCOPES.map((s) => {
              const isActive = targetScope === s.value;
              const { Icon } = s;
              return (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.scopeCard, isActive && styles.scopeCardActive]}
                  onPress={() => handleScopeChange(s.value)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.scopeIconWrap,
                      isActive && styles.scopeIconWrapActive,
                    ]}
                  >
                    <Icon
                      size={20}
                      color={isActive ? COLORS.GRADIENT_START : "#6A7282"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.scopeLabel,
                      isActive && styles.scopeLabelActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                  <Text style={styles.scopeDesc} numberOfLines={2}>
                    {s.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Section: Target Selection (dynamic) ── */}
        {targetScope !== "landlord-all" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn đối tượng</Text>
            <View style={styles.pickerBox}>
              <InlinePicker
                label="Nhà trọ"
                value={selectedHouseId}
                placeholder="Chọn nhà trọ..."
                options={houseOptions}
                onSelect={setSelectedHouseId}
                loading={loadingHouses}
              />

              {(targetScope === "room" || targetScope === "tenant") &&
                selectedHouseId && (
                  <InlinePicker
                    label="Phòng"
                    value={selectedRoomId}
                    placeholder="Chọn phòng..."
                    options={roomOptions}
                    onSelect={setSelectedRoomId}
                    loading={loadingRooms}
                  />
                )}

              {targetScope === "tenant" && selectedRoomId && (
                <InlinePicker
                  label="Khách thuê"
                  value={selectedTenantId}
                  placeholder="Chọn khách thuê..."
                  options={tenantOptions}
                  onSelect={setSelectedTenantId}
                  loading={loadingMembers}
                />
              )}
            </View>
          </View>
        )}

        {/* ── Section: Message ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nội dung thông báo</Text>
          <View style={styles.messageBox}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Nhập nội dung thông báo..."
              placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.charCount}>{message.length}/1000</Text>
          </View>
        </View>

        {/* ── Summary chip ── */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryText}>
              {NOTIF_TYPES.find((t) => t.value === notifType)?.label}
            </Text>
          </View>
          <View style={styles.summaryArrow}>
            <Text style={styles.summaryArrowText}>→</Text>
          </View>
          <View style={[styles.summaryChip, styles.summaryChipTarget]}>
            <Text style={styles.summaryText}>
              {TARGET_SCOPES.find((s) => s.value === targetScope)?.label}
            </Text>
          </View>
        </View>

        {/* ── Send Button ── */}
        <TouchableOpacity
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.85}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Send size={18} color="#fff" />
              <Text style={styles.sendBtnText}>Gửi thông báo</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default CreateNotificationScreen;

// ─── Picker Styles ────────────────────────────────────────────────────
const pickerStyles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A7282",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  triggerText: { fontSize: 15, color: "#101828", flex: 1 },
  placeholderText: { color: COLORS.PLACEHOLDER_GRAY },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: 14,
    marginTop: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_GRAY,
  },
  optionActive: { backgroundColor: COLORS.GREEN_VERY_LIGHT },
  optionText: { fontSize: 15, color: "#101828" },
  optionTextActive: { color: COLORS.GREEN_PRIMARY, fontWeight: "600" },
  emptyOption: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.PLACEHOLDER_GRAY,
  },
});

// ─── Screen Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_GRAY },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingBottom: 18,
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
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 0 },

  // Section
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#101828",
    marginBottom: 12,
  },

  // Notification type cards
  typeGrid: { gap: 10 },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_GRAY,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeCardActive: {
    borderColor: COLORS.GRADIENT_START,
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  typeIconInactive: { opacity: 0.65 },
  typeTextWrap: { flex: 1 },
  typeLabel: { fontSize: 15, fontWeight: "bold", color: "#101828" },
  typeLabelActive: { color: COLORS.GREEN_PRIMARY },
  typeDesc: { fontSize: 13, color: "#6A7282", marginTop: 2, lineHeight: 18 },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.BORDER_GRAY,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioCircleActive: { borderColor: COLORS.GRADIENT_START },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.GRADIENT_START,
  },

  // Scope cards
  scopeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  scopeCard: {
    width: "47%",
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_GRAY,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scopeCardActive: {
    borderColor: COLORS.GRADIENT_START,
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
  },
  scopeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  scopeIconWrapActive: { backgroundColor: "rgba(0,188,124,0.12)" },
  scopeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#101828",
  },
  scopeLabelActive: { color: COLORS.GREEN_PRIMARY },
  scopeDesc: { fontSize: 12, color: "#6A7282", lineHeight: 16 },

  // Picker container
  pickerBox: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Message
  messageBox: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageInput: {
    padding: 16,
    fontSize: 15,
    color: "#101828",
    minHeight: 140,
    lineHeight: 22,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: COLORS.PLACEHOLDER_GRAY,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  // Summary row
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  summaryChip: {
    backgroundColor: "rgba(0,188,124,0.12)",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.GREEN_LIGHT_BORDER,
  },
  summaryChipTarget: {
    backgroundColor: "rgba(97,95,255,0.08)",
    borderColor: "#C4C3FF",
  },
  summaryText: { fontSize: 13, fontWeight: "600", color: "#101828" },
  summaryArrow: {},
  summaryArrowText: { fontSize: 16, color: "#6A7282", fontWeight: "bold" },

  // Send button
  sendBtn: {
    backgroundColor: COLORS.GRADIENT_START,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: COLORS.GRADIENT_START,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  sendBtnDisabled: { opacity: 0.5, shadowOpacity: 0 },
  sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
