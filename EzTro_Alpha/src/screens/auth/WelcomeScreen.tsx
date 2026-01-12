import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AppButton } from "../../components/AppButton";
import { COLORS, IMAGE_SIZE, SPACING } from "../../constants/theme";
import { AuthNavigationProp } from "../../navigation/navigation.type";

const BACKGROUND_IMAGE_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/8u42aa30_expires_30_days.png";
const LOGO_IMAGE_URI =
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/zRSUK6gXk9/fj03n2uv_expires_30_days.png";

const WelcomeScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const handleLoginPress = () => {
    navigation.navigate("login");
  };

  const handleRegisterPress = () => {
    navigation.navigate("register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE_URI }}
        resizeMode="stretch"
        style={styles.backgroundImage}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentContainer}>
            <Image
              source={{ uri: LOGO_IMAGE_URI }}
              resizeMode="stretch"
              style={styles.logo}
            />
            <AppButton
              title="Login"
              onPress={handleLoginPress}
              variant="primary"
              style={styles.loginButton}
            />
            <AppButton
              title="Register"
              onPress={handleRegisterPress}
              variant="secondary"
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    alignItems: "center",
    paddingTop: SPACING.TOP_PADDING,
    paddingBottom: SPACING.EXTRA_LARGE,
  },
  logo: {
    width: IMAGE_SIZE.LOGO_WIDTH,
    height: IMAGE_SIZE.LOGO_HEIGHT,
    marginBottom: SPACING.SCROLL_BOTTOM_PADDING,
  },
  loginButton: {
    marginBottom: SPACING.SMALL,
    marginTop: SPACING.LARGE_SECTION_SPACING,
    width: "85%",
  },
  registerButton: {
    marginBottom: SPACING.EXTRA_LARGE,
    width: "85%",
  },
});

export default WelcomeScreen;
