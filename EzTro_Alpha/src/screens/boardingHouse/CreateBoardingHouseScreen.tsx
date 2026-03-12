import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppButton } from "../../components/misc/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";
import {
  Building2,
  MapPin,
  House,
  DollarSign,
  Newspaper,
  Calendar,
  Zap,
  Waves,
} from "lucide-react-native"
import { appNavigator } from "../../navigation/navigationActions";

export const CreateBoardingHouseScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, onChangeName] = useState("");
  const [address, onChangeAddress] = useState("");
  const [roomCount, onChangeRoomCount] = useState("");
  const [defaultPrice, onChangeDefaultPrice] = useState("");
  const [description, onChangeDescription] = useState("");
  const [paymentDay, onChangePaymentDay] = useState("");
  const [defaultElectricityCharge, onChangeDefaultElectricityCharge] = useState("");
  const [defaultWaterCharge, onChangeDefaultWaterCharge] = useState("");

  const handleCancel = () => {
    navigation.goBack();
  };


  const handleSave = () => {
    const data = {
    houseName: name,
    address,
    roomCount: Number(roomCount),
    defaultPrice: Number(defaultPrice),
    description,
    paymentDay: Number(paymentDay),
    defaultElectricityCharge: Number(defaultElectricityCharge),
    defaultWaterCharge: Number(defaultWaterCharge),
  };
    appNavigator.goToPackagePaymentScreen(data)
  }
  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[
              COLORS.EMERALD_GRADIENT_START,
              COLORS.EMERALD_GRADIENT_END,
            ]}
            style={styles.headerGradient}
          >
            <View style={styles.headerLogo}>
              <Building2 size={32} color={COLORS.WHITE} />
            </View>
            <View>
              <Text style={styles.headerTitle}>{"Thêm cụm trọ mới"}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <View style={styles.formIcon}>
                <Building2 size={20} color={COLORS.GREEN_PRIMARY} />
              </View>
              <Text style={styles.label}>{"Tên cụm trọ"}</Text>
            </View>
            <TextInput
              placeholder="VD: Nhà trọ Hoàng Anh"
              value={name}
              onChangeText={onChangeName}
              style={styles.textInput}
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <View style={styles.formIcon}>
                <MapPin size={20} color={COLORS.GREEN_PRIMARY} />
              </View>
              <Text style={styles.label}>{"Địa chỉ"}</Text>
            </View>
            <TextInput
              placeholder="VD: Lê Văn Hiến, Đà Nẵng"
              value={address}
              onChangeText={onChangeAddress}
              style={styles.textInput}
            />
          </View>

          <View style={styles.rowSection}>
            <View style={styles.halfWidthSection}>
              <View style={styles.labelContainer}>
                <View style={styles.formIcon}>
                  <House size={20} color={COLORS.GREEN_PRIMARY} />
                </View>
                <Text style={styles.label}>{"Số phòng"}</Text>
              </View>
              <TextInput
                placeholder="10"
                value={roomCount}
                onChangeText={onChangeRoomCount}
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidthSectionRight}>
              <View style={styles.labelContainer}>
                <View style={styles.formIcon}>
                  <DollarSign size={20} color={COLORS.GREEN_PRIMARY} />
                </View>
                <Text style={styles.label}>{"Giá mặc định"}</Text>
              </View>
              <TextInput
                placeholder="2000000"
                value={defaultPrice}
                onChangeText={onChangeDefaultPrice}
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.rowSection}>
            <View style={styles.halfWidthSection}>
              <View style={styles.labelContainer}>
                <View style={styles.formIcon}>
                  <Zap size={20} color={COLORS.GREEN_PRIMARY} />
                </View>
                <Text style={styles.label}>{"Giá điện"}</Text>
              </View>
              <TextInput
                placeholder="3000"
                value={defaultElectricityCharge}
                onChangeText={onChangeDefaultElectricityCharge}
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidthSectionRight}>
              <View style={styles.labelContainer}>
                <View style={styles.formIcon}>
                  <Waves size={20} color={COLORS.GREEN_PRIMARY} />
                </View>
                <Text style={styles.label}>{"Giá Nước"}</Text>
              </View>
              <TextInput
                placeholder="3000"
                value={defaultWaterCharge}
                onChangeText={onChangeDefaultWaterCharge}
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <View style={styles.formIcon}>
                <Newspaper size={20} color={COLORS.GREEN_PRIMARY} />
              </View>
              <Text style={styles.label}>{"Mô tả"}</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <TextInput
                placeholder="Mô tả về cụm trọ, vị trí, tiện ích..."
                value={description}
                onChangeText={onChangeDescription}
                style={styles.descriptionInput}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={{ marginBottom: 100 }}>
            <View style={styles.formSection}>
              <View style={styles.labelContainer}>
                <View style={styles.formIcon}>
                  <Calendar size={20} color={COLORS.GREEN_PRIMARY} />
                </View>
                <Text style={styles.label}>{"Ngày thanh toán"}</Text>
              </View>
              <TextInput
                placeholder="15"
                value={paymentDay}
                onChangeText={onChangePaymentDay}
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.footerButtons}>
          <AppButton
            title="Hủy"
            onPress={handleCancel}
            variant="secondary"
            style={styles.cancelButton}
          />
          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[COLORS.EMERALD_SOLID, COLORS.TEAL_SOLID]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>{"Lưu cụm trọ"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: SPACING.CREATE_CONTENT_BOTTOM_PADDING,
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.CREATE_HEADER_PADDING_VERTICAL,
    paddingHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
  },
  headerLogo: {
    width: IMAGE_SIZE.CREATE_HEADER_LOGO,
    height: IMAGE_SIZE.CREATE_HEADER_LOGO,
    marginTop: 30,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.HEADER_TITLE,
    fontWeight: "bold",
    paddingTop: 30,
  },
  headerSpacer: {
    width: IMAGE_SIZE.CREATE_HEADER_LOGO,
    height: SPACING.XS,
  },
  imageContainer: {
    alignItems: "center",
    borderColor: COLORS.EMERALD_BORDER_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_FORM_CARD,
    borderWidth: 1,
    paddingVertical: SPACING.CREATE_IMAGE_CONTAINER_PADDING_VERTICAL,
    marginBottom: SPACING.CREATE_IMAGE_CONTAINER_MARGIN_BOTTOM,
    marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
  },
  imageIcon: {
    borderRadius: BORDER_RADIUS.CREATE_FORM_CARD,
    width: IMAGE_SIZE.CREATE_IMAGE_ICON,
    height: IMAGE_SIZE.CREATE_IMAGE_ICON,
    marginBottom: SPACING.CREATE_IMAGE_ICON_MARGIN_BOTTOM,
  },
  imageTextContainer: {
    marginBottom: SPACING.CREATE_IMAGE_ICON_MARGIN_BOTTOM,
  },
  imageTitle: {
    color: COLORS.GRAY_DARK,
    fontSize: FONT_SIZE.CREATE_FORM_LABEL,
    fontWeight: "bold",
  },
  imageSubtitle: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.DISTRICT,
  },
  formSection: {
    marginBottom: SPACING.CREATE_FORM_SECTION_MARGIN_BOTTOM,
    marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
    marginTop: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.CREATE_LABEL_MARGIN_BOTTOM,
  },
  formIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: IMAGE_SIZE.CREATE_FORM_ICON,
    height: IMAGE_SIZE.CREATE_FORM_ICON,
    marginRight: SPACING.ADDRESS_ICON_MARGIN_RIGHT,
  },
  label: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.CREATE_FORM_LABEL,
    fontWeight: "bold",
  },
  textInput: {
    color: COLORS.PLACEHOLDER_GRAY,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    fontWeight: "bold",
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
    paddingHorizontal: SPACING.CREATE_INPUT_PADDING_HORIZONTAL,
  },
  addressInputContainer: {
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
    paddingLeft: SPACING.CREATE_INPUT_PADDING_LEFT,
    paddingRight: SPACING.CREATE_INPUT_PADDING_RIGHT,
  },
  addressPlaceholder: {
    color: COLORS.PLACEHOLDER_GRAY,
    fontSize: FONT_SIZE.CREATE_FORM_INPUT,
    fontWeight: "bold",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.CREATE_FORM_SECTION_MARGIN_BOTTOM,
    marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
  },
  halfWidthSection: {
    flex: 1,
    marginRight: SPACING.CREATE_ROW_MARGIN_RIGHT,
  },
  halfWidthSectionRight: {
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    // paddingTop: SPACING.CREATE_DESCRIPTION_PADDING_TOP,
    paddingLeft: SPACING.CREATE_INPUT_PADDING_LEFT,
    // marginBottom: SPACING.CREATE_DESCRIPTION_MARGIN_BOTTOM,
  },
  descriptionInput: {
    color: COLORS.PLACEHOLDER_GRAY,
    fontSize: FONT_SIZE.CREATE_FORM_DESCRIPTION,
    minHeight: SPACING.CREATE_DESCRIPTION_TEXT_MARGIN_BOTTOM,
  },
  footerContainer: {
    position: "absolute",
    // bottom: SPACING.CREATE_FOOTER_BOTTOM_OFFSET,
    right: -SPACING.HEADER_HORIZONTAL_MARGIN,
    bottom: 0,

    left: -SPACING.HEADER_HORIZONTAL_MARGIN,
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    paddingVertical: SPACING.CREATE_FOOTER_PADDING_VERTICAL,
    paddingHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
    shadowColor: COLORS.SHADOW_COLOR_LIGHT,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: -SPACING.ICON_MARGIN_RIGHT,
    },
    // shadowRadius: SPACING.CREATE_FORM_CARD,
    // elevation: SPACING.CREATE_FORM_CARD,
    shadowRadius: 10,
    elevation: 10,
  },
  footerButtons: {
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.CREATE_FOOTER_BUTTON_MARGIN_RIGHT,
    marginHorizontal: 0,
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingVertical: SPACING.CREATE_FOOTER_BUTTON_PADDING_VERTICAL,
  },
  saveButtonContainer: {
    flex: 1,
  },
  saveButtonGradient: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingVertical: SPACING.CREATE_FOOTER_BUTTON_PADDING_VERTICAL,
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.CREATE_FOOTER_BUTTON,
    fontWeight: "bold",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.CREATE_FEATURE_ROW_MARGIN_BOTTOM,
  },
  featureButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
    marginRight: SPACING.CREATE_FOOTER_BUTTON_MARGIN_RIGHT,
  },
  featureButtonRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
    borderColor: COLORS.BORDER_GRAY_ALPHA,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    paddingVertical: SPACING.CREATE_INPUT_PADDING_VERTICAL,
  },
  featureIcon: {
    borderRadius: BORDER_RADIUS.CREATE_FEATURE_ICON,
    width: IMAGE_SIZE.CREATE_FEATURE_ICON,
    height: IMAGE_SIZE.CREATE_FEATURE_ICON,
    marginRight: SPACING.CREATE_FEATURE_ICON_MARGIN_RIGHT,
  },
  featureText: {
    color: COLORS.GRAY_DARK,
    fontSize: FONT_SIZE.CREATE_FEATURE_TEXT,
    fontWeight: "bold",
  },
});
