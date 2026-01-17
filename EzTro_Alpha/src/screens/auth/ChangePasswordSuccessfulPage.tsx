import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppButton } from "../../components/AppButton";
import { COLORS, FONT_SIZE, IMAGE_SIZE, SPACING } from "../../constants/theme";
import { AuthNavigationProp } from "../../navigation/navigation.type";

const SUCCESS_ICON_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/cxzkv7td_expires_30_days.png";

export const ChangePasswordSuccessfulPage = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const handleBackToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={{ uri: SUCCESS_ICON_URI }}
          resizeMode="stretch"
          style={styles.successIcon}
        />

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Đã đổi mật khẩu</Text>
        </View>

        <AppButton
          title="Trở lại đăng nhập"
          onPress={handleBackToLogin}
          variant="primary"
          style={styles.button}
        />
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
    backgroundColor: COLORS.WHITE,
  },
  scrollContent: {
    paddingVertical: SPACING.SUCCESS_SCREEN_TOP_PADDING,
    alignItems: "center",
  },
  successIcon: {
    width: IMAGE_SIZE.SUCCESS_ICON_SIZE,
    height: IMAGE_SIZE.SUCCESS_ICON_SIZE,
    marginBottom: SPACING.SUCCESS_ICON_MARGIN_BOTTOM,
  },
  headingContainer: {
    paddingBottom: SPACING.XS,
    marginBottom: SPACING.SUCCESS_HEADING_MARGIN_BOTTOM,
  },
  heading: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZE.SUCCESS_HEADING,
  },
  button: {
    alignSelf: "stretch",
  },
});

export default ChangePasswordSuccessfulPage;
