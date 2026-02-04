import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getHouseApi } from "../../api/house/house";
import BoardingHouseCard from "../../components/boardingHouse/BoardingHouseCard";
import BoardingHouseStatsCard from "../../components/boardingHouse/BoardingHouseStatsCard";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";
import { ApiResponse } from "../../types/app.common";
import { IHouse } from "../../types/house";

export const ViewBoardingHousePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, onChangeSearchText] = useState("");

  const { getAllHousesByLandlordId } = getHouseApi;
  const [boardingHouses, setBoardingHouses] = useState<IHouse[] | null>(null);

  useEffect(() => {
    const getAllHouses = async () => {
      const res = (await getAllHousesByLandlordId()) as ApiResponse<IHouse[]>;
      if (res.status === "success") {
        setBoardingHouses(res.data as IHouse[]);
      }
    };
    getAllHouses();
  }, []);

  const handleCreateBoardingHouse = () => {
    navigation.navigate("mainstack", { screen: "createBoardingHousePage" });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
            style={styles.headerGradient}
          >
            <View style={styles.headerDivider} />
            <View style={styles.headerContent}>
              <View style={styles.headerSpacer} />

              <View>
                <Text style={styles.headerTitle}>
                  {"Tạo hóa đơn hàng loạt"}
                </Text>
              </View>
              <View style={styles.headerSpacer} />
            </View>
          </LinearGradient>

          <View style={styles.mainContent}>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/n295p5iq_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Tìm kiếm cụm trọ..."
                  value={searchText}
                  onChangeText={onChangeSearchText}
                  style={styles.searchInput}
                />
              </View>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/2ddkzfae_expires_30_days.png",
                }}
                resizeMode="stretch"
                style={styles.filterIcon}
              />
            </View>

            <BoardingHouseStatsCard totalBoardingHouse={7} />
            <View style={styles.boardingHousesContainer}>
              {boardingHouses && (
                <>
                  {boardingHouses.map(
                    (boardingHouse: IHouse, index: number) => (
                      <BoardingHouseCard key={index} {...boardingHouse} />
                    ),
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Floating Button */}
      <TouchableOpacity onPress={handleCreateBoardingHouse}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ollwsyj9_expires_30_days.png",
          }}
          resizeMode="stretch"
          style={styles.floatingButton}
        />
      </TouchableOpacity>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: SPACING.CONTENT_BOTTOM_MARGIN,
  },
  headerGradient: {
    paddingTop: SPACING.HEADER_TOP_PADDING,
  },
  headerDivider: {
    height: SPACING.HEADER_DIVIDER_HEIGHT,
    marginBottom: SPACING.HEADER_DIVIDER_MARGIN_BOTTOM,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.HEADER_MARGIN_BOTTOM,
    marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
  },

  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.HEADER_TITLE,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: IMAGE_SIZE.HEADER_LOGO,
    height: SPACING.XS,
  },
  mainContent: {
    backgroundColor: COLORS.BACKGROUND_GRAY,
    paddingVertical: SPACING.CONTENT_VERTICAL_PADDING,
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    marginBottom: SPACING.CONTENT_BOTTOM_MARGIN,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: BORDER_RADIUS.INPUT,
    borderWidth: 1,
    marginRight: SPACING.SEARCH_INPUT_MARGIN_RIGHT,
  },
  searchIcon: {
    width: IMAGE_SIZE.SEARCH_ICON,
    height: IMAGE_SIZE.SEARCH_ICON,
    marginLeft: SPACING.SEARCH_ICON_MARGIN_LEFT,
    marginRight: SPACING.SEARCH_ICON_MARGIN_RIGHT,
  },
  searchInput: {
    color: COLORS.PLACEHOLDER_GRAY,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    marginRight: SPACING.ICON_MARGIN_RIGHT,
    flex: 1,
    paddingVertical: SPACING.SEARCH_INPUT_PADDING_VERTICAL,
  },
  filterIcon: {
    width: IMAGE_SIZE.FILTER_ICON,
    height: IMAGE_SIZE.FILTER_ICON,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.STATS_CONTAINER_MARGIN_BOTTOM,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.STAT_CARD,
    paddingVertical: SPACING.STAT_CARD_PADDING_VERTICAL,
    marginRight: SPACING.STAT_CARD_MARGIN_RIGHT,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  statIcon: {
    borderRadius: BORDER_RADIUS.STAT_CARD,
    width: IMAGE_SIZE.STAT_ICON,
    height: IMAGE_SIZE.STAT_ICON,
    marginRight: SPACING.STAT_CARD_ICON_MARGIN_RIGHT,
  },
  statTextContainer: {
    paddingBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
  },
  statTextContainerAlt: {
    paddingBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
    paddingRight: SPACING.STAT_CARD_TEXT_MARGIN_RIGHT,
  },
  statLabelContainer: {
    alignSelf: "flex-start",
  },
  statValueContainer: {
    alignSelf: "flex-start",
    marginRight: SPACING.STAT_CARD_TEXT_MARGIN_RIGHT,
  },
  statLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.STAT_LABEL,
    width: 44,
  },
  statValue: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.STAT_VALUE,
    fontWeight: "bold",
  },
  boardingHousesContainer: {
    marginBottom: SPACING.BOARDING_HOUSES_CONTAINER_MARGIN_BOTTOM,
  },
  boardingHouseCard: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.TRANSPARENT,
    borderRadius: BORDER_RADIUS.BOARDING_HOUSE_CARD,
    borderWidth: 1,
    paddingVertical: SPACING.BOARDING_HOUSE_CARD_PADDING_VERTICAL,
    paddingRight: SPACING.BOARDING_HOUSE_CARD_PADDING_RIGHT,
    marginBottom: SPACING.BOARDING_HOUSE_CARD_MARGIN_BOTTOM,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.BOARDING_HOUSE_TITLE_MARGIN_BOTTOM,
    marginLeft: SPACING.BOARDING_HOUSE_CARD_MARGIN_LEFT,
  },
  cardTitle: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE,
    fontWeight: "bold",
  },
  statusBadgeAvailable: {
    backgroundColor: COLORS.GREEN_LIGHT_BG,
    borderColor: COLORS.GREEN_LIGHT_BORDER,
    borderRadius: BORDER_RADIUS.STATUS_BADGE,
    borderWidth: 1,
    paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
    paddingHorizontal: SPACING.STATUS_BADGE_PADDING_HORIZONTAL,
  },
  statusBadgeText: {
    color: COLORS.GREEN_DARK,
    fontSize: FONT_SIZE.STATUS_BADGE,
    fontWeight: "bold",
  },
  statusBadgeFull: {
    backgroundColor: COLORS.RED_LIGHT_BG,
    borderColor: COLORS.RED_LIGHT_BORDER,
    borderRadius: BORDER_RADIUS.STATUS_BADGE,
    borderWidth: 1,
    paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
    paddingHorizontal: SPACING.STATUS_BADGE_PADDING_HORIZONTAL - SPACING.XS,
  },
  statusBadgeFullText: {
    color: COLORS.RED_TEXT,
    fontSize: FONT_SIZE.STATUS_BADGE,
    fontWeight: "bold",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.ADDRESS_MARGIN_BOTTOM,
    marginLeft: SPACING.BOARDING_HOUSE_CARD_MARGIN_LEFT,
  },
  addressIcon: {
    width: IMAGE_SIZE.ADDRESS_ICON,
    height: IMAGE_SIZE.ADDRESS_ICON,
    marginRight: SPACING.ADDRESS_ICON_MARGIN_RIGHT,
  },
  addressText: {
    color: COLORS.TEXT_MEDIUM,
    fontSize: FONT_SIZE.ADDRESS,
  },
  districtContainer: {
    paddingLeft: SPACING.DISTRICT_PADDING_LEFT,
    marginBottom: SPACING.DISTRICT_MARGIN_BOTTOM,
    marginLeft: SPACING.DISTRICT_MARGIN_LEFT,
  },
  districtText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.DISTRICT,
  },
  roomStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.PRICE_MARGIN_BOTTOM,
    marginLeft: SPACING.DISTRICT_MARGIN_LEFT,
  },
  roomStatItem: {
    flex: 1,
    alignItems: "center",
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: BORDER_RADIUS.STAT_ITEM,
    borderWidth: 1,
    paddingVertical: SPACING.STAT_ITEM_PADDING_VERTICAL,
    marginRight: SPACING.STAT_ITEM_MARGIN_RIGHT,
  },
  roomStatItemLast: {
    flex: 1,
    alignItems: "center",
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: BORDER_RADIUS.STAT_ITEM,
    borderWidth: 1,
    paddingVertical: SPACING.STAT_ITEM_PADDING_VERTICAL,
  },
  roomStatIcon: {
    borderRadius: BORDER_RADIUS.STAT_ITEM,
    width: IMAGE_SIZE.STAT_ITEM_ICON,
    height: IMAGE_SIZE.STAT_ITEM_ICON,
    marginBottom: SPACING.STAT_ITEM_ICON_MARGIN_BOTTOM,
  },
  roomStatTextContainer: {
    marginHorizontal: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL,
  },
  roomStatTextContainerAlt: {
    marginHorizontal: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL_ALT,
  },
  roomStatTextContainerAlt2: {
    marginHorizontal: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL_ALT2,
  },
  roomStatValueContainer: {
    alignSelf: "flex-start",
    marginBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
  },
  roomStatValue: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.STAT_ITEM_VALUE,
    fontWeight: "bold",
  },
  roomStatLabel: {
    color: COLORS.TEXT_MEDIUM,
    fontSize: FONT_SIZE.STAT_ITEM_LABEL,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.PRICE_MARGIN_BOTTOM,
    marginLeft: SPACING.BOARDING_HOUSE_CARD_MARGIN_LEFT,
  },
  priceText: {
    color: COLORS.GREEN_PRIMARY,
    fontSize: FONT_SIZE.PRICE,
    fontWeight: "bold",
    marginRight: SPACING.PRICE_MARGIN_RIGHT,
    flex: 1,
  },
  priceUnitContainer: {
    marginRight: SPACING.PRICE_MARGIN_RIGHT,
  },
  priceUnitText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.PRICE_UNIT,
  },
  priceSpacer: {
    height: SPACING.PRICE_MARGIN_BOTTOM,
    flex: 1,
  },
  featuresContainer: {
    alignSelf: "flex-start",
    marginLeft: SPACING.DISTRICT_MARGIN_LEFT,
  },
  featureRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.FEATURE_ROW_MARGIN_BOTTOM,
  },
  featureBadge: {
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_LIGHT_BORDER,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    borderWidth: 1,
    paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
    paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
    marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT,
  },
  featureBadgeText: {
    color: COLORS.GREEN_DARK,
    fontSize: FONT_SIZE.FEATURE_BADGE,
    fontWeight: "bold",
  },
  featureBadgeGray: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    borderWidth: 1,
    paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
    paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
    marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_SMALL,
  },
  featureBadgeGrayText: {
    color: COLORS.GRAY_DARK,
    fontSize: FONT_SIZE.FEATURE_BADGE,
    fontWeight: "bold",
  },
  featureBadgeSingle: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_LIGHT_BORDER,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    borderWidth: 1,
    paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
    paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
    marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_LARGE,
  },
  featureBadgeSingleAlt: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_LIGHT_BORDER,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    borderWidth: 1,
    paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
    paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
    marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_XLARGE,
  },
  featureSpacer: {
    width: 91,
    height: SPACING.PRICE_MARGIN_BOTTOM,
  },
  floatingButton: {
    position: "absolute",
    bottom: 50,
    left: 280,
    // top: SPACING.FLOATING_BUTTON_TOP,
    // right: SPACING.FLOATING_BUTTON_RIGHT,
    width: IMAGE_SIZE.FLOATING_BUTTON,
    height: IMAGE_SIZE.FLOATING_BUTTON,
  },
});
