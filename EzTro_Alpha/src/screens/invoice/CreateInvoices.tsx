import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getHouseApi } from "../../api/house/house";
import { getInvoiceApi, postInvoiceApi } from "../../api/invoice/invoice";
import InvoiceDetailCard from "../../components/invoice/InvoiceDetailCard";
import RoomInforCard from "../../components/invoice/RoomInforCard";
import { AppButton } from "../../components/misc/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";
import { appNavigator } from "../../navigation/navigationActions";
import { ApiResponse } from "../../types/app.common";
import { IHouse } from "../../types/house";
import { IRoomInvoice } from "../../types/invoice";
import { formatCurrencyVND } from "../../utils/currency";

export const CreateInvoices: React.FC = () => {
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState<string | undefined>(
    "",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<any>(null);
  const selectedHouse = houses.find((h) => h._id === selectedHouseId);
  const [roomsSelection, setRoomsSelection] = useState<IRoomInvoice[]>([]);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      const { getAllHousesByLandlordId } = getHouseApi;
      const getAllHouses = async () => {
        try {
          const res = (await getAllHousesByLandlordId(
            controller.signal,
          )) as ApiResponse<IHouse[]>;
          if (res.status === "success") {
            setHouses(res.data as IHouse[]);
            if (res.data && res.data.length > 0) {
              setSelectedHouseId(res.data[0]._id);
            }
          }
        } catch (err) {}
      };
      getAllHouses();
      return () => {
        controller.abort();
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      // Nếu chưa có selectedHouseId thì không làm gì cả
      if (!selectedHouseId) {
        setRoomsSelection([]);
        return;
      }

      const controller = new AbortController();
      const { getRoomsForInvoiceCreation } = getInvoiceApi;

      const fetchRooms = async () => {
        setRoomsSelection([]);
        try {
          const res = (await getRoomsForInvoiceCreation(
            selectedHouseId,
            controller.signal,
          )) as ApiResponse<IRoomInvoice[]>;
          if (res.status === "success" && res.data) {
            const withSelection: IRoomInvoice[] = (
              res.data as IRoomInvoice[]
            ).map((inv) => ({
              ...inv,
              isSelected: false,
            }));
            setRoomsSelection(withSelection);
          }
        } catch (err) {}
      };

      fetchRooms();

      return () => {
        controller.abort();
      };
    }, [selectedHouseId]),
  );

  const selectedCount = useMemo(
    () => roomsSelection.filter((room) => room.isSelected).length,
    [roomsSelection],
  );

  const totalCount = roomsSelection.length;

  const totalAmount = useMemo(() => {
    return roomsSelection
      .filter((room) => room.isSelected)
      .reduce((total, room) => {
        return total + room.totalAmount;
      }, 0);
  }, [selectedCount]);

  const toggleSelectAll = () => {
    const nextSelected = selectedCount !== totalCount;
    setRoomsSelection((prev) =>
      prev.map((room) => ({
        ...room,
        isSelected: nextSelected,
      })),
    );
  };

  const toggleRoomSelection = (roomId: string | undefined) => {
    setRoomsSelection((prev) =>
      prev.map((room) =>
        room.roomId === roomId
          ? { ...room, isSelected: !room.isSelected }
          : room,
      ),
    );
  };

  const handleUpdateRoom = (updatedRoom: IRoomInvoice) => {
    setRoomsSelection((prevRooms) =>
      prevRooms.map((room) =>
        room.roomId === updatedRoom.roomId ? updatedRoom : room,
      ),
    );
    setSelectedRoomDetail(updatedRoom);
  };

  const handleCreateNewInvoices = async () => {
    const selectedRooms = roomsSelection.filter((room) => room.isSelected);
    const { createNewInvoices } = postInvoiceApi;

    const data = selectedRooms.map((room) => ({
      roomId: room.roomId,
      status: "processing",
      rentalFee: room.rentalFee,
      previousElectricityNumber: room.previousElectricityNumber,
      currentElectricityNumber: room.currentElectricityNumber,
      previousWaterNumber: room.previousWaterNumber,
      currentWaterNumber: room.currentWaterNumber,
      electricityCharge: room.electricityCost,
      waterCharge: room.waterCost,
      totalAmount: room.totalAmount,
      utilities: room.utilities,
    }));

    try {
      const res = (await createNewInvoices(data)) as ApiResponse<any[]>;
      if (res.status === "success") {
        Alert.alert("Tạo hóa đơn hàng loạt thành công!");
        appNavigator.goToViewBoardingHousePage();
      }
    } catch (err) {}
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
          <View>
            <Text style={styles.headerTitle}>{"Tạo hóa đơn hàng loạt"}</Text>
          </View>
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
                <Text style={styles.houseNameText}>
                  {selectedHouse?.houseName}
                </Text>
              </View>

              <Text style={styles.chevronIcon}>▼</Text>
            </TouchableOpacity>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <View style={styles.dropdownContainer}>
                {houses.map((house, index) => (
                  <TouchableOpacity
                    key={house._id}
                    style={[
                      styles.dropdownItem,
                      index === houses.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      setSelectedHouseId(house._id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        selectedHouseId === house._id &&
                          styles.dropdownTextSelected,
                      ]}
                    >
                      {house.houseName}
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
            <Text style={styles.summaryValue}>
              {formatCurrencyVND(totalAmount)}
            </Text>
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

        {roomsSelection.length > 0 ? (
          <View>
            {roomsSelection.map((room) => (
              <RoomInforCard
                key={room.roomId}
                room={room}
                toggleRoomSelection={toggleRoomSelection}
                setSelectedRoomDetail={setSelectedRoomDetail}
              />
            ))}
          </View>
        ) : (
          <View>
            <Text>Cụm trọ này chưa có hóa đơn</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom primary action */}
      <View style={styles.footer}>
        <AppButton
          disabled={selectedCount === 0}
          title={`Tạo hóa đơn (${selectedCount})`}
          onPress={() => {
            handleCreateNewInvoices();
          }}
        />
      </View>
      <InvoiceDetailCard
        selectedRoomDetail={selectedRoomDetail}
        setSelectedRoomDetail={setSelectedRoomDetail}
        onUpdateRoom={handleUpdateRoom}
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
    justifyContent: "center",
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
    color: COLORS.GREEN_PRIMARY || "#00A152",
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
    paddingBottom: 100,
    paddingTop: SPACING.SMALL,
    backgroundColor: COLORS.white,
  },
});
