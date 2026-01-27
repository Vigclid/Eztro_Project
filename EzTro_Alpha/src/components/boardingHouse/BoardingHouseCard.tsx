// components/BoardingHouseCard.tsx
import React from "react";
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
const BoardingHouseCard = ({
    _id,
    houseName,
    address,
    status,
    defaultUtilitesCharge
}: IHouse) => {
    const navigation = useNavigation<NavigationProp>()
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
                    <TouchableOpacity
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
                    </TouchableOpacity>
                </View>

                <View style={styles.addressContainer}>
                    <Image
                        source={{
                            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/7d8w1i7n_expires_30_days.png", // thay đổi theo từng nhà trọ nếu cần
                        }}
                        resizeMode="stretch"
                        style={styles.addressIcon}
                    />
                    <View>
                        <Text style={styles.addressText}>{address}</Text>
                    </View>
                </View>

                <RoomStats
                    total={3}
                    rented={5}
                    available={7}
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