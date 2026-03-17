import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, FileText, Home, Wrench } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getHouseApi } from "../../api/house/house";
import { getRoomApi } from "../../api/room/room";
import { postTicketApi } from "../../api/ticket/ticketapi";
import { COLORS } from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";
import { RootState } from "../../stores/store";
import { IHouse } from "../../types/house";
import { IRoom } from "../../types/room";
import { styles } from "./styles/CreateTicketScreen.styles";

type Category = {
  value: string;
  label: string;
  icon: string;
};

export const CreateTicketScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);

  // Get user role
  const getUserRole = () => {
    if (user?.roleName) return user.roleName;
    if (
      user?.roleId &&
      typeof user.roleId === "object" &&
      "name" in user.roleId
    ) {
      return (user.roleId as any).name;
    }
    return "";
  };

  const userRole = getUserRole();
  const isLandlord = userRole === "Landlord" || userRole === "landlord";
  const isTenant = userRole === "Tenant" || userRole === "tenant";

  const [houses, setHouses] = useState<IHouse[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [tenantRoom, setTenantRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    houseId: "",
    roomId: "",
    title: "",
    description: "",
    category: "other",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: Category[] = [
    { value: "plumbing", label: "Hệ thống nước", icon: "💧" },
    { value: "electrical", label: "Hệ thống điện", icon: "⚡" },
    { value: "furniture", label: "Đồ đạc", icon: "🪑" },
    { value: "appliance", label: "Thiết bị điện", icon: "🔌" },
    { value: "structure", label: "Kết cấu", icon: "🏗️" },
    { value: "other", label: "Khác", icon: "🔧" },
  ];

  useEffect(() => {
    if (isLandlord) {
      loadHouses();
    } else if (isTenant) {
      loadTenantRoom();
    }
  }, [isLandlord, isTenant]);

  useEffect(() => {
    if (formData.houseId) {
      loadRooms(formData.houseId);
    } else {
      setRooms([]);
    }
  }, [formData.houseId]);

  const loadHouses = async () => {
    try {
      const response: any = await getHouseApi.getAllHousesByLandlordId();
      if (response.status && response.data) {
        const housesData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setHouses(housesData);
      }
    } catch (error) {}
  };

  const loadTenantRoom = async () => {
    try {
      const response: any = await getRoomApi.getMyActiveRoom();
      if (response.status && response.data) {
        setTenantRoom(response.data);
        // Auto-fill form data for tenant
        setFormData({
          houseId: response.data.house?._id || "",
          roomId: response.data.room?._id || "",
          title: "",
          description: "",
          category: "other",
        });
      }
    } catch (error) {}
  };

  const loadRooms = async (houseId: string) => {
    try {
      const response: any = await getRoomApi.getAllRoomsByHouseId(houseId);
      if (response.status && response.data) {
        const roomsData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setRooms(roomsData);
      }
    } catch (error) {}
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Landlord needs to select house and room
    if (isLandlord) {
      if (!formData.houseId) {
        newErrors.houseId = "Vui lòng chọn cụm trọ";
      }

      if (!formData.roomId) {
        newErrors.roomId = "Vui lòng chọn phòng";
      }
    }

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng mô tả vấn đề";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn loại sự cố";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response: any;

      if (isLandlord) {
        const requestData = {
          title: formData.title,
          description: formData.description,
          categories: [formData.category],
          houseId: formData.houseId,
          roomId: formData.roomId,
        };
        response = await postTicketApi.createTicketByLandlord(requestData);
      } else if (isTenant) {
        const requestData = {
          title: formData.title,
          description: formData.description,
          categories: [formData.category],
        };
        response = await postTicketApi.createTicketByTenant(requestData);
      }

      if (response.status && response.data) {
        Alert.alert("Thành công", "Tạo yêu cầu bảo trì thành công", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.error?.message || "Không thể tạo yêu cầu. Vui lòng thử lại.",
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo yêu cầu. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo yêu cầu bảo trì</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* House Selection - Only for Landlord */}
          {isLandlord && (
            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <Home size={20} color={COLORS.GREEN_PRIMARY} />
                <Text style={styles.label}>Cụm trọ</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectScroll}
              >
                {houses.map((house) => (
                  <TouchableOpacity
                    key={house._id}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        houseId: house._id || "",
                        roomId: "",
                      })
                    }
                    style={[
                      styles.selectOption,
                      formData.houseId === house._id &&
                        styles.selectOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        formData.houseId === house._id &&
                          styles.selectOptionTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {house.houseName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.houseId && (
                <Text style={styles.errorText}>{errors.houseId}</Text>
              )}
            </View>
          )}

          {/* House Info - For Tenant */}
          {isTenant && tenantRoom && (
            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <Home size={20} color={COLORS.GREEN_PRIMARY} />
                <Text style={styles.label}>Cụm trọ</Text>
              </View>
              <View style={[styles.selectOption, styles.selectOptionActive]}>
                <Text
                  style={[
                    styles.selectOptionText,
                    styles.selectOptionTextActive,
                  ]}
                >
                  {tenantRoom.house?.houseName || "Không xác định"}
                </Text>
              </View>
            </View>
          )}

          {/* Room Selection - Only for Landlord */}
          {isLandlord && formData.houseId && rooms.length > 0 && (
            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <Home size={20} color={COLORS.GREEN_PRIMARY} />
                <Text style={styles.label}>Phòng</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectScroll}
              >
                {rooms.map((room) => (
                  <TouchableOpacity
                    key={room._id}
                    onPress={() =>
                      setFormData({ ...formData, roomId: room._id || "" })
                    }
                    style={[
                      styles.selectOption,
                      formData.roomId === room._id && styles.selectOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        formData.roomId === room._id &&
                          styles.selectOptionTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {room.roomName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.roomId && (
                <Text style={styles.errorText}>{errors.roomId}</Text>
              )}
            </View>
          )}

          {/* Room Info - For Tenant */}
          {isTenant && tenantRoom && (
            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <Home size={20} color={COLORS.GREEN_PRIMARY} />
                <Text style={styles.label}>Phòng</Text>
              </View>
              <View style={[styles.selectOption, styles.selectOptionActive]}>
                <Text
                  style={[
                    styles.selectOptionText,
                    styles.selectOptionTextActive,
                  ]}
                >
                  {tenantRoom.room?.roomName || "Không xác định"}
                </Text>
              </View>
            </View>
          )}

          {/* Category Selection */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Wrench size={20} color={COLORS.GREEN_PRIMARY} />
              <Text style={styles.label}>Loại sự cố</Text>
            </View>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() =>
                    setFormData({ ...formData, category: cat.value })
                  }
                  style={[
                    styles.categoryCard,
                    formData.category === cat.value &&
                      styles.categoryCardActive,
                  ]}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          {/* Title */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <FileText size={20} color={COLORS.GREEN_PRIMARY} />
              <Text style={styles.label}>Tiêu đề</Text>
            </View>
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              style={styles.input}
              placeholder="VD: Rò rỉ nước tại phòng 201"
              placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <FileText size={20} color={COLORS.GREEN_PRIMARY} />
              <Text style={styles.label}>Mô tả chi tiết</Text>
            </View>
            <TextInput
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả chi tiết về sự cố, vị trí, mức độ nghiêm trọng..."
              placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Tạo yêu cầu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};
