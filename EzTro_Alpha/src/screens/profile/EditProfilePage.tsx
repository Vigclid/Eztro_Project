import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Mail,
  Phone,
  Save,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
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
import { useSelector } from "react-redux";
import { getUserApi } from "../../api/user/user";
import { AppButton } from "../../components/misc/AppButton";
import { Avatar } from "../../components/misc/Avatar";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";
import { RootState } from "../../stores/store";

export const EditProfilePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await getUserApi.updateProfile({
        firstName,
        lastName,
        email,
      });
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      navigation.goBack();
    } catch {
      Alert.alert("Lỗi", "Cập nhật thông tin thất bại");
    }
  };

  const getInputStyle = (fieldName: string) =>
    activeField === fieldName
      ? [styles.input, styles.inputActive]
      : styles.input;

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
        >
          <Save size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE} color={COLORS.WHITE} />
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
            <View style={styles.avatarCircle}>
              <Avatar source={{ uri: user?.profilePicture }} size={120} />
            </View>
            <AppButton
              title="Đổi ảnh đại diện"
              onPress={() => {}}
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
                style={getInputStyle("email")}
                placeholder="example@email.com"
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
              />
            </View>

            {/* Phone */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Phone
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.GRADIENT_START}
                />
                <Text style={styles.label}> Số điện thoại</Text>
              </View>
              <TextInput
                style={getInputStyle("phone")}
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                value={user?.phoneNumber}
                keyboardType="phone-pad"
                onFocus={() => setActiveField("phone")}
                onBlur={() => setActiveField(null)}
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
              <TextInput
                style={getInputStyle("birthday")}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={COLORS.LIGHT_GRAY_TEXT}
                onFocus={() => setActiveField("birthday")}
                onBlur={() => setActiveField(null)}
              />
            </View>

            {/* Save Button */}
            <AppButton
              title="Lưu thay đổi"
              onPress={handleSave}
              variant="gradient"
              leftIcon={
                <Save
                  size={IMAGE_SIZE.EDIT_PROFILE_ICON_SIZE}
                  color={COLORS.WHITE}
                />
              }
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
  avatarCircle: {
    backgroundColor: "#10B981",
    padding: SPACING.STEP_INDICATOR_PADDING,
    borderRadius: 100,
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
  textarea: {
    height: IMAGE_SIZE.EDIT_PROFILE_TEXTAREA_HEIGHT,
    paddingVertical: SPACING.EDIT_PROFILE_LABEL_GAP,
    textAlignVertical: "top",
  },
  // ─── Save Button ──────────────────────────────────────────────────────────
  saveButton: {
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
  },
});
