import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppButton } from "../../components/misc/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { NavigationProp } from "../../navigation/navigation.type";

// NOTE:
// To keep this screen easily pluggable with real data later (Option B),
// the invoice/room shape is defined inline in state/arrays instead of
// creating new global types, in order to respect the repo rule that
// shared interfaces and types live in src/types.

export const CreateInvoices = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedHouseId, setSelectedHouseId] = useState("house-1");
  const [roomsSelection, setRoomsSelection] = useState<
    Array<{
      id: string;
      name: string;
      tenantName: string;
      isSelected: boolean;
      items: Array<{
        id: string;
        label: string;
        amount: string;
      }>;
      total: string;
    }>
  >([
    {
      id: "room-101",
      name: "Phòng 101",
      tenantName: "Nguyễn Văn A",
      isSelected: true,
      items: [
        { id: "rent", label: "Tiền phòng", amount: "3.000.000đ" },
        { id: "electric", label: "Điện (148 số)", amount: "518.000đ" },
        { id: "water", label: "Nước (14 số)", amount: "350.000đ" },
        { id: "internet", label: "Internet", amount: "100.000đ" },
      ],
      total: "4.118.000đ",
    },
    {
      id: "room-201",
      name: "Phòng 201",
      tenantName: "Trần Thị C",
      isSelected: true,
      items: [
        { id: "rent", label: "Tiền phòng", amount: "3.500.000đ" },
        { id: "electric", label: "Điện (130 số)", amount: "455.000đ" },
        { id: "water", label: "Nước (12 số)", amount: "300.000đ" },
        { id: "internet", label: "Internet", amount: "100.000đ" },
      ],
      total: "4.505.000đ",
    },
  ]);

  const selectedCount = useMemo(
    () => roomsSelection.filter((room) => room.isSelected).length,
    [roomsSelection]
  );

  const totalCount = roomsSelection.length;

  const totalAmount = useMemo(() => {
    // This keeps the Figma total as a static label for now,
    // but the structure allows computing from numeric values later.
    if (selectedCount === 2) {
      return "8.623.000đ";
    }
    return "0đ";
  }, [selectedCount]);

  const toggleSelectAll = () => {
    const nextSelected = selectedCount !== totalCount;
    setRoomsSelection((prev) =>
      prev.map((room) => ({
        ...room,
        isSelected: nextSelected,
      }))
    );
  };

  const toggleRoomSelection = (roomId: string) => {
    setRoomsSelection((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, isSelected: !room.isSelected } : room
      )
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.headerGradient}
      >
        <View style={styles.headerDivider} />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/e693ktri_expires_30_days.png",
              }}
              resizeMode="stretch"
              style={styles.headerLogo}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{"Tạo hóa đơn hàng loạt"}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* House selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Chọn cụm trọ</Text>

          <TouchableOpacity
            style={styles.houseSelector}
            activeOpacity={0.8}
            onPress={() => setSelectedHouseId(selectedHouseId)}
          >
            <View style={styles.selectorIconPlaceholder} />

            <View style={styles.houseNameWrapper}>
              <Text style={styles.houseNameText}>Nhà trọ Hòa Bình</Text>
            </View>

            <View style={styles.selectorChevronPlaceholder} />
          </TouchableOpacity>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Đã chọn</Text>
            <Text style={styles.summaryValue}>
              {selectedCount}/{totalCount}
            </Text>
          </View>

          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Tổng tiền</Text>
            <Text style={styles.summaryValue}>{totalAmount}</Text>
          </View>
        </View>

        {/* Select all rooms */}
        <View style={styles.selectAllCard}>
          <TouchableOpacity
            style={styles.selectAllRow}
            activeOpacity={0.8}
            onPress={toggleSelectAll}
          >
            <View
              style={[
                styles.checkboxBase,
                selectedCount === totalCount && styles.checkboxChecked,
              ]}
            />

            <Text style={styles.selectAllText}>Chọn tất cả phòng</Text>
          </TouchableOpacity>
        </View>

        {/* Rooms list */}
        <View style={styles.roomsContainer}>
          {roomsSelection.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              {/* Header line with room + tenant + checkbox */}
              <View style={styles.roomHeader}>
                <TouchableOpacity
                  onPress={() => toggleRoomSelection(room.id)}
                  style={styles.roomCheckboxWrapper}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxBase,
                      room.isSelected && styles.checkboxChecked,
                    ]}
                  />
                </TouchableOpacity>

                <View style={styles.roomTitleWrapper}>
                  <Text style={styles.roomNameText}>{room.name}</Text>
                  <Text style={styles.tenantText}>{room.tenantName}</Text>
                </View>

                <View style={styles.roomStatusBadge} />
              </View>

              {/* Breakdown list */}
              <View style={styles.breakdownContainer}>
                {room.items.map((item) => (
                  <View key={item.id} style={styles.breakdownRow}>
                    <View style={styles.breakdownLabelWrapper}>
                      <Text style={styles.breakdownLabelText}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={styles.breakdownAmountText}>
                      {item.amount}
                    </Text>
                  </View>
                ))}

                <View style={styles.breakdownFooter}>
                  <Text style={styles.breakdownTotalLabel}>Tổng cộng</Text>
                  <Text style={styles.breakdownTotalAmount}>{room.total}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom primary action */}
      <View style={styles.footer}>
        <AppButton
          title="Tạo hóa đơn"
          onPress={() => {
            // Placeholder for real submit handler.
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerDivider: {
    height: SPACING.HEADER_DIVIDER_HEIGHT,
    marginBottom: SPACING.HEADER_DIVIDER_MARGIN_BOTTOM,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: SPACING.HEADER_MARGIN_BOTTOM,
    marginTop: SPACING.HEADER_MARGIN_BOTTOM,

  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    paddingTop: SPACING.CONTENT_VERTICAL_PADDING,
    paddingBottom: SPACING.CONTENT_BOTTOM_MARGIN,
  },
  section: {
    marginBottom: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM,
  },
  sectionLabel: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.LABEL,
    fontWeight: "bold",
    marginBottom: SPACING.LABEL_MARGIN_BOTTOM,
  },
  houseSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    paddingVertical: SPACING.SEARCH_INPUT_PADDING_VERTICAL,
    paddingHorizontal: SPACING.SEARCH_ICON_MARGIN_LEFT,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  selectorIconPlaceholder: {
    width: SPACING.SEARCH_ICON_MARGIN_LEFT,
    height: SPACING.SEARCH_ICON_MARGIN_LEFT,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    backgroundColor: COLORS.GRAY_LIGHT,
    marginRight: SPACING.SEARCH_ICON_MARGIN_RIGHT,
  },
  houseNameWrapper: {
    flex: 1,
  },
  houseNameText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  selectorChevronPlaceholder: {
    width: SPACING.SEARCH_ICON_MARGIN_LEFT,
    height: SPACING.SEARCH_ICON_MARGIN_LEFT,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.BOARDING_HOUSE_CARD,
    paddingVertical: SPACING.STAT_CARD_PADDING_VERTICAL,
    paddingHorizontal: SPACING.STAT_CARD_ICON_MARGIN_RIGHT,
    marginBottom: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  summaryColumn: {
    flex: 1,
  },
  summaryLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.STAT_LABEL,
    marginBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
    textAlign: "left",
  },
  summaryValue: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.CARD_HEADING,
    fontWeight: "bold",
  },
  selectAllCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    paddingVertical: SPACING.SEARCH_INPUT_PADDING_VERTICAL,
    paddingHorizontal: SPACING.SEARCH_ICON_MARGIN_LEFT,
    marginBottom: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBase: {
    width: SPACING.SEARCH_ICON_MARGIN_LEFT,
    height: SPACING.SEARCH_ICON_MARGIN_LEFT,
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    borderWidth: 1,
    borderColor: COLORS.GREEN_PRIMARY,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.SEARCH_ICON_MARGIN_RIGHT,
  },
  checkboxChecked: {
    backgroundColor: COLORS.GREEN_PRIMARY,
  },
  selectAllText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  roomsContainer: {},
  roomCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.BOARDING_HOUSE_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    paddingVertical: SPACING.BOARDING_HOUSE_CARD_PADDING_VERTICAL,
    paddingHorizontal: SPACING.BOARDING_HOUSE_CARD_PADDING_RIGHT,
    marginBottom: SPACING.BOARDING_HOUSE_CARD_MARGIN_BOTTOM,
  },
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM + SPACING.SMALL,
  },
  roomCheckboxWrapper: {
    marginRight: SPACING.SEARCH_ICON_MARGIN_RIGHT,
  },
  roomTitleWrapper: {
    flex: 1,
  },
  roomNameText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE,
    fontWeight: "bold",
  },
  tenantText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.ADDRESS,
    marginTop: SPACING.XS,
  },
  roomStatusBadge: {
    width: SPACING.STAT_ITEM_ICON_MARGIN_BOTTOM * 2,
    height: SPACING.STAT_ITEM_ICON_MARGIN_BOTTOM * 2,
    borderRadius: BORDER_RADIUS.STAT_ITEM,
    backgroundColor: COLORS.successBg,
  },
  breakdownContainer: {
    marginTop: SPACING.STAT_ITEM_TEXT_MARGIN_BOTTOM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
    paddingTop: SPACING.STAT_ITEM_TEXT_MARGIN_BOTTOM,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.STAT_ITEM_TEXT_MARGIN_BOTTOM,
  },
  breakdownLabelWrapper: {
    flex: 1,
    marginRight: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL,
  },
  breakdownLabelText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
  },
  breakdownAmountText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  breakdownFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.STAT_ITEM_TEXT_MARGIN_BOTTOM,
  },
  breakdownTotalLabel: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  breakdownTotalAmount: {
    color: COLORS.GREEN_PRIMARY,
    fontSize: FONT_SIZE.PRICE,
    fontWeight: "bold",
  },
  footer: {
    paddingBottom: SPACING.SCROLL_BOTTOM_PADDING,
    paddingTop: SPACING.SMALL,
    backgroundColor: COLORS.white,
  },
});


