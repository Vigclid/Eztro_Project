import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/navigation.type";
import { postRoomApi } from "../../api/room/room";
import { ApiResponse } from "../../types/app.common";
import { IRoom } from "../../types/room";

// Định nghĩa màu sắc theo thiết kế
const COLORS = {
  primary: "#00C49F", // Màu xanh ngọc chủ đạo
  white: "#FFFFFF",
  text: "#333333",
  textLight: "#666666",
  border: "#E0E0E0",
  inputBg: "#FFFFFF",
  success: "#00C49F",
  warning: "#FF8C42", // Màu cam cho trạng thái đang thuê/cọc
  warningBg: "#FFF4E5",
  successBg: "#E8FBF6",
};

type CreateRoomRouteProps = RouteProp<
  MainStackParamList,
  "createNewRoomScreen"
>;

const CreateNewRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<CreateRoomRouteProps>();

  const { houseId, room } = route.params || {};
  const editingRoom = room as IRoom | undefined;
  const isEditMode = !!editingRoom?._id;

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    area: "",
    maxPeople: "",
    price: "",
    deposit: "",
    status: "Trống" as "Trống" | "Đang thuê",
  });

  const [submitting, setSubmitting] = useState(false);

  // Khởi tạo dữ liệu nếu là chế độ sửa
  useEffect(() => {
    if (editingRoom) {
      setFormData({
        roomNumber: editingRoom.roomName || "",
        floor: String(editingRoom.floor ?? ""),
        area: String(editingRoom.area ?? ""),
        maxPeople: "",
        price: String(editingRoom.rentalFee ?? ""),
        deposit: "",
        status:
          editingRoom.status === "Đang Thuê"
            ? "Đang thuê"
            : ("Trống" as "Trống" | "Đang thuê"),
      });
    }
  }, [editingRoom]);

  // Hàm xử lý thay đổi input
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const mapStatusForBackend = (status: "Trống" | "Đang thuê") => {
    if (status === "Trống") return "Còn Trống";
    return "Đang Thuê";
  };

  const resolveHouseIdFromRoom = (roomData?: IRoom) => {
    if (!roomData?.houseId) return undefined;
    if (typeof roomData.houseId === "string") return roomData.houseId;
    // @ts-ignore - fallback nếu houseId là object IHouse
    return roomData.houseId?._id;
  };

  const handleSave = async () => {
    if (!formData.roomNumber || !formData.price) {
      Alert.alert("Thông báo", "Vui lòng nhập số phòng và giá thuê.");
      return;
    }

    const effectiveHouseId = houseId || resolveHouseIdFromRoom(editingRoom);

    if (!effectiveHouseId && !isEditMode) {
      Alert.alert(
        "Lỗi",
        "Thiếu thông tin cụm trọ (houseId). Vui lòng quay lại và thử lại.",
      );
      return;
    }

    const payload: any = {
      houseId: effectiveHouseId,
      roomName: formData.roomNumber.trim(),
      rentalFee: Number(formData.price) || 0,
      status: mapStatusForBackend(formData.status),
      rentalDate: editingRoom?.rentDate ?? undefined,
      // Các field phụ nếu backend sau này hỗ trợ
      area: formData.area ? Number(formData.area) : undefined,
      floor: formData.floor ? Number(formData.floor) : undefined,
      maxPeople: formData.maxPeople
        ? Number(formData.maxPeople)
        : undefined,
      deposit: formData.deposit
        ? Number(formData.deposit)
        : undefined,
    };

    setSubmitting(true);
    try {
      let res: ApiResponse<IRoom>;

      if (isEditMode && editingRoom?._id) {
        const raw = await postRoomApi.updateRoom(editingRoom._id, payload);
        res = raw as ApiResponse<IRoom>;
      } else {
        const raw = await postRoomApi.createRoom(payload);
        res = raw as ApiResponse<IRoom>;
      }

      if (res.status === "success" || res.status === true) {
        Alert.alert(
          "Thành công",
          res.message ||
            (isEditMode
              ? "Cập nhật phòng thành công"
              : "Tạo phòng thành công"),
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert("Lỗi", res.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Component con: Một ô nhập liệu (Input)
  const FormInput = ({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
  }: {
    label: string;
    icon: any;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "numeric";
  }) => (
    <View style={styles.inputWrapper}>
      <View style={styles.labelContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={COLORS.primary}
          style={styles.inputIcon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Cập nhật phòng" : "Thêm phòng mới"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hàng 1: Số phòng - Tầng */}
          <View style={styles.row}>
            <FormInput
              label="Số phòng"
              icon="home-outline"
              placeholder="VD: 101, A1"
              value={formData.roomNumber}
              onChangeText={(text: string) => handleChange("roomNumber", text)}
            />
            <View style={{ width: 15 }} />
            <FormInput
              label="Tầng"
              icon="office-building-outline"
              placeholder="1"
              value={formData.floor}
              keyboardType="numeric"
              onChangeText={(text: string) => handleChange("floor", text)}
            />
          </View>

          {/* Hàng 2: Diện tích - Số người */}
          <View style={styles.row}>
            <FormInput
              label="Diện tích (m²)"
              icon="fullscreen"
              placeholder="25"
              value={formData.area}
              keyboardType="numeric"
              onChangeText={(text: string) => handleChange("area", text)}
            />
            <View style={{ width: 15 }} />
            <FormInput
              label="Số người tối đa"
              icon="account-group-outline"
              placeholder="2"
              value={formData.maxPeople}
              keyboardType="numeric"
              onChangeText={(text: string) => handleChange("maxPeople", text)}
            />
          </View>

          {/* Hàng 3: Giá thuê - Tiền cọc */}
          <View style={styles.row}>
            <FormInput
              label="Giá thuê/tháng (đ)"
              icon="currency-usd"
              placeholder="3000000"
              value={formData.price}
              keyboardType="numeric"
              onChangeText={(text: string) => handleChange("price", text)}
            />
            <View style={{ width: 15 }} />
            <FormInput
              label="Tiền cọc (đ)"
              icon="currency-usd"
              placeholder="6000000"
              value={formData.deposit}
              keyboardType="numeric"
              onChangeText={(text: string) => handleChange("deposit", text)}
            />
          </View>

          {/* Phần Trạng thái */}
          <View style={styles.statusSection}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={18}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <Text style={styles.label}>Trạng thái</Text>
            </View>

            <View style={styles.statusRow}>
              {/* Nút Trống */}
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === "Trống"
                    ? styles.statusActiveEmpty
                    : styles.statusInactive,
                ]}
                onPress={() => handleChange("status", "Trống")}
              >
                <Text
                  style={[
                    styles.statusText,
                    formData.status === "Trống"
                      ? { color: COLORS.success, fontWeight: "bold" }
                      : { color: COLORS.textLight },
                  ]}
                >
                  Trống
                </Text>
              </TouchableOpacity>

              <View style={{ width: 15 }} />

              {/* Nút Đang thuê */}
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === "Đang thuê"
                    ? styles.statusActiveRented
                    : styles.statusInactive,
                ]}
                onPress={() => handleChange("status", "Đang thuê")}
              >
                <Text
                  style={[
                    styles.statusText,
                    formData.status === "Đang thuê"
                      ? { color: COLORS.warning, fontWeight: "bold" }
                      : { color: COLORS.textLight },
                  ]}
                >
                  Đang thuê
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnCancel}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.btnCancelText}>Hủy</Text>
        </TouchableOpacity>

        <View style={{ width: 15 }} />

        <TouchableOpacity
          style={[
            styles.btnSave,
            submitting && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.btnSaveText}>
            {submitting
              ? isEditMode
                ? "Đang lưu..."
                : "Đang tạo..."
              : isEditMode
              ? "Lưu thay đổi"
              : "Lưu phòng"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  // Header
  header: {
    backgroundColor: COLORS.primary,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  // Body Layout
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  // Status Section
  statusSection: {
    marginTop: 8,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  statusInactive: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
  },
  statusActiveEmpty: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  statusActiveRented: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  btnCancelText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  btnSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnSaveText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateNewRoomScreen;

