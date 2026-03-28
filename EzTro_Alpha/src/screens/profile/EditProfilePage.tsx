import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CreditCard,
  Hash,
  Mail,
  Phone,
  Save,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { putUserApi } from "../../api/user/user";
import { AppButton } from "../../components/misc/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { setUser } from "../../features/auth/authSlice";
import { NavigationProp } from "../../navigation/navigation.type";
import { AppDispatch, RootState } from "../../stores/store";
import { IUser } from "../../types/users";

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const EditProfilePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
  );
  const [bankName, setBankName] = useState(user?.bankName ?? "");
  const [bankNumber, setBankNumber] = useState(user?.bankNumber ?? "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isLandlord = user?.roleName === "Landlord";

  // ─── Date Picker ──────────────────────────────────────────────────────────

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) setDateOfBirth(selected);
  };

  // ─── Avatar Picker ────────────────────────────────────────────────────────

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Cần cấp quyền truy cập camera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setLocalAvatarUri(result.assets[0].uri);
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setLocalAvatarUri(result.assets[0].uri);
  };

  const handlePickAvatar = () => {
    Alert.alert("Đổi ảnh đại diện", "Chọn nguồn ảnh", [
      { text: "Chụp ảnh", onPress: openCamera },
      { text: "Chọn từ thư viện", onPress: openLibrary },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  // ─── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (isSaving) return;
    if (!firstName.trim()) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return;
    }
    if (!lastName.trim()) {
      Alert.alert("Lỗi", "Họ không được để trống");
      return;
    }
    setIsSaving(true);
    try {
      let updatedUser: IUser = {
        ...user!,
        firstName,
        lastName,
        email,
        dateOfBirth,
      };

      if (localAvatarUri) {
        const userWithAvatar = await putUserApi.uploadAvatar(localAvatarUri);
        updatedUser = {
          ...updatedUser,
          profilePicture: userWithAvatar.profilePicture,
        };
      }

      await putUserApi.updateProfile({
        firstName,
        lastName,
        email,
        dateOfBirth,
      });

      if (isLandlord) {
        await putUserApi.updateBankInfo(bankName, bankNumber);
        updatedUser = { ...updatedUser, bankName, bankNumber };
      }

      dispatch(setUser(updatedUser));
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      navigation.goBack();
    } catch {
      Alert.alert("Lỗi", "Cập nhật thông tin thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const getInputStyle = (fieldName: string) =>
    activeField === fieldName
      ? [styles.input, styles.inputActive]
      : styles.input;

  const avatarSource = localAvatarUri
    ? { uri: localAvatarUri }
    : user?.profilePicture
      ? { uri: user.profilePicture }
      : undefined;

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft
            size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
            color={COLORS.WHITE}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Save
              size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
              color={COLORS.WHITE}
            />
          )}
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePickAvatar}
              activeOpacity={0.8}
            >
              {avatarSource ? (
                <Image source={avatarSource} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={[
                    COLORS.AVATAR_GRADIENT_START,
                    COLORS.AVATAR_GRADIENT_END,
                  ]}
                  style={styles.avatarPlaceholder}
                >
                  <User
                    size={IMAGE_SIZE.EDIT_PROFILE_AVATAR_ICON_SIZE}
                    color={COLORS.WHITE}
                  />
                </LinearGradient>
              )}
              {/* Camera badge */}
              <View style={styles.cameraBadge}>
                <Camera size={14} color={COLORS.WHITE} />
              </View>
            </TouchableOpacity>

            <AppButton
              title="Đổi ảnh đại diện"
              onPress={handlePickAvatar}
              variant="gradient"
              leftIcon={
                <Camera
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.WHITE}
                />
              }
              style={styles.cameraButton}
            />
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Last Name */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <User
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRADIENT_START}
                />
                <Text style={styles.label}> Họ</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={getInputStyle("lastName")}
                placeholder="Nguyễn"
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setActiveField("lastName")}
                onBlur={() => setActiveField(null)}
              />
            </View>

            {/* First Name */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <User
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRADIENT_START}
                />
                <Text style={styles.label}> Tên</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={getInputStyle("firstName")}
                placeholder="Văn A"
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setActiveField("firstName")}
                onBlur={() => setActiveField(null)}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Mail
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRADIENT_START}
                />
                <Text style={styles.label}> Email</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[getInputStyle("email"), styles.inputDisabled]}
                placeholder="example@email.com"
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                editable={false}
              />
            </View>

            {/* Phone — read-only */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Phone
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRADIENT_START}
                />
                <Text style={styles.label}> Số điện thoại</Text>
              </View>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                value={user?.phoneNumber ?? ""}
                editable={false}
              />
            </View>

            {/* Birthday */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Calendar
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRADIENT_START}
                />
                <Text style={styles.label}> Ngày sinh</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.datePicker,
                  showDatePicker && styles.inputActive,
                ]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
                <Calendar
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRAY_TEXT}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Bank Info — Landlord only */}
            {isLandlord && (
              <>
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>
                </View>

                <View style={styles.fieldSection}>
                  <View style={styles.labelRow}>
                    <CreditCard
                      size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                      color={COLORS.GRADIENT_START}
                    />
                    <Text style={styles.label}> Tên ngân hàng</Text>
                  </View>
                  <TextInput
                    style={getInputStyle("bankName")}
                    placeholder="VD: Vietcombank, Techcombank..."
                    placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                    value={bankName}
                    onChangeText={setBankName}
                    onFocus={() => setActiveField("bankName")}
                    onBlur={() => setActiveField(null)}
                  />
                </View>

                <View style={styles.fieldSection}>
                  <View style={styles.labelRow}>
                    <Hash
                      size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                      color={COLORS.GRADIENT_START}
                    />
                    <Text style={styles.label}> Số tài khoản</Text>
                  </View>
                  <TextInput
                    style={getInputStyle("bankNumber")}
                    placeholder="VD: 0123456789"
                    placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                    value={bankNumber}
                    onChangeText={setBankNumber}
                    keyboardType="numeric"
                    onFocus={() => setActiveField("bankNumber")}
                    onBlur={() => setActiveField(null)}
                  />
                </View>
              </>
            )}

            {/* Save Button */}
            <AppButton
              title={isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              onPress={handleSave}
              variant="gradient"
              leftIcon={
                isSaving ? (
                  <ActivityIndicator size="small" color={COLORS.WHITE} />
                ) : (
                  <Save
                    size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                    color={COLORS.WHITE}
                  />
                )
              }
              disabled={isSaving}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PROFILE_BACKGROUND,
  },
  flex: {
    flex: 1,
  },
  // ─── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.XXXL,
    paddingTop: SPACING.EXTRA_LARGE,
    paddingBottom: SPACING.MEDIUM,
    height: SPACING.PROFILE_HEADER_HEIGHT,
  },
  headerButton: {
    width: IMAGE_SIZE.EDIT_PROFILE_HEADER_BUTTON_SIZE,
    height: IMAGE_SIZE.EDIT_PROFILE_HEADER_BUTTON_SIZE,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.HEADER_TITLE,
    fontWeight: "bold",
  },
  // ─── ScrollView ───────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.EXTRA_EXTRA_LARGE,
  },
  // ─── Avatar Section ───────────────────────────────────────────────────────
  avatarSection: {
    alignItems: "center",
    paddingTop: SPACING.EDIT_PROFILE_AVATAR_SECTION_GAP,
    paddingBottom: SPACING.EDIT_PROFILE_AVATAR_BOTTOM_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_GRAY,
    gap: SPACING.EDIT_PROFILE_AVATAR_SECTION_GAP,
  },
  avatarWrapper: {
    position: "relative",
    width: IMAGE_SIZE.EDIT_PROFILE_AVATAR_SIZE,
    height: IMAGE_SIZE.EDIT_PROFILE_AVATAR_SIZE,
  },
  avatarImage: {
    width: IMAGE_SIZE.EDIT_PROFILE_AVATAR_SIZE,
    height: IMAGE_SIZE.EDIT_PROFILE_AVATAR_SIZE,
    borderRadius: BORDER_RADIUS.PROFILE_BADGE,
  },
  avatarPlaceholder: {
    width: IMAGE_SIZE.EDIT_PROFILE_AVATAR_SIZE,
    height: IMAGE_SIZE.EDIT_PROFILE_AVATAR_SIZE,
    borderRadius: BORDER_RADIUS.PROFILE_BADGE,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.GRADIENT_START,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  cameraButton: {
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
  },
  // ─── Form ─────────────────────────────────────────────────────────────────
  form: {
    paddingHorizontal: SPACING.INPUT_VERTICAL_PADDING,
    paddingTop: SPACING.EDIT_PROFILE_AVATAR_SECTION_GAP,
    gap: SPACING.EDIT_PROFILE_FORM_SECTION_GAP,
  },
  fieldSection: {
    gap: SPACING.EDIT_PROFILE_LABEL_GAP,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: COLORS.GRAY_DARK,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    fontWeight: "600",
  },
  required: {
    color: COLORS.REQUIRED_ASTERISK,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    fontWeight: "600",
  },
  // ─── Inputs ───────────────────────────────────────────────────────────────
  input: {
    height: IMAGE_SIZE.EDIT_PROFILE_INPUT_HEIGHT,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_GRAY,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingHorizontal: SPACING.CREATE_INPUT_PADDING_HORIZONTAL,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    color: COLORS.GRAY_DARK,
  },
  inputActive: {
    borderColor: COLORS.GREEN_INPUT_BORDER,
    shadowColor: COLORS.LIGHT_GREEN_BACKGROUND,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: COLORS.PROFILE_BACKGROUND,
    color: COLORS.LIGHT_GRAY_TEXT,
  },
  // ─── Date Picker ──────────────────────────────────────────────────────────
  datePicker: {
    height: IMAGE_SIZE.EDIT_PROFILE_INPUT_HEIGHT,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_GRAY,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingHorizontal: SPACING.CREATE_INPUT_PADDING_HORIZONTAL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    color: COLORS.DARK_TEXT,
  },
  // ─── Bank Info Section ────────────────────────────────────────────────────
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
    paddingTop: SPACING.MEDIUM,
  },
  sectionTitle: {
    color: COLORS.GRADIENT_START,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    fontWeight: "700",
  },
  // ─── Save Button ──────────────────────────────────────────────────────────
  saveButton: {
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
  },
});
