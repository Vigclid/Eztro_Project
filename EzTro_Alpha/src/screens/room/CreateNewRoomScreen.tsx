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
import { getRoomApi, postRoomApi } from "../../api/room/room";
import { getUserApi } from "../../api/user/user";
import { ApiResponse } from "../../types/app.common";
import { Trash2 } from 'lucide-react-native';
import { IRoom, IVirtualTenant } from "../../types/room";
import { IUser } from "../../types/users";
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
  const [inviteCode, setInviteCode] = useState("");
  const [generatingCode, setGeneratingCode] = useState(false);
  const [roomMembers, setRoomMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchingTenants, setSearchingTenants] = useState(false);
  const [tenantResults, setTenantResults] = useState<IUser[]>([]);
  const [invitingTenant, setInvitingTenant] = useState(false);
  const [editingVirtualIndex, setEditingVirtualIndex] = useState<number | null>(null);
  const [editingVirtualTenant, setEditingVirtualTenant] = useState<{
    tenantName: string;
    phoneNumber: string;
    joinDate: string;
  }>({
    tenantName: "",
    phoneNumber: "",
    joinDate: new Date().toISOString().slice(0, 10),
  });
  const [showVirtualTenantDatePicker, setShowVirtualTenantDatePicker] =
    useState(false);

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

  const fetchRoomMembers = async () => {
    if (!editingRoom?._id) return;

    setLoadingMembers(true);
    try {
      const raw = await getRoomApi.getRoomMembers(editingRoom._id);
      const res = raw as ApiResponse<any[]>;
      if (res.status === "success" && Array.isArray(res.data)) {
        setRoomMembers(res.data);
      } else {
        setRoomMembers([]);
      }
    } catch {
      setRoomMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (isEditMode && editingRoom?._id) {
      fetchRoomMembers();
    }
  }, [isEditMode, editingRoom?._id]);

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

  const handleGenerateInviteCode = async () => {
    if (!editingRoom?._id) {
      Alert.alert("Thông báo", "Bạn cần lưu phòng trước khi tạo mã mời.");
      return;
    }

    setGeneratingCode(true);
    try {
      const raw = await postRoomApi.createInviteCode(editingRoom._id);
      const res = raw as ApiResponse<any>;

      if (res.status === "success") {
        const code = res.data?.inviteCode || "";
        setInviteCode(String(code));
        Alert.alert("Thành công", `Mã mời phòng: ${code}`);
      } else {
        Alert.alert("Lỗi", res.message || "Không thể tạo mã mời.");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo mã mời lúc này."
      );
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleRemoveRoomMember = async (member: any) => {
    Alert.alert(
      "Xác nhận",
      `Xóa ${(member?.userId?.lastName || "") + " " + (member?.userId?.firstName || "")} khỏi phòng?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const raw = await postRoomApi.removeRoomMember(String(member._id));
              const res = raw as ApiResponse<any>;
              if (res.status === "success") {
                Alert.alert("Thành công", "Đã xóa thành viên khỏi phòng");
                fetchRoomMembers();
                onRefresh?.();
              } else {
                Alert.alert("Lỗi", res.message || "Không thể xóa thành viên");
              }
            } catch (error: any) {
              Alert.alert(
                "Lỗi",
                error?.response?.data?.message ||
                error?.message ||
                "Không thể xóa thành viên lúc này"
              );
            }
          },
        },
      ]
    );
  };

  const getTenantDisplayName = (user: IUser) => {
    const fullName = `${user.lastName || ""} ${user.firstName || ""}`.trim();
    return fullName || user.email || "Không rõ tên";
  };

  const handleSearchTenantByPhone = async () => {
    if (!searchPhone.trim()) {
      setTenantResults([]);
      Alert.alert("Thông báo", "Vui lòng nhập số điện thoại để tìm kiếm.");
      return;
    }

    setSearchingTenants(true);
    try {
      const raw = await getUserApi.getAllTenants(searchPhone.trim());
      const res = raw as ApiResponse<IUser[]>;
      if (res.status === "success" && Array.isArray(res.data)) {
        setTenantResults(res.data);
      } else {
        setTenantResults([]);
        Alert.alert("Thông báo", res.message || "Không tìm thấy người thuê phù hợp.");
      }
    } catch (error: any) {
      setTenantResults([]);
      Alert.alert("Lỗi", error?.message || "Không thể tìm người thuê lúc này.");
    } finally {
      setSearchingTenants(false);
    }
  };

  const handleInviteTenantAccount = async (tenant: IUser) => {
    if (!editingRoom?._id) {
      Alert.alert("Lỗi", "Thiếu thông tin phòng. Vui lòng thử lại.");
      return;
    }

    setInvitingTenant(true);
    try {
      const raw = await postRoomApi.inviteTenant(editingRoom._id, String(tenant._id));
      const res = (raw || {
        status: "error",
        message: "Không nhận được phản hồi từ máy chủ.",
      }) as ApiResponse<any>;

      if (res.status === "success" || res.status === true) {
        Alert.alert("Thành công", "Đã gửi lời mời cho người thuê.");
        fetchRoomMembers();
        onRefresh?.();
      } else {
        Alert.alert("Lỗi", res.message || "Không thể gửi lời mời.");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message ||
        error?.message ||
        "Không thể gửi lời mời lúc này."
      );
    } finally {
      setInvitingTenant(false);
    }
  };

  const keepDigitsOnly = (text: string) => text.replace(/\D/g, "");

  const handleStartEditVirtualTenant = (tenant: IVirtualTenant, index: number) => {
    setEditingVirtualIndex(index);
    setEditingVirtualTenant({
      tenantName: tenant.tenantName || "",
      phoneNumber: tenant.phoneNumber || "",
      joinDate: tenant.joinDate
        ? new Date(tenant.joinDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });
  };

  const handleCancelEditVirtualTenant = () => {
    setEditingVirtualIndex(null);
    setEditingVirtualTenant({
      tenantName: "",
      phoneNumber: "",
      joinDate: new Date().toISOString().slice(0, 10),
    });
    setShowVirtualTenantDatePicker(false);
  };

  const handleSaveEditVirtualTenant = async () => {
    if (editingVirtualIndex === null) return;

    if (
      !editingVirtualTenant.tenantName.trim() ||
      !editingVirtualTenant.phoneNumber.trim() ||
      !editingVirtualTenant.joinDate
    ) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin người thuê.");
      return;
    }

    const updated = tenants.map((tenant, idx) =>
      idx === editingVirtualIndex
        ? {
            tenantName: editingVirtualTenant.tenantName.trim(),
            phoneNumber: editingVirtualTenant.phoneNumber.trim(),
            joinDate: new Date(editingVirtualTenant.joinDate),
          }
        : tenant
    );

    if (isEditMode && editingRoom?._id) {
      try {
        const raw = await postRoomApi.updateRoom(editingRoom._id, {
          virtualTenants: updated,
        });
        const res = raw as ApiResponse<IRoom>;
        if (res.status === "success" || res.status === true) {
          setTenants(updated);
          onRefresh?.();
          handleCancelEditVirtualTenant();
          Alert.alert("Thành công", "Đã cập nhật thông tin người thuê.");
        } else {
          Alert.alert(
            "Lỗi",
            res.message || "Không thể cập nhật người thuê, vui lòng thử lại."
          );
        }
      } catch (error: any) {
        Alert.alert(
          "Lỗi",
          error?.message || "Không thể cập nhật người thuê, vui lòng thử lại."
        );
      }
      return;
    }

    setTenants(updated);
    handleCancelEditVirtualTenant();
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

          {isEditMode && (
            <View style={styles.statusSection}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons
                  name="key-outline"
                  size={18}
                  color={COLORS.PRIMARY}
                  style={styles.inputIcon}
                />
                <Text style={styles.label}>Mã mời tham gia phòng</Text>
              </View>

              <TouchableOpacity
                style={styles.btnCancel}
                onPress={handleGenerateInviteCode}
                disabled={generatingCode}
              >
                <Text style={styles.btnCancelText}>
                  {generatingCode ? "Đang tạo mã..." : "Tạo mã phòng 6 số"}
                </Text>
              </TouchableOpacity>

              {inviteCode ? (
                <Text style={[styles.tenantsTitle, { marginTop: SPACING.SMALL }]}>
                  Mã hiện tại: {inviteCode}
                </Text>
              ) : null}
            </View>
          )}

          {isEditMode && (
            <View style={styles.tenantsSection}>
              <Text style={styles.tenantsTitle}>Mời theo số điện thoại</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Nhập số điện thoại người thuê"
                  placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
                  value={searchPhone}
                  keyboardType="phone-pad"
                  onChangeText={setSearchPhone}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearchTenantByPhone}
                  disabled={searchingTenants || invitingTenant}
                >
                  <Text style={styles.searchButtonText}>
                    {searchingTenants ? "Đang tìm..." : "Tìm"}
                  </Text>
                </TouchableOpacity>
              </View>

              {tenantResults.length > 0 && (
                <View style={{ marginTop: SPACING.SMALL }}>
                  {tenantResults.map((tenant) => (
                    <View key={String(tenant._id)} style={styles.tenantItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tenantName}>{getTenantDisplayName(tenant)}</Text>
                        <Text style={styles.tenantText}>
                          {tenant.phoneNumber || tenant.email || "Không có liên hệ"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.searchButton}
                        disabled={invitingTenant}
                        onPress={() =>
                          Alert.alert(
                            "Xác nhận gửi lời mời",
                            `Gửi lời mời đến ${getTenantDisplayName(tenant)}?`,
                            [
                              { text: "Hủy", style: "cancel" },
                              {
                                text: "Mời",
                                onPress: () => handleInviteTenantAccount(tenant),
                              },
                            ]
                          )
                        }
                      >
                        <Text style={styles.searchButtonText}>
                          {invitingTenant ? "Đang gửi..." : "Mời"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {isEditMode && (
            <View style={styles.tenantsSection}>
              <Text style={styles.tenantsTitle}>Thành viên phòng (tài khoản)</Text>
              {loadingMembers ? (
                <Text style={styles.tenantText}>Đang tải danh sách thành viên...</Text>
              ) : roomMembers.length === 0 ? (
                <Text style={styles.tenantText}>Chưa có thành viên nào trong phòng</Text>
              ) : (
                roomMembers.map((member) => {
                  const fullName = `${member?.userId?.lastName || ""} ${member?.userId?.firstName || ""}`.trim();
                  return (
                    <View key={String(member._id)} style={styles.tenantItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tenantName}>{fullName || "Không rõ tên"}</Text>
                        <Text style={styles.tenantText}>
                          {member?.userId?.phoneNumber || member?.userId?.email || "Không có liên hệ"}
                        </Text>
                        <Text style={styles.tenantText}>
                          Vai trò: {member?.role === "TENANT" ? "Người thuê chính" : "Người thuê phụ"}
                        </Text>
                        <Text style={styles.tenantText}>
                          Ngày vào ở: {member?.moveInDate ? new Date(member.moveInDate).toISOString().slice(0, 10) : "--/--/----"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.tenantRemoveButton}
                        onPress={() => handleRemoveRoomMember(member)}
                      >
                        <Trash2 size={20} color={COLORS.RED_TEXT} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          )}

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
                  <View style={styles.tenantActionGroup}>
                    <TouchableOpacity
                      style={styles.tenantEditButton}
                      onPress={() => handleStartEditVirtualTenant(t, index)}
                    >
                      <Text style={styles.tenantEditText}>Sửa</Text>
                    </TouchableOpacity>
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
                      <Trash2 size={20} color={COLORS.RED_TEXT} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {editingVirtualIndex !== null && (
                <View style={styles.editVirtualCard}>
                  <Text style={styles.tenantsTitle}>Chỉnh sửa thông tin người thuê</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Họ và tên"
                    placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
                    value={editingVirtualTenant.tenantName}
                    onChangeText={(text) =>
                      setEditingVirtualTenant((prev) => ({
                        ...prev,
                        tenantName: text,
                      }))
                    }
                  />

                  <TextInput
                    style={[styles.input, { marginTop: SPACING.SMALL }]}
                    placeholder="Số điện thoại"
                    placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
                    keyboardType="phone-pad"
                    value={editingVirtualTenant.phoneNumber}
                    onChangeText={(text) =>
                      setEditingVirtualTenant((prev) => ({
                        ...prev,
                        phoneNumber: keepDigitsOnly(text),
                      }))
                    }
                  />

                  <TouchableOpacity
                    style={[styles.dateInput, { marginTop: SPACING.SMALL }]}
                    onPress={() => setShowVirtualTenantDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {editingVirtualTenant.joinDate || "Chọn ngày vào ở"}
                    </Text>
                  </TouchableOpacity>

                  {showVirtualTenantDatePicker && (
                    <DateTimePicker
                      value={
                        editingVirtualTenant.joinDate
                          ? new Date(editingVirtualTenant.joinDate)
                          : new Date()
                      }
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(_event: any, selectedDate?: Date) => {
                        setShowVirtualTenantDatePicker(false);
                        if (selectedDate) {
                          setEditingVirtualTenant((prev) => ({
                            ...prev,
                            joinDate: selectedDate.toISOString().slice(0, 10),
                          }));
                        }
                      }}
                    />
                  )}

                  <View style={styles.editVirtualActions}>
                    <TouchableOpacity
                      style={[styles.btnCancel, { flex: 1 }]}
                      onPress={handleCancelEditVirtualTenant}
                    >
                      <Text style={styles.btnCancelText}>Hủy</Text>
                    </TouchableOpacity>
                    <View style={{ width: 12 }} />
                    <TouchableOpacity
                      style={[styles.searchButton, { flex: 1 }]}
                      onPress={handleSaveEditVirtualTenant}
                    >
                      <Text style={styles.searchButtonText}>Lưu chỉnh sửa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
  tenantActionGroup: {
    marginLeft: SPACING.SMALL,
    alignItems: "center",
    justifyContent: "center",
  },
  tenantEditButton: {
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  tenantEditText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: "600",
  },
  editVirtualCard: {
    marginTop: SPACING.SMALL,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    padding: SPACING.MEDIUM,
  },
  editVirtualActions: {
    marginTop: SPACING.SMALL,
    flexDirection: "row",
    alignItems: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SMALL,
  },
  searchButton: {
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: 12,
    backgroundColor: COLORS.GREEN_PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.ADDRESS,
    fontWeight: "600",
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