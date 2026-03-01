// components/RoomStats.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZE,
    IMAGE_SIZE,
    SPACING,
} from "../../constants/theme";
import {
    DoorOpen,
    Users
} from "lucide-react-native";

interface RoomStatsProps {
    total: number;
    rented: number;
    available: number;
}

const RoomStats = ({ total = 1, rented = 2, available = 3, }: RoomStatsProps) => {
    return (
        <View style={styles.roomStatsContainer}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[COLORS.GRAY_LIGHT_GRADIENT_START, COLORS.GRAY_LIGHT_GRADIENT_END]}
                style={styles.roomStatItem}
            >
                <View style={[styles.roomStatIcon, styles.bgBlue]}>
                    <DoorOpen
                        color={COLORS.WHITE}
                        size={18}
                    />
                </View>
                <View style={styles.roomStatTextContainer}>
                    <View style={styles.roomStatValueContainer}>
                        <Text style={styles.roomStatValue}>{total}</Text>
                    </View>
                    <View>
                        <Text style={styles.roomStatLabel}>Tổng phòng</Text>
                    </View>
                </View>
            </LinearGradient>

            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[COLORS.GRAY_LIGHT_GRADIENT_START, COLORS.GRAY_LIGHT_GRADIENT_END]}
                style={styles.roomStatItem}
            >
                <View style={[styles.roomStatIcon, styles.bgGreen]}>
                    <Users
                        color={COLORS.WHITE}
                        size={18}
                    />
                </View>
                <View style={styles.roomStatTextContainerAlt}>
                    <View style={styles.roomStatValueContainer}>
                        <Text style={styles.roomStatValue}>{rented}</Text>
                    </View>
                    <View>
                        <Text style={styles.roomStatLabel}>Đang thuê</Text>
                    </View>
                </View>
            </LinearGradient>

            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[COLORS.GRAY_LIGHT_GRADIENT_START, COLORS.GRAY_LIGHT_GRADIENT_END]}
                style={styles.roomStatItemLast}
            >
                <View style={[styles.roomStatIcon, styles.bgOrange]}>
                    <DoorOpen
                        color={COLORS.WHITE}
                        size={18}
                    />
                </View>
                <View style={styles.roomStatTextContainerAlt2}>
                    <View style={styles.roomStatValueContainer}>
                        <Text style={styles.roomStatValue}>{available}</Text>
                    </View>
                    <View>
                        <Text style={styles.roomStatLabel}>Còn trống</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
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
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        width: 40,
        height: 40,
        marginBottom: SPACING.STAT_ITEM_ICON_MARGIN_BOTTOM,
    },
    bgBlue: {
        backgroundColor: "#3a8dff",
    },
    bgGreen: {
        backgroundColor: "#00c282",
    },
    bgOrange: {
        backgroundColor: "#ff7301",
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
});

export default RoomStats