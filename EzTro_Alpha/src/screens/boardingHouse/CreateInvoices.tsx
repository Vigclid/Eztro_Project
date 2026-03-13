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
import RoomInforCard from "../../components/invoice/RoomInforCard";
import InvoiceDetailCard from "../../components/invoice/InvoiceDetailCard";

export const CreateInvoices = () => {
  const navigation = useNavigation<NavigationProp>();

  // Mảng nhà trọ mẫu
  const houses = useMemo(() => [
    { id: "house-1", name: "Nhà trọ Hòa Bình" },
    { id: "house-2", name: "Nhà trọ Hạnh Phúc" },
  ], []);

  const [selectedHouseId, setSelectedHouseId] = useState(houses[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State quản lý việc mở modal chi tiết phòng
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<any>(null);

  const selectedHouse = houses.find(h => h.id === selectedHouseId);

  const [roomsSelection, setRoomsSelection] = useState([
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

  const toggleRoomSelection = (roomId: string | undefined) => {
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

          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.houseSelector}
              activeOpacity={0.8}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <View style={styles.houseNameWrapper}>
                <Text style={styles.houseNameText}>{selectedHouse?.name}</Text>
              </View>

              <Text style={styles.chevronIcon}>▼</Text>
            </TouchableOpacity>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <View style={styles.dropdownContainer}>
                {houses.map((house, index) => (
                  <TouchableOpacity
                    key={house.id}
                    style={[
                      styles.dropdownItem,
                      index === houses.length - 1 && { borderBottomWidth: 0 }
                    ]}
                    onPress={() => {
                      setSelectedHouseId(house.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        selectedHouseId === house.id && styles.dropdownTextSelected
                      ]}
                    >
                      {house.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
        <View >
          {roomsSelection.map((room) => (
            <RoomInforCard
              key={room.id}
              room={room}
              toggleRoomSelection={toggleRoomSelection}
              setSelectedRoomDetail={setSelectedRoomDetail}
            />
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
      <InvoiceDetailCard
        selectedRoomDetail={selectedRoomDetail}
        setSelectedRoomDetail={setSelectedRoomDetail}
      />
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
    zIndex: 10,
    elevation: 10,
  },
  sectionLabel: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.LABEL,
    fontWeight: "bold",
    marginBottom: SPACING.LABEL_MARGIN_BOTTOM,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 10,
    elevation: 10,
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
  houseNameWrapper: {
    flex: 1,
  },
  houseNameText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  chevronIcon: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY || "#666",
    marginLeft: 8,
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.CREATE_INPUT,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_GRAY,
  },
  dropdownText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
  },
  dropdownTextSelected: {
    fontWeight: "bold",
    color: COLORS.GREEN_PRIMARY || '#00A152',
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
  footer: {
    paddingBottom: SPACING.SCROLL_BOTTOM_PADDING,
    paddingTop: SPACING.SMALL,
    backgroundColor: COLORS.white,
  },
});