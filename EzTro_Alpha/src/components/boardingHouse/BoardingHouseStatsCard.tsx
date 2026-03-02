import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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

const BoardingHouseStatsCard = ({ totalBoardingHouse = 3, totalRooms = 4 }) => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <View style={styles.statBoardingHouseIcon}>
                    <DoorOpen
                        color={COLORS.WHITE}
                        size={28}
                    />
                </View>
                <View style={styles.statTextContainer}>
                    <View style={styles.statLabelContainer}>
                        <Text style={styles.statLabel}>{"Tổng cụm trọ"}</Text>
                    </View>
                    <View style={styles.statValueContainer}>
                        <Text style={styles.statValue}>{totalBoardingHouse}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statCard}>
                <View style={styles.statRoomIcon}>
                    <Users
                        color={COLORS.WHITE}
                        size={28}
                    />
                </View>
                <View style={styles.statTextContainer}>
                    <View style={styles.statLabelContainer}>
                        <Text style={styles.statLabel}>{"Tổng cộng phòng"}</Text>
                    </View>
                    <View style={styles.statLabelContainer}>
                        <Text style={styles.statValue}>{totalRooms}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    statBoardingHouseIcon: {
        backgroundColor: "#00ca99",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: IMAGE_SIZE.STAT_ICON,
        height: IMAGE_SIZE.STAT_ICON,
        marginRight: SPACING.STAT_CARD_ICON_MARGIN_RIGHT,
    },
    statRoomIcon: {
        backgroundColor: "#558eff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: IMAGE_SIZE.STAT_ICON,
        height: IMAGE_SIZE.STAT_ICON,
        marginRight: SPACING.STAT_CARD_ICON_MARGIN_RIGHT,
    },
    statTextContainer: {
        paddingBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
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
});

export default BoardingHouseStatsCard