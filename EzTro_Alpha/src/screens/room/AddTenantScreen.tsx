import React, { useState } from "react";
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
} from "../../constants/theme";

type AddTenantRouteProps = RouteProp<MainStackParamList, "addTenantScreen">;

const AddTenantScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddTenantRouteProps>();
  const { roomId, room } = route.params || {};

  const existingRoom = room as IRoom | undefined;

  const [tenantName, setTenantName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [joinDate, setJoinDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!tenantName || !phoneNumber || !joinDate) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin người thuê.");
      return;
    }

    if (!roomId) {
      Alert.alert("Lỗi", "Thiếu thông tin phòng. Vui lòng thử lại.");
      return;
    }

    const newTenant: IVirtualTenant = {
      tenantName: tenantName.trim(),
      phoneNumber: phoneNumber.trim(),
      joinDate: new Date(joinDate),
    };

    const currentTenants = existingRoom?.virtualTenants || [];
    const payload = {
      virtualTenants: [...currentTenants, newTenant],
    };

    setSubmitting(true);
    try {
      const raw = await postRoomApi.updateRoom(roomId, payload);
      const res = raw as ApiResponse<IRoom>;

      if (res.status === "success" || res.status === true) {
        Alert.alert("Thành công", "Thêm người thuê thành công", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
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
            size={19}
            color={COLORS.textWhite}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Thêm người thuê</Text>
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
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin người thuê</Text>

            <View style={styles.singleRow}>
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={18}
                    color={COLORS.PRIMARY}
                    style={styles.inputIcon}
                  />
                  <Text style={styles.label}>Họ và tên</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
                  value={tenantName}
                  onChangeText={setTenantName}
                />
              </View>
            </View>

            <View style={styles.singleRow}>
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={18}
                    color={COLORS.PRIMARY}
                    style={styles.inputIcon}
                  />
                  <Text style={styles.label}>Số điện thoại</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0901234567"
                  placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
                  value={phoneNumber}
                  keyboardType="phone-pad"
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            <View style={styles.singleRow}>
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons
                    name="calendar-check-outline"
                    size={18}
                    color={COLORS.PRIMARY}
                    style={styles.inputIcon}
                  />
                  <Text style={styles.label}>Ngày vào ở</Text>
                </View>

                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{joinDate || "Chọn ngày"}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={joinDate ? new Date(joinDate) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(_event: any, selectedDate?: Date) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setJoinDate(selectedDate.toISOString().slice(0, 10));
                      }
                    }}
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.addButtonWrapper,
                submitting && { opacity: 0.7 },
              ]}
              onPress={handleSave}
              disabled={submitting}
            >
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>
                  {submitting ? "Đang thêm..." : "Thêm người thuê"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {existingRoom?.virtualTenants && existingRoom.virtualTenants.length > 0 && (
              <View style={styles.currentTenantCard}>
                {existingRoom.virtualTenants.map((t, idx) => (
                  <View key={`${t.tenantName}-${idx}`} style={styles.tenantItem}>
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
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
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
    width: 40,
    height: 40,
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
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    paddingTop: SPACING.SCROLL_TOP_PADDING,
    paddingBottom: SPACING.SCROLL_BOTTOM_PADDING + 60,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.CREATE_FORM_CARD,
    padding: SPACING.CONTENT_VERTICAL_PADDING,
    ...SHADOW.CARD,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SECTION_SPACING / 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.CREATE_FORM_SECTION_MARGIN_BOTTOM / 1.5,
  },
  singleRow: {
    marginBottom: SPACING.CREATE_FORM_SECTION_MARGIN_BOTTOM / 1.5,
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
  addButtonWrapper: {
    marginTop: SPACING.MEDIUM,
  },
  addButton: {
    borderRadius: BORDER_RADIUS.BUTTON,
    paddingVertical: SPACING.CREATE_FOOTER_BUTTON_PADDING_VERTICAL,
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.CREATE_FOOTER_BUTTON,
    fontWeight: "bold",
  },
  currentTenantCard: {
    marginTop: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.CREATE_FORM_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  tenantItem: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  tenantName: {
    fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE - 4,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  tenantText: {
    fontSize: FONT_SIZE.ADDRESS,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default AddTenantScreen;

