// components/BoardingHouseCard.tsx
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../navigation/navigation.type";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZE,
    IMAGE_SIZE,
    SPACING,
} from "../../constants/theme";
import RoomStats from "./RoomStats";
import BoardingHouseFeatures from "./BoardingHouseFeature";
import { IHouse } from "../../types/house";
import { getRoomApi } from "../../api/room/room";
import { ApiResponse } from "../../types/app.common";
import { IRoom } from "../../types/room";
import {
    MapPin
} from "lucide-react-native";
const BoardingHouseCard = ({
    _id,
    houseName,
    address,
    status,
    defaultUtilitesCharge
}: IHouse) => {
    const navigation = useNavigation<NavigationProp>();
    const [totalRooms, setTotalRooms] = useState<number>(0);
    const [rentedRooms, setRentedRooms] = useState<number>(0);
    const [availableRooms, setAvailableRooms] = useState<number>(0);

    useEffect(() => {
        const fetchRoomStats = async () => {
            if (!_id) return;
            try {
                const res = await getRoomApi.getAllRoomsByHouseId(_id) as ApiResponse<IRoom[]>;
                if (res.status === "success" && Array.isArray(res.data)) {
                    const rooms = res.data as any as IRoom[];
                    const total = rooms.length;
                    const rented = rooms.filter(
                        (r) => r.status === "Đang Thuê" || r.status === "rented",
                    ).length;
                    const available = total - rented;
                    setTotalRooms(total);
                    setRentedRooms(rented);
                    setAvailableRooms(available);
                } else {
                    setTotalRooms(0);
                    setRentedRooms(0);
                    setAvailableRooms(0);
                }
            } catch {
                setTotalRooms(0);
                setRentedRooms(0);
                setAvailableRooms(0);
            }
        };

        fetchRoomStats();
    }, [_id]);
    const handleViewDetails = () => {
        navigation.navigate('mainstack', {
            screen: 'boardingHouseDetailsScreen',
            params: { _id }
        });
    }
    return (
        <TouchableOpacity onPress={handleViewDetails}>
            <View style={styles.boardingHouseCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{houseName}</Text>
                    {/* <TouchableOpacity
                        style={
                            status === "Còn Phòng"
                                ? styles.statusBadgeAvailable
                                : styles.statusBadgeFull
                        }
                        onPress={() => alert("Pressed!")}
                    >
                        <Text
                            style={
                                status === "Còn Phòng"
                                    ? styles.statusBadgeText
                                    : styles.statusBadgeFullText
                            }
                        >
                            {status === "Còn Phòng" ? "Còn phòng" : "Hết phòng"}
                        </Text>
                    </TouchableOpacity> */}
                </View>

                <View style={styles.addressContainer}>
                    <View style={styles.addressIcon}>
                        <MapPin color={COLORS.GREEN_PRIMARY} size={16} />
                    </View>
                    <View>
                        <Text style={styles.addressText}>{address}</Text>
                    </View>
                </View>

                <RoomStats
                    total={totalRooms}
                    rented={rentedRooms}
                    available={availableRooms}
                />
                <BoardingHouseFeatures features={defaultUtilitesCharge ?? []} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: 2 },
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
        alignItems: "center",
        justifyContent: "center",
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
});

export default BoardingHouseCard