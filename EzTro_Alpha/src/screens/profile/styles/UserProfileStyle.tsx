import { StyleSheet } from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../../constants/theme";

export const UserProfileStyle = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.white,
    },
    content: {
      backgroundColor: COLORS.PROFILE_BACKGROUND,
      paddingBottom: SPACING.PROFILE_SCREEN_PADDING_BOTTOM,
    },
    headerGradient: {
      height: SPACING.PROFILE_HEADER_HEIGHT + 12,
      backgroundColor: theme.color,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
    profileCard: {
      alignItems: "center",
      marginTop: SPACING.PROFILE_CARD_MARGIN_HORIZONTAL + 12,
      backgroundColor: theme.white,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: BORDER_RADIUS.PROFILE_CARD,
      paddingVertical: SPACING.PROFILE_CARD_PADDING_VERTICAL,
      marginHorizontal: SPACING.PROFILE_CARD_MARGIN_HORIZONTAL,
    },
    profileInfo: {
      alignItems: "center",
      marginHorizontal: SPACING.PROFILE_CARD_PADDING_VERTICAL,
    },
    nameContainer: {
      marginBottom: SPACING.PROFILE_NAME_MARGIN_BOTTOM,
    },
    name: {
      color: COLORS.DARK_TEXT,
      fontSize: FONT_SIZE.PROFILE_NAME,
      fontWeight: "bold",
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.LIGHT_GREEN_BACKGROUND,
      borderRadius: BORDER_RADIUS.PROFILE_BADGE,
      paddingVertical: SPACING.PROFILE_BADGE_PADDING_VERTICAL,
      paddingHorizontal: SPACING.PROFILE_BADGE_PADDING_HORIZONTAL,
    },
    badgeIcon: {
      marginRight: SPACING.SMALL,
    },
    badgeText: {
      color: COLORS.GREEN_TEXT,
      fontSize: FONT_SIZE.PROFILE_BADGE_TEXT,
      fontWeight: "bold",
    },
    walletContainer: {
      alignSelf: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: BORDER_RADIUS.PROFILE_CARD,
      width: "90%",
      alignItems: "center",
      backgroundColor: theme.color,
      paddingVertical: SPACING.PROFILE_WALLET_PADDING_VERTICAL,
      paddingHorizontal: SPACING.PROFILE_WALLET_PADDING_HORIZONTAL,
      marginLeft: SPACING.PROFILE_WALLET_MARGIN_LEFT,
      marginTop: SPACING.PROFILE_AVATAR_MARGIN_BOTTOM,
      marginBottom: SPACING.PROFILE_AVATAR_MARGIN_BOTTOM,
    },
    walletIcon: {
      width: IMAGE_SIZE.PROFILE_WALLET_ICON_WIDTH,
      height: IMAGE_SIZE.PROFILE_WALLET_ICON_HEIGHT,
      marginRight: SPACING.PROFILE_WALLET_ICON_MARGIN_RIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    walletInfo: {
      marginRight: SPACING.PROFILE_WALLET_TEXT_MARGIN_RIGHT,
    },
    walletInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    walletLabel: {
      color: theme.white,
      fontSize: 18,
      fontWeight: "600",
    },

    walletValue: {
      color: theme.white,
      fontSize: FONT_SIZE.PROFILE_WALLET_VALUE,
      fontWeight: "bold",
      overflowY: "scroll",
    },
    walletArrow: {
      width: IMAGE_SIZE.PROFILE_WALLET_ARROW_WIDTH,
      height: IMAGE_SIZE.PROFILE_WALLET_ARROW_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      marginBottom: SPACING.PROFILE_WALLET_MARGIN_BOTTOM,
      marginHorizontal: SPACING.PROFILE_CARD_MARGIN_HORIZONTAL,
    },
    sectionHeader: {
      paddingLeft: SPACING.PROFILE_SECTION_PADDING_LEFT,
      marginBottom: SPACING.PROFILE_SECTION_MARGIN_BOTTOM,
    },
    sectionTitle: {
      color: COLORS.GRAY_TEXT,
      fontSize: FONT_SIZE.PROFILE_SECTION_TITLE,
      fontWeight: "bold",
    },
    sectionCard: {
      backgroundColor: COLORS.WHITE,
      borderRadius: BORDER_RADIUS.PROFILE_CARD,
      paddingVertical: SPACING.PROFILE_SECTION_CARD_PADDING_VERTICAL,
    },
    sectionCardSettings: {
      backgroundColor: COLORS.WHITE,
      borderRadius: BORDER_RADIUS.PROFILE_CARD,
      paddingTop: SPACING.INPUT_VERTICAL_PADDING,
    },
    sectionItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.PROFILE_SECTION_ITEM_MARGIN_BOTTOM,
      marginHorizontal: SPACING.PROFILE_SECTION_ITEM_MARGIN_HORIZONTAL,
    },
    sectionItemRow: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.PROFILE_SECTION_ITEM_SPACING,
      marginLeft: SPACING.PROFILE_SECTION_ITEM_MARGIN_LEFT,
    },
    sectionItemLast: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: SPACING.PROFILE_SECTION_ITEM_MARGIN_LEFT,
      marginRight: SPACING.PROFILE_SECTION_ITEM_MARGIN_RIGHT,
    },
    sectionIcon: {
      width: IMAGE_SIZE.PROFILE_SECTION_ICON_WIDTH,
      height: IMAGE_SIZE.PROFILE_SECTION_ICON_HEIGHT,
      marginRight: SPACING.PROFILE_SECTION_ICON_MARGIN_RIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionItemContent: {
      flex: 1,
      marginRight: SPACING.PROFILE_SECTION_TEXT_MARGIN_RIGHT,
    },
    sectionItemTitleContainer: {
      marginBottom: SPACING.PROFILE_SECTION_TITLE_MARGIN_BOTTOM,
    },
    sectionItemTitleContainerLarge: {
      alignSelf: "flex-start",
      paddingRight: SPACING.PROFILE_SECTION_ITEM_PADDING_RIGHT_LARGE,
      marginBottom: SPACING.PROFILE_SECTION_TITLE_MARGIN_BOTTOM,
    },
    sectionItemTitle: {
      color: COLORS.DARK_TEXT,
      fontSize: FONT_SIZE.PROFILE_SECTION_ITEM_TITLE,
      fontWeight: "bold",
    },
    sectionItemDescriptionContainer: {
      alignSelf: "flex-start",
      paddingRight: SPACING.PROFILE_SECTION_ITEM_PADDING_RIGHT,
    },
    sectionItemDescription: {
      color: COLORS.GRAY_TEXT,
      fontSize: FONT_SIZE.PROFILE_SECTION_ITEM_DESCRIPTION,
    },
    arrowIcon: {
      width: IMAGE_SIZE.PROFILE_ARROW_ICON_WIDTH,
      height: IMAGE_SIZE.PROFILE_ARROW_ICON_HEIGHT,
    },
    divider: {
      height: IMAGE_SIZE.PROFILE_DIVIDER_HEIGHT,
      marginBottom: SPACING.PROFILE_DIVIDER_MARGIN_BOTTOM,
      marginHorizontal: SPACING.PROFILE_DIVIDER_MARGIN_HORIZONTAL,
    },
    logoutButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.WHITE,
      borderColor: COLORS.RED_TEXT,
      borderRadius: BORDER_RADIUS.PROFILE_LOGOUT_BUTTON,
      borderWidth: 1,
      paddingVertical: SPACING.PROFILE_LOGOUT_BUTTON_PADDING_VERTICAL,
      marginBottom: SPACING.PROFILE_LOGOUT_BUTTON_MARGIN_BOTTOM,
      marginHorizontal: SPACING.PROFILE_LOGOUT_BUTTON_MARGIN_HORIZONTAL,
    },
    changePasswordButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.WHITE,
      borderColor: COLORS.HIGHLIGHT_TEXT,
      borderRadius: BORDER_RADIUS.PROFILE_LOGOUT_BUTTON,
      borderWidth: 1,
      paddingVertical: SPACING.PROFILE_LOGOUT_BUTTON_PADDING_VERTICAL,
      marginBottom: SPACING.MEDIUM_SMALL,
      marginHorizontal: SPACING.PROFILE_LOGOUT_BUTTON_MARGIN_HORIZONTAL,
    },
    logoutIcon: {
      width: IMAGE_SIZE.PROFILE_LOGOUT_ICON_WIDTH,
      height: IMAGE_SIZE.PROFILE_LOGOUT_ICON_HEIGHT,
      marginRight: SPACING.PROFILE_LOGOUT_ICON_MARGIN_RIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    logoutText: {
      color: COLORS.RED_TEXT,
      fontSize: FONT_SIZE.PROFILE_LOGOUT_TEXT,
      fontWeight: "bold",
    },
    changePasswordText: {
      color: COLORS.HIGHLIGHT_TEXT,
      fontSize: FONT_SIZE.PROFILE_LOGOUT_TEXT,
      fontWeight: "bold",
    },

    versionContainer: {
      alignItems: "center",
      marginBottom: SPACING.PROFILE_VERSION_MARGIN_BOTTOM,
    },
    versionText: {
      color: COLORS.LIGHT_GRAY_TEXT,
      fontSize: FONT_SIZE.PROFILE_VERSION,
    },
  });
