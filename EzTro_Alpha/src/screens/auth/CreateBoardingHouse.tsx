import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "../../components/misc/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { AuthNavigationProp } from "../../navigation/navigation.type";

const STEP_ACTIVE_BACKGROUND_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/puioa638_expires_30_days.png";
const STEP_INACTIVE_BACKGROUND_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/85ox79a3_expires_30_days.png";
const STEP_DIVIDER_ACTIVE_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/xd0nlwi9_expires_30_days.png";
const STEP_DIVIDER_INACTIVE_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/7zmw1a41_expires_30_days.png";

export const CreateBoardingHouse = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [boardingHouseName, onChangeBoardingHouseName] = useState("");
  const [address, onChangeAddress] = useState("");

  const handleNextPress = () => {
    // TODO: Implement next step logic
    alert("Pressed!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Tạo khu trọ mới</Text>
          </View>

          <View style={styles.stepperContainer}>
            <ImageBackground
              source={{ uri: STEP_ACTIVE_BACKGROUND_URI }}
              resizeMode="stretch"
              style={styles.stepIndicator}
            >
              <Text style={styles.stepActiveText}>1</Text>
            </ImageBackground>

            <Image
              source={{ uri: STEP_DIVIDER_ACTIVE_URI }}
              resizeMode="stretch"
              style={styles.stepDivider}
            />

            <ImageBackground
              source={{ uri: STEP_INACTIVE_BACKGROUND_URI }}
              resizeMode="stretch"
              style={styles.stepIndicator}
            >
              <Text style={styles.stepInactiveText}>2</Text>
            </ImageBackground>

            <Image
              source={{ uri: STEP_DIVIDER_INACTIVE_URI }}
              resizeMode="stretch"
              style={styles.stepDivider}
            />

            <ImageBackground
              source={{ uri: STEP_INACTIVE_BACKGROUND_URI }}
              resizeMode="stretch"
              style={styles.stepIndicator}
            >
              <Text style={styles.stepInactiveText}>3</Text>
            </ImageBackground>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Tên khu trọ *</Text>
            <TextInput
              placeholder="VD: Nhà trọ Xuân Sơn"
              placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
              value={boardingHouseName}
              onChangeText={onChangeBoardingHouseName}
              style={styles.input}
            />

            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput
              placeholder="VD: 40 Yên Lãng"
              placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
              value={address}
              onChangeText={onChangeAddress}
              style={styles.addressInput}
            />
          </View>

          <AppButton
            title="Tiếp theo"
            onPress={handleNextPress}
            variant="primary"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.TRANSPARENT,
  },
  scrollContent: {
    paddingVertical: SPACING.CARD_SCREEN_VERTICAL_PADDING,
    paddingHorizontal: SPACING.CARD_SCREEN_HORIZONTAL_PADDING,
  },
  card: {
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.CARD,
    paddingVertical: SPACING.CARD_VERTICAL_PADDING,
  },
  headingContainer: {
    paddingBottom: SPACING.XS,
    marginBottom: SPACING.CARD_HEADING_MARGIN_BOTTOM,
  },
  heading: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.CARD_HEADING,
  },
  stepperContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.STEPPER_MARGIN_BOTTOM,
    marginHorizontal: SPACING.STEPPER_HORIZONTAL_MARGIN,
  },
  stepIndicator: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.STEP_INDICATOR_PADDING,
    marginRight: SPACING.STEP_INDICATOR_PADDING,
  },
  stepActiveText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.LABEL,
  },
  stepInactiveText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.LABEL,
  },
  stepDivider: {
    height: IMAGE_SIZE.STEP_DIVIDER_HEIGHT,
    flex: 1,
    marginRight: SPACING.STEP_INDICATOR_PADDING,
  },
  formContainer: {
    alignSelf: "stretch",
    marginBottom: SPACING.INPUT_SECTION_MARGIN_BOTTOM,
    marginHorizontal: SPACING.INPUT_SECTION_HORIZONTAL_MARGIN,
  },
  label: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.LABEL,
    marginBottom: SPACING.LABEL_MARGIN_BOTTOM,
  },
  input: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    marginBottom: SPACING.INPUT_SPACING_BETWEEN,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    paddingVertical: SPACING.INPUT_VERTICAL_PADDING,
    paddingHorizontal: SPACING.INPUT_PADDING,
  },
  addressInput: {
    color: COLORS.PLACEHOLDER_TEXT,
    fontSize: FONT_SIZE.INPUT,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    paddingVertical: SPACING.INPUT_VERTICAL_PADDING,
    paddingHorizontal: SPACING.INPUT_PADDING,
  },
  button: {
    alignSelf: "stretch",
    marginHorizontal: SPACING.INPUT_SECTION_HORIZONTAL_MARGIN,
  },
});

export default CreateBoardingHouse;
