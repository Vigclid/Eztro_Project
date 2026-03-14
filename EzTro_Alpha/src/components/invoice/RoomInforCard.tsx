import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZE,
    SPACING,
} from "../../constants/theme";
import { formatCurrencyVND } from "../../utils/currency";
import { IRoomInvoice } from "../../types/invoice";
interface RoomInforCardProp {
    room: IRoomInvoice
    toggleRoomSelection: (roomId: string | undefined) => void
    setSelectedRoomDetail: (room: IRoomInvoice) => void
}

const RoomInforCard = ({ room, toggleRoomSelection, setSelectedRoomDetail }: RoomInforCardProp) => {

    return (
        <View style={styles.roomCard}>
            <View style={styles.roomHeader}>
                <TouchableOpacity
                    onPress={() => toggleRoomSelection(room._id)}
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

                {/* Wrapper bọc Title để ấn vào xem chi tiết */}
                <TouchableOpacity
                    style={styles.roomTitleWrapper}
                    activeOpacity={0.7}
                    onPress={() => setSelectedRoomDetail(room)}
                >
                    <Text style={styles.roomNameText}>{room.roomName}</Text>
                    <Text style={styles.tenantText}>{room.tenantName}</Text>
                </TouchableOpacity>

                <View style={styles.roomStatusBadge} />
            </View>

            <View style={styles.breakdownContainer}>
                <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabelText}>
                        Tiền phòng
                    </Text>
                    <Text style={styles.breakdownLabelText}>
                        {formatCurrencyVND(room.rentalFee)}
                    </Text>
                </View>
                <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabelText}>
                        Điện ({room.electricityUsage} số)
                    </Text>
                    <Text style={styles.breakdownLabelText}>
                        {formatCurrencyVND(room.electricityCost)}
                    </Text>
                </View>
                <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabelText}>
                        Nước ({room.waterUsage} số)
                    </Text>
                    <Text style={styles.breakdownLabelText}>
                        {formatCurrencyVND(room.waterCost)}
                    </Text>
                </View>
                {room?.utilities.map((item: any, index: number) => (
                    <View key={index} style={styles.breakdownRow}>
                        <View style={styles.breakdownLabelWrapper}>
                            <Text style={styles.breakdownLabelText}>
                                {item.key}
                            </Text>
                        </View>
                        <Text style={styles.breakdownAmountText}>
                            {formatCurrencyVND(item.value)}
                        </Text>
                    </View>
                ))}

                <View style={styles.breakdownFooter}>
                    <Text style={styles.breakdownTotalLabel}>Tổng cộng</Text>
                    <Text style={styles.breakdownTotalAmount}>{formatCurrencyVND(room.totalAmount)}</Text>
                </View>
            </View>
        </View>
    )

}

export default RoomInforCard

const styles = StyleSheet.create({
    // ---- STYLES CŨ GIỮ NGUYÊN ----
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
        fontWeight: 'bold'
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
})