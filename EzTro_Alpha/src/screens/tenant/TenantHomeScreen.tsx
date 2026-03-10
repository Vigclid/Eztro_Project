import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CalendarDays,
  CircleAlert,
  DollarSign,
  Hash,
  House,
  Mail,
  MapPin,
  Phone,
  Plus,
  X,
} from "lucide-react-native";
import { getRoomApi, postRoomApi } from "../../api/room/room";
import { ApiResponse } from "../../types/app.common";

type TenantRoomInfo = {
  role: "TENANT" | "CO-TENANT";
  moveInDate: Date | string;
  room: { roomName: string; rentalFee: number };
  house: { houseName: string; address: string };
  landlord: { fullName: string };
};

type TenantInvitation = {
  _id: string;
  expiresAt: Date | string;
  roomId: {
    roomName: string;
    rentalFee: number;
    houseId?: { houseName: string; address: string };
  };
};

const TAB_BAR_HEIGHT = 80;

const TenantHomeScreen = () => {
  const insets = useSafeAreaInsets();
  const sheetBottom = Math.max(insets.bottom + TAB_BAR_HEIGHT + 8, 20);

  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"roomCode" | "invites">("roomCode");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const [myRoom, setMyRoom] = useState<TenantRoomInfo | null>(null);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);

  const formattedRoomCode = useMemo(() => {
    const digits = roomCode.replace(/\D/g, "").slice(0, 6);
    return digits.padEnd(6, "0").split("").join(" ");
  }, [roomCode]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rawRoom, rawInvites] = await Promise.all([
        getRoomApi.getMyActiveRoom(),
        getRoomApi.getMyInvitations(),
      ]);

      const roomRes = rawRoom as ApiResponse<TenantRoomInfo | null>;
      const inviteRes = rawInvites as ApiResponse<TenantInvitation[]>;

      setMyRoom(roomRes.status === "success" ? (roomRes.data as TenantRoomInfo | null) : null);
      setInvitations(
        inviteRes.status === "success" && Array.isArray(inviteRes.data)
          ? inviteRes.data
          : []
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleJoinByCode = async () => {
    const code = roomCode.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) return;

    setJoining(true);
    try {
      const raw = await postRoomApi.joinByCode(code);
      const res = raw as ApiResponse<TenantRoomInfo>;
      if (res.status === "success") {
        setIsJoinModalVisible(false);
        setRoomCode("");
        fetchData();
      }
    } finally {
      setJoining(false);
    }
  };

  const handleAcceptInvite = async (invitationId: string) => {
    setAcceptingId(invitationId);
    try {
      const raw = await postRoomApi.acceptInvitation(invitationId);
      const res = raw as ApiResponse<TenantRoomInfo>;
      if (res.status === "success") {
        setIsJoinModalVisible(false);
        fetchData();
      }
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0ea58d" />
          </View>
        ) : (
          <>
            <Text style={styles.title}>Xin chào 👋</Text>
            <Text style={styles.subtitle}>Quản lý phòng trọ của bạn</Text>

            {myRoom ? (
              <View style={styles.roomCard}>
                <View style={styles.roomCardHeader}>
                  <View style={styles.roomIconWrap}>
                    <House size={24} color="#0ea58d" />
                  </View>
                  <View style={styles.rentedBadge}>
                    <Text style={styles.rentedBadgeText}>Đang thuê</Text>
                  </View>
                </View>

                <Text style={styles.roomName}>{myRoom.room.roomName}</Text>
                <Text style={styles.houseName}>{myRoom.house.houseName}</Text>

                <View style={styles.roomInfoBox}>
                  <MapPin size={16} color="#10b981" />
                  <View style={styles.roomInfoTextWrap}>
                    <Text style={styles.roomInfoLabel}>Địa chỉ</Text>
                    <Text style={styles.roomInfoValue}>{myRoom.house.address}</Text>
                  </View>
                </View>

                <View style={styles.roomInfoBox}>
                  <DollarSign size={16} color="#10b981" />
                  <View style={styles.roomInfoTextWrap}>
                    <Text style={styles.roomInfoLabel}>Giá thuê</Text>
                    <Text style={styles.roomInfoValue}>
                      {myRoom.room.rentalFee?.toLocaleString("vi-VN")}đ/tháng
                    </Text>
                  </View>
                </View>

                <View style={styles.roomInfoBox}>
                  <CalendarDays size={16} color="#10b981" />
                  <View style={styles.roomInfoTextWrap}>
                    <Text style={styles.roomInfoLabel}>Ngày vào ở</Text>
                    <Text style={styles.roomInfoValue}>
                      {new Date(myRoom.moveInDate).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                </View>

                <View style={styles.roomInfoBox}>
                  <Phone size={16} color="#10b981" />
                  <View style={styles.roomInfoTextWrap}>
                    <Text style={styles.roomInfoLabel}>Chủ trọ</Text>
                    <Text style={styles.roomInfoValue}>
                      {myRoom.landlord?.fullName || "Không rõ"}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.card}>
                <View style={styles.iconBox}>
                  <CircleAlert color="#d97706" size={30} />
                </View>
                <Text style={styles.cardTitle}>Bạn chưa có phòng</Text>
                <Text style={styles.info}>
                  Nhấn vào nút bên dưới để tham gia phòng bằng mã hoặc chấp nhận lời mời.
                </Text>
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() => setIsJoinModalVisible(true)}
                >
                  <Plus color="#fff" size={18} />
                  <Text style={styles.joinText}>Tham gia phòng</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </SafeAreaView>

      {isJoinModalVisible && (
        <>
          <Pressable style={styles.backdrop} onPress={() => setIsJoinModalVisible(false)} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
            style={styles.sheetKeyboardWrap}
          >
            <View style={[styles.sheet, { paddingBottom: sheetBottom }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Tham gia phòng trọ</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setIsJoinModalVisible(false)}>
                <X size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "roomCode" && styles.tabActive]}
                onPress={() => setActiveTab("roomCode")}
              >
                <Hash size={16} color={activeTab === "roomCode" ? "#0ea58d" : "#6b7280"} />
                <Text style={[styles.tabText, activeTab === "roomCode" && styles.tabTextActive]}>
                  Mã phòng
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === "invites" && styles.tabActive]}
                onPress={() => setActiveTab("invites")}
              >
                <Mail size={16} color={activeTab === "invites" ? "#0ea58d" : "#6b7280"} />
                <Text style={[styles.tabText, activeTab === "invites" && styles.tabTextActive]}>
                  Lời mời
                </Text>
                {invitations.length > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{invitations.length}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>

            {activeTab === "roomCode" ? (
              <View style={styles.content}>
                <TextInput
                  value={roomCode}
                  onChangeText={setRoomCode}
                  keyboardType="numeric"
                  maxLength={6}
                  style={styles.codeInput}
                  placeholder="Nhập mã 6 số"
                  placeholderTextColor="#9ca3af"
                />
                <Text style={styles.codeText}>{formattedRoomCode}</Text>
                <TouchableOpacity
                  style={[styles.submitBtn, roomCode.replace(/\D/g, "").length !== 6 && styles.disabled]}
                  disabled={joining || roomCode.replace(/\D/g, "").length !== 6}
                  onPress={handleJoinByCode}
                >
                  <Text style={styles.submitText}>{joining ? "Đang xử lý..." : "Tham gia phòng"}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.content}>
                {invitations.length === 0 ? (
                  <Text style={styles.info}>Chưa có lời mời</Text>
                ) : (
                  invitations.map((invite) => (
                    <View key={invite._id} style={styles.inviteCard}>
                      <Text style={styles.inviteTitle}>
                        {invite.roomId.roomName} - {invite.roomId.houseId?.houseName || "Nhà trọ"}
                      </Text>
                      <Text style={styles.inviteInfo}>{invite.roomId.houseId?.address || ""}</Text>
                      <Text style={styles.inviteInfo}>
                        Giá: {invite.roomId.rentalFee?.toLocaleString("vi-VN")} đ
                      </Text>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAcceptInvite(invite._id)}
                        disabled={acceptingId === invite._id}
                      >
                        <Text style={styles.acceptText}>
                          {acceptingId === invite._id ? "Đang chấp nhận..." : "Chấp nhận"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}
            </View>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: "#e8f1ef", paddingHorizontal: 18, paddingTop: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "700", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#4b5563", marginBottom: 16 },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    alignItems: "center",
  },
  roomCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dfe7e5",
    padding: 16,
  },
  roomCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  roomIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#c6f3e3",
    alignItems: "center",
    justifyContent: "center",
  },
  rentedBadge: {
    backgroundColor: "#c6f3e3",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rentedBadgeText: {
    color: "#0f9f74",
    fontWeight: "700",
    fontSize: 13,
  },
  roomName: {
    color: "#111827",
    fontSize: 34,
    fontWeight: "700",
  },
  houseName: {
    marginTop: 2,
    marginBottom: 12,
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  roomInfoBox: {
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "#eef0f1",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  roomInfoTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  roomInfoLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  roomInfoValue: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "700",
  },
  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: "#f5e6b0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  info: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 6 },
  joinBtn: {
    minWidth: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#0ea58d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  joinText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(17,24,39,0.35)" },
  sheetKeyboardWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "86%",
    minHeight: 470,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetHeader: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  tab: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#0ea58d" },
  tabText: { fontSize: 14, color: "#6b7280", fontWeight: "600" },
  tabTextActive: { color: "#0ea58d" },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  content: { padding: 16 },
  codeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 10,
  },
  codeText: {
    textAlign: "center",
    fontSize: 30,
    color: "#6b7280",
    fontWeight: "700",
    marginBottom: 12,
  },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#8a94a7",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.6 },
  submitText: { color: "#fff", fontWeight: "700" },
  inviteCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  inviteTitle: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 4 },
  inviteInfo: { fontSize: 12, color: "#6b7280", marginBottom: 2 },
  acceptBtn: {
    marginTop: 8,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#0ea58d",
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});

export default TenantHomeScreen;
