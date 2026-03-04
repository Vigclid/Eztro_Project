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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MainStackParamList } from "../../navigation/navigation.type";
import { postRoomApi } from "../../api/room/room";
import { ApiResponse } from "../../types/app.common";
import { IRoom, IVirtualTenant } from "../../types/room";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  SHADOW,
  IMAGE_SIZE,
} from "../../constants/theme";

type CreateRoomRouteProps = RouteProp<
  MainStackParamList,
  "createNewRoomScreen"
>;

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
        color={COLORS.PRIMARY}
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
// ----------------------------------------------------------------------

const CreateNewRoomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<CreateRoomRouteProps>();

  const { houseId, room, onRefresh } = route.params || {};
  const editingRoom = room as IRoom | undefined;
  const isEditMode = !!editingRoom?._id;

  const [formData, setFormData] = useState({
    roomNumber: "",
    price: "",
    status: "Trống" as "Trống" | "Đang thuê",
    rentalDate: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tenants, setTenants] = useState<IVirtualTenant[]>(
    editingRoom?.virtualTenants || [],
  );

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        roomNumber: editingRoom.roomName || "",
        price: String(editingRoom.rentalFee ?? ""),
        status:
          editingRoom.status === "Đang Thuê"
            ? "Đang thuê"
            : ("Trống" as "Trống" | "Đang thuê"),
        rentalDate: editingRoom.rentDate
          ? new Date(editingRoom.rentDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
      setTenants(editingRoom.virtualTenants || []);
    } else {
      setFormData((prev) => ({
        ...prev,
        rentalDate: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [editingRoom]);

  const handleGoBack = () => {
    navigation.goBack();
  };

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
        "Thiếu thông tin cụm trọ (houseId). Vui lòng quay lại và thử lại."
      );
      return;
    }

    const payload: any = {
      houseId: effectiveHouseId,
      roomName: formData.roomNumber.trim(),
      rentalFee: Number(formData.price) || 0,
      status: mapStatusForBackend(formData.status),
      rentalDate: formData.rentalDate
        ? new Date(formData.rentalDate)
        : new Date(),
      virtualTenants: tenants,
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
              onPress: () => {
                onRefresh?.();
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert("Lỗi", res.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error: any) {
      // Hiển thị thông báo rõ ràng khi tên phòng bị trùng trong cùng cụm trọ
      const backendMessage =
        error?.response?.data?.message || error?.message || "";

      if (
        backendMessage.includes("đã tồn tại trong cụm trọ") ||
        backendMessage.includes("ROOM_NAME_ALREADY_EXISTS_IN_HOUSE")
      ) {
        Alert.alert(
          "Thông báo",
          "Tên phòng này đã tồn tại trong cụm trọ. Vui lòng nhập tên khác."
        );
      } else {
        Alert.alert(
          "Lỗi",
          backendMessage || "Có lỗi xảy ra, vui lòng thử lại sau."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

      <LinearGradient
        colors={COLORS.primaryGradient}
        style={styles.headerGradient}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={IMAGE_SIZE.BACK_BUTTON_ICON_WIDTH}
            color={COLORS.textWhite}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>
            {isEditMode ? "Cập nhật phòng" : "Thêm phòng mới"}
          </Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.singleRow}>
            <FormInput
              label="Số phòng"
              icon="home-outline"
              placeholder="VD: 101, A1"
              value={formData.roomNumber}
              onChangeText={(text: string) => handleChange("roomNumber", text)}
            />
          </View>

          <View style={styles.singleRow}>
            <FormInput
              label="Giá thuê/tháng (đ)"
              icon="currency-usd"
              placeholder="3000000"
              value={formData.price}
              keyboardType="numeric"
              onChangeText={(text: string) => handleChange("price", text)}
            />
          </View>

          <View style={styles.singleRow}>
            <View style={styles.inputWrapper}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={18}
                  color={COLORS.PRIMARY}
                  style={styles.inputIcon}
                />
                <Text style={styles.label}>Ngày tạo phòng</Text>
              </View>

              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={
                    formData.rentalDate
                      ? styles.dateText
                      : styles.datePlaceholderText
                  }
                >
                  {formData.rentalDate || "Chọn ngày"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={
                    formData.rentalDate
                      ? new Date(formData.rentalDate)
                      : new Date()
                  }
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(
                    _event: any,
                    selectedDate?: Date | undefined
                  ) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const iso = selectedDate.toISOString().slice(0, 10);
                      handleChange("rentalDate", iso);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.statusSection}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={18}
                color={COLORS.PRIMARY}
                style={styles.inputIcon}
              />
              <Text style={styles.label}>Trạng thái</Text>
            </View>

            <View style={styles.statusRow}>
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
                      ? { color: COLORS.successText, fontWeight: "bold" }
                      : { color: COLORS.TEXT_SECONDARY },
                  ]}
                >
                  Trống
                </Text>
              </TouchableOpacity>

              <View style={{ width: 15 }} />

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
                      ? { color: COLORS.warningText, fontWeight: "bold" }
                      : { color: COLORS.TEXT_SECONDARY },
                  ]}
                >
                  Đang thuê
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {tenants.length > 0 && (
            <View style={styles.tenantsSection}>
              <Text style={styles.tenantsTitle}>Người thuê hiện tại</Text>
              {tenants.map((t, index) => (
                <View key={`${t.tenantName}-${index}`} style={styles.tenantItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tenantName}>{t.tenantName}</Text>
                    <Text style={styles.tenantText}>{t.phoneNumber}</Text>
                    {t.joinDate && (
                      <Text style={styles.tenantText}>
                        Ngày vào ở:{" "}
                        {new Date(t.joinDate).toISOString().slice(0, 10)}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.tenantRemoveButton}
                    onPress={() => {
                      Alert.alert(
                        "Xác nhận",
                        `Xóa ${t.tenantName} khỏi phòng?`,
                        [
                          { text: "Hủy", style: "cancel" },
                          {
                            text: "Xóa",
                            style: "destructive",
                            onPress: async () => {
                              const updated = tenants.filter(
                                (_prev, i) => i !== index,
                              );

                              if (isEditMode && editingRoom?._id) {
                                try {
                                  const raw = await postRoomApi.updateRoom(
                                    editingRoom._id,
                                    { virtualTenants: updated },
                                  );
                                  const res = raw as ApiResponse<IRoom>;
                                  if (
                                    res.status === "success" ||
                                    res.status === true
                                  ) {
                                    setTenants(updated);
                                  } else {
                                    Alert.alert(
                                      "Lỗi",
                                      res.message ||
                                        "Không thể xóa người thuê, vui lòng thử lại.",
                                    );
                                  }
                                } catch (error: any) {
                                  Alert.alert(
                                    "Lỗi",
                                    error?.message ||
                                      "Không thể xóa người thuê, vui lòng thử lại.",
                                  );
                                }
                              } else {
                                setTenants(updated);
                              }
                            },
                          },
                        ],
                      );
                    }}
                  >
                    <Text style={styles.tenantRemoveText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnCancel, { flex: 1 }]}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.btnCancelText}>Hủy</Text>
        </TouchableOpacity>

        <View style={{ width: 15 }} />

        <TouchableOpacity
          style={[submitting && { opacity: 0.7 }, { flex: 1 }]}
          onPress={handleSave}
          disabled={submitting}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={[styles.actionBtnGreen, { width: "100%" }]}
          >
            <Text style={styles.actionTextGreen}>
              {submitting
                ? isEditMode
                  ? "Đang lưu..."
                  : "Đang tạo..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Lưu phòng"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  actionTextGreen: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: "bold",
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
    paddingTop: Platform.OS === "android" ? 50 : 50,
    paddingBottom: SPACING.CREATE_HEADER_PADDING_VERTICAL,
  },
  backButton: {
    width: IMAGE_SIZE.BACK_BUTTON_ICON_WIDTH + 20,
    height: IMAGE_SIZE.BACK_BUTTON_ICON_HEIGHT + 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE_MORE_TRANSPARENT,
    borderRadius: BORDER_RADIUS.BACK_BUTTON,
  },
  headerTitle: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.HEADER_TITLE,
    fontWeight: "bold",
  },
  headerRightPlaceholder: {
    width: IMAGE_SIZE.BACK_BUTTON_ICON_WIDTH + 20,
  },
  scrollContent: {
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    paddingTop: SPACING.SCROLL_TOP_PADDING,
    paddingBottom: SPACING.SCROLL_BOTTOM_PADDING + 60,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.CREATE_FORM_SECTION_MARGIN_BOTTOM,
  },
  singleRow: {
    marginBottom: SPACING.CREATE_FORM_SECTION_MARGIN_BOTTOM,
  },
  inputWrapper: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.CREATE_LABEL_MARGIN_BOTTOM,
  },
  inputIcon: {
    marginRight: SPACING.ICON_MARGIN_RIGHT,
  },
  label: {
    fontSize: FONT_SIZE.CREATE_FORM_LABEL,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  input: {
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingHorizontal: SPACING.CREATE_INPUT_PADDING_HORIZONTAL,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    color: COLORS.textInput,
  },
  dateInput: {
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingHorizontal: SPACING.CREATE_INPUT_PADDING_HORIZONTAL,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
    justifyContent: "center",
  },
  dateText: {
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    color: COLORS.textInput,
  },
  datePlaceholderText: {
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    color: COLORS.PLACEHOLDER_GRAY,
  },
  statusSection: {
    marginTop: SPACING.SMALL,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: SPACING.XS,
  },
  actionBtnGreen: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    flex: 1,
  },
  statusButton: {
    flex: 1,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  statusInactive: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_GRAY,
  },
  statusActiveEmpty: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
  },
  statusActiveRented: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warningBorder,
  },
  statusText: {
    fontSize: FONT_SIZE.CREATE_FORM_LABEL,
    fontWeight: "600",
  },
  tenantsSection: {
    marginTop: SPACING.MEDIUM,
  },
  tenantsTitle: {
    fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE - 4,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SMALL,
  },
  tenantItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    paddingHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  tenantName: {
    fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE - 6,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  tenantText: {
    fontSize: FONT_SIZE.ADDRESS,
    color: COLORS.TEXT_SECONDARY,
  },
  tenantRemoveButton: {
    marginLeft: SPACING.SMALL,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.RED_LIGHT_BG,
  },
  tenantRemoveText: {
    color: COLORS.RED_TEXT,
    fontWeight: "bold",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    paddingVertical: SPACING.CREATE_FOOTER_PADDING_VERTICAL,
    borderTopWidth: 1,
    borderTopColor: COLORS.DIVIDER_GRAY,
    paddingBottom:
      Platform.OS === "ios"
        ? SPACING.PROFILE_SCREEN_PADDING_BOTTOM
        : SPACING.MEDIUM,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: SPACING.CREATE_FOOTER_BUTTON_PADDING_VERTICAL,
    borderRadius: BORDER_RADIUS.BUTTON,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },
  btnCancelText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.BUTTON,
    fontWeight: "600",
  },
  btnSave: {
    flex: 1,
    paddingVertical: SPACING.CREATE_FOOTER_BUTTON_PADDING_VERTICAL,
    borderRadius: BORDER_RADIUS.BUTTON,
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    ...SHADOW.CARD,
  },
  btnSaveText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.CREATE_FOOTER_BUTTON,
    fontWeight: "bold",
  },
});

export default CreateNewRoomScreen;