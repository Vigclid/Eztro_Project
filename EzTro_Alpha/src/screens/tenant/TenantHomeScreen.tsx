import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
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
  Wrench,
  X,
  MessageCircle,
} from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/theme";
import { useSelector } from "react-redux";
import { getRoomApi, postRoomApi } from "../../api/room/room";
import { getTicketApi } from "../../api/ticket/ticketapi";
import { ApiResponse } from "../../types/app.common";
import { TenantHomeScreenStyle } from "./styles/TenantHomeScreen.style";
import { NavigationProp } from "../../navigation/navigation.type";
import { RootState } from "../../stores/store";

type TenantRoomInfo = {
  role: "TENANT" | "CO-TENANT";
  depositAmount?: number;
  moveInDate: Date | string;
  room: { roomName: string; rentalFee: number };
  house: { houseName: string; address: string };
  landlord: { _id?: string; fullName: string };
  policy?: {
    description: string;
    defaultTimeReminder: Date | string | null;
    defaultTimeReminderContent: string;
    notificationType: "in-app" | "mail" | "all";
    timeReminderStatus: "active" | "inactive";
  } | null;
};

type TenantInvitation = {
  _id: string;
  expiresAt: Date | string;
  depositAmount?: number;
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
  const contentBottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;
  const styles = TenantHomeScreenStyle;
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigateToMaintenance = () => {
    navigation.navigate("mainstack", { screen: "ticketListScreen" });
  };

  const handleMessageLandlord = (landlordId: string, landlordName: string) => {
    if (!landlordId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin chủ trọ");
      return;
    }

    // Navigate to MessageScreen with landlordId
    navigation.navigate("mainstack", {
      screen: "messageScreen",
      params: {
        recipientId: landlordId,
        recipientName: landlordName,
      },
    });
  };

  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"roomCode" | "invites">("roomCode");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const [myRoom, setMyRoom] = useState<TenantRoomInfo | null>(null);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const currentUserId = user?._id;

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

      // Load ticket stats for tenant
      await loadTicketStats();
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const loadTicketStats = async () => {
    try {
      const response: any = await getTicketApi.getAllTicketsByTenant();
      if (response.status && response.data) {
        const tickets = Array.isArray(response.data) ? response.data : response.data.data || [];
        
        // Count unread messages from landlord
        let unreadCount = 0;
        tickets.forEach((ticket: any) => {
          if (ticket.replies && Array.isArray(ticket.replies)) {
            const unread = ticket.replies.filter((reply: any) => {
              return reply.userId && typeof reply.userId === 'object' && 
                     reply.userId._id !== currentUserId && 
                     !reply.isRead;
            }).length;
            unreadCount += unread;
          }
        });
        setUnreadMessagesCount(unreadCount);
      }
    } catch (error) {
    }
  };

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: contentBottomPadding }}
          >
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
                  <DollarSign size={16} color="#10b981" />
                  <View style={styles.roomInfoTextWrap}>
                    <Text style={styles.roomInfoLabel}>Tiền cọc</Text>
                    <Text style={styles.roomInfoValue}>
                      {(myRoom.depositAmount || 0).toLocaleString("vi-VN")}đ
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
                  {myRoom.landlord?._id && (
                    <TouchableOpacity
                      style={styles.landlordMessageButton}
                      onPress={() =>
                        handleMessageLandlord(
                          myRoom.landlord._id || "",
                          myRoom.landlord.fullName || "Chủ trọ"
                        )
                      }
                    >
                      <Ionicons name="chatbubble-outline" size={20} color={COLORS.GRADIENT_START} />
                    </TouchableOpacity>
                  )}
                </View>

                {myRoom.policy && (
                  <View
                    style={{
                      marginBottom: 12,
                      borderRadius: 14,
                      backgroundColor: "#edf4ff",
                      borderWidth: 1,
                      borderColor: "#d8e6ff",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#1e3a8a",
                        marginBottom: 6,
                      }}
                    >
                      Chính sách phòng
                    </Text>
                    <Text style={{ fontSize: 12, color: "#1f2937", marginBottom: 2 }}>
                      Trạng thái nhắc nhở: {myRoom.policy.timeReminderStatus === "active" ? "Bật" : "Tắt"}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#1f2937", marginBottom: 2 }}>
                      Kênh thông báo: {myRoom.policy.notificationType}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#1f2937", marginBottom: 2 }}>
                      Thời gian nhắc:{" "}
                      {myRoom.policy.defaultTimeReminder
                        ? new Date(myRoom.policy.defaultTimeReminder).toLocaleDateString("vi-VN")
                        : "Chưa thiết lập"}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#1f2937", marginBottom: 2 }}>
                      Nội dung: {myRoom.policy.defaultTimeReminderContent || "Không có"}
                    </Text>
                    <Text style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
                      {myRoom.policy.description || "Không có mô tả chính sách"}
                    </Text>
                  </View>
                )}

                {/* Maintenance Button - Only show when tenant has joined a room */}
                {myRoom && (
                  <>
                    <TouchableOpacity 
                      style={styles.maintenanceCard}
                      onPress={handleNavigateToMaintenance}
                    >
                      <View style={styles.maintenanceIconContainer}>
                        <Wrench size={24} color="#fff" />
                        {unreadMessagesCount > 0 && (
                          <View style={styles.maintenanceNotificationBadge}>
                            <Text style={styles.maintenanceNotificationText}>
                              {unreadMessagesCount}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.maintenanceContent}>
                        <Text style={styles.maintenanceTitle}>Bảo trì</Text>
                        <Text style={styles.maintenanceDesc}>Yêu cầu sửa chữa</Text>
                      </View>
                      <View style={styles.maintenanceArrow}>
                        <Text style={styles.maintenanceArrowText}>›</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Landlord Reply Alert */}
                    {unreadMessagesCount > 0 && (
                      <View style={styles.alertCard}>
                        <View style={styles.alertIconContainer}>
                          <MessageCircle size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.alertContent}>
                          <Text style={styles.alertText}>
                            Chủ trọ đã phản hồi phiếu hỗ trợ của bạn, hãy vào kiểm tra
                          </Text>
                        </View>
                      </View>
                    )}
                  </>
                )}
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
          </ScrollView>
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
                      <Text style={styles.inviteInfo}>
                        Cọc: {(invite.depositAmount || 0).toLocaleString("vi-VN")} đ
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

export default TenantHomeScreen;
