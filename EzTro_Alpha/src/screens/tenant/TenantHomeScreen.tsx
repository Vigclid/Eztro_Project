import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleAlert, Hash, Mail, Plus, X } from "lucide-react-native";

const TAB_BAR_HEIGHT = 80;

const TenantHomeScreen = () => {
  const insets = useSafeAreaInsets();
  const sheetBottom = Math.max(insets.bottom + TAB_BAR_HEIGHT + 8, 20);

  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"roomCode" | "invites">("roomCode");
  const [roomCode, setRoomCode] = useState("");
  const inviteCount = 0;

  const formattedRoomCode = useMemo(() => {
    const digits = roomCode.replace(/\D/g, "").slice(0, 6);
    return digits.padEnd(6, "0").split("").join(" ");
  }, [roomCode]);

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Xin chào, minh! 👋</Text>
          <Text style={styles.subtitle}>Quản lý phòng trọ của bạn</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <CircleAlert color="#d97706" size={32} />
          </View>
          <Text style={styles.cardTitle}>Bạn chưa có phòng</Text>
          <Text style={styles.cardDesc}>
            Nhấn vào nút bên dưới để tham gia phòng trọ bằng mã phòng
            hoặc chấp nhận lời mời từ chủ trọ
          </Text>
          <TouchableOpacity
            style={styles.joinBtn}
            activeOpacity={0.8}
            onPress={() => setIsJoinModalVisible(true)}
          >
            <Plus color="#fff" size={18} />
            <Text style={styles.joinBtnText}>Tham gia phòng</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {isJoinModalVisible && (
        <>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsJoinModalVisible(false)}
          />

          <View style={[styles.sheetContainer, { paddingBottom: sheetBottom }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Tham gia phòng trọ</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsJoinModalVisible(false)}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === "roomCode" && styles.tabBtnActive]}
                onPress={() => setActiveTab("roomCode")}
              >
                <Hash
                  size={18}
                  color={activeTab === "roomCode" ? "#0ea58d" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "roomCode" && styles.tabTextActive,
                  ]}
                >
                  Mã phòng
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, activeTab === "invites" && styles.tabBtnActive]}
                onPress={() => setActiveTab("invites")}
              >
                <Mail
                  size={18}
                  color={activeTab === "invites" ? "#0ea58d" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "invites" && styles.tabTextActive,
                  ]}
                >
                  Lời mời
                </Text>
                {inviteCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{inviteCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>

            {activeTab === "roomCode" ? (
              <View style={styles.contentArea}>
                <View style={styles.contentIconBox}>
                  <Hash size={40} color="#0ea58d" />
                </View>
                <Text style={styles.contentTitle}>Nhập mã phòng</Text>
                <Text style={styles.contentDesc}>
                  Nhập mã 6 chữ số do chủ trọ cung cấp để tham gia phòng
                </Text>

                <View style={styles.codeInputWrap}>
                  <TextInput
                    value={roomCode}
                    onChangeText={setRoomCode}
                    keyboardType="numeric"
                    maxLength={6}
                    style={styles.codeInputHidden}
                  />
                  <Text style={styles.codeText}>{formattedRoomCode}</Text>
                </View>

                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
                  <Text style={styles.submitBtnText}>Tham gia phòng</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.contentArea}>
                <Mail size={58} color="#c4c9d1" />
                <Text style={styles.contentTitle}>Chưa có lời mời</Text>
                <Text style={styles.contentDesc}>
                  Bạn chưa nhận được lời mời nào từ chủ trọ
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#e8f1ef",
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  header: {
    marginBottom: 22,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 19,
    color: "#4b5563",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: "#f5e6b0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  cardDesc: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 30,
    marginBottom: 26,
  },
  joinBtn: {
    minWidth: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: "#0ea58d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 24, 39, 0.35)",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  sheetHeader: {
    height: 70,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tabBtn: {
    flex: 1,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: "#0ea58d",
  },
  tabText: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#0ea58d",
    fontWeight: "700",
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  contentArea: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  contentIconBox: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: "#c4f0e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  contentDesc: {
    textAlign: "center",
    fontSize: 20,
    lineHeight: 34,
    color: "#6b7280",
    marginBottom: 24,
  },
  codeInputWrap: {
    width: "100%",
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  codeInputHidden: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  codeText: {
    fontSize: 35,
    letterSpacing: 1,
    color: "#6b7280",
    fontWeight: "700",
  },
  submitBtn: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: "#8a94a7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});

export default TenantHomeScreen;
