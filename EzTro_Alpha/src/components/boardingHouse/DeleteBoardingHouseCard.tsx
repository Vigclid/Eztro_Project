import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import {
    MapPin,
    House,
    Building2,
    Users,
    CheckCircle2,
    XCircle,
    Trash2,
    Info
} from "lucide-react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../constants/theme";
import { IHouseDelete } from "../../types/house";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_GRADIENTS = {
    HEADER: ["#EF4444", "#DC2626"] as const,
    WARNING_BANNER: [COLORS.WHITE, COLORS.RED_LIGHT_BG] as const,
    STAT_BG: [COLORS.GRAY_LIGHT_GRADIENT_START || "#F9FAFB", COLORS.GRAY_LIGHT_GRADIENT_END || "#F3F4F6"] as const,
    BADGE_ERROR: [COLORS.RED_LIGHT_BG || "#FEE2E2", COLORS.RED_LIGHT_BORDER || "#FECACA"] as const,
    BADGE_SUCCESS: [COLORS.LIGHT_GREEN_BACKGROUND || "#D1FAE5", "#A7F3D0"] as const,
};

const ICON_SIZES = {
    HEADER: 28,
    WARNING: 32,
    LOCATION: 14,
    STAT: 24,
    BADGE: 16,
    INFO: 14,
    DELETE: 18,
};

interface DeleteBoardingHouseCardProps {
    house: IHouseDelete;
    handleDeleteHouse: (houseId: string) => void;
}

const DeleteBoardingHouseCard = ({ house, handleDeleteHouse }: DeleteBoardingHouseCardProps) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
                <View style={styles.houseIconContainer}>
                    <Building2 color={COLORS.WHITE} size={28} />
                </View>
                <View style={styles.cardHeaderTextCol}>
                    <Text style={styles.houseName}>{house.houseName}</Text>
                    <View style={styles.locationRow}>
                        <MapPin color={COLORS.SECONDARY_TEXT} size={ICON_SIZES.LOCATION} style={styles.locationIcon} />
                        <Text style={styles.locationText}>{house.address}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <LinearGradient colors={SCREEN_GRADIENTS.STAT_BG} style={styles.statRow}>
                    <View style={styles.statIconWrapper}>
                        <House color={COLORS.GREEN_PRIMARY} size={ICON_SIZES.STAT} />
                    </View>
                    <View>
                        <Text style={styles.statValue}>{house.totalRooms}</Text>
                        <Text style={styles.statLabel}>Tổng phòng</Text>
                    </View>
                </LinearGradient>
                <LinearGradient colors={SCREEN_GRADIENTS.STAT_BG} style={[styles.statRow, styles.statRowLast]}>
                    <View style={styles.statIconWrapper}>
                        <Users color={COLORS.GREEN_PRIMARY} size={ICON_SIZES.STAT} />
                    </View>
                    <View>
                        <Text style={styles.statValue}>{house.rentedRooms}</Text>
                        <Text style={styles.statLabel}>Đang thuê</Text>
                    </View>
                </LinearGradient>
            </View>

            <LinearGradient
                colors={house.rentedRooms === 0 ? SCREEN_GRADIENTS.BADGE_SUCCESS : SCREEN_GRADIENTS.BADGE_ERROR}
                style={styles.badgeContainer}
            >
                {house.rentedRooms === 0 ? (
                    <CheckCircle2 color={COLORS.SUCCESS_TEXT} size={ICON_SIZES.BADGE} style={styles.badgeIcon} />
                ) : (
                    <XCircle color={COLORS.ERROR_TEXT} size={ICON_SIZES.BADGE} style={styles.badgeIcon} />
                )}
                <Text style={[styles.badgeText, house.rentedRooms === 0 ? styles.badgeTextSuccess : styles.badgeTextError]}>
                    {house.rentedRooms === 0 ? "Có thể xóa" : "Không thể xóa"}
                </Text>
            </LinearGradient>

            {house.rentedRooms === 0 ? (
                <TouchableOpacity activeOpacity={0.8} style={styles.deleteButtonActiveWrapper}
                    onPress={() => handleDeleteHouse(house._id)}
                >
                    <LinearGradient colors={SCREEN_GRADIENTS.HEADER} style={styles.deleteButtonActive}>
                        <Trash2 color={COLORS.WHITE} size={ICON_SIZES.DELETE} style={styles.buttonIcon} />
                        <Text style={styles.deleteButtonTextActive}>Xóa cụm trọ</Text>
                    </LinearGradient>
                </TouchableOpacity>
            ) : (
                <View style={styles.deleteButtonDisabled}>
                    <Trash2 color={COLORS.SECONDARY_TEXT} size={ICON_SIZES.DELETE} style={styles.buttonIcon} />
                    <Text style={styles.deleteButtonTextDisabled}>Xóa cụm trọ</Text>
                </View>
            )}

            {house.rentedRooms > 0 && (
                <View style={styles.cardWarningContainer}>
                    <Info color={COLORS.ERROR_TEXT} size={ICON_SIZES.INFO} style={styles.infoIcon} />
                    <Text style={styles.cardWarningText}>{`Cụm trọ đang có ${house.rentedRooms} phòng đang được thuê`}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.BORDER || "#F3F4F6",
        borderRadius: BORDER_RADIUS.BUTTON || 20,
        borderWidth: 1,
        paddingVertical: SPACING.XXL || 24,
        paddingHorizontal: SPACING.XXL || 24,
        shadowColor: "#0000000D",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.XL || 20,
    },
    houseIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: COLORS.GREEN_PRIMARY || "#F7F8F9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: SPACING.MEDIUM || 12,
    },
    cardHeaderTextCol: {
        flex: 1,
    },
    houseName: {
        color: COLORS.DARK_TEXT || "#1F2937",
        fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE || 18,
        fontWeight: "bold",
        marginBottom: SPACING.XS || 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationIcon: {
        marginRight: SPACING.XS || 4,
    },
    locationText: {
        color: COLORS.SECONDARY_TEXT || "#6B7280",
        fontSize: FONT_SIZE.LABEL || 14,
    },
    statsContainer: {
        marginBottom: SPACING.MEDIUM_LARGE || 16,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BORDER_RADIUS.FEATURE_BADGE || 14,
        paddingVertical: SPACING.MEDIUM || 12,
        paddingHorizontal: SPACING.MEDIUM || 12,
        marginBottom: SPACING.MEDIUM || 12,
    },
    statRowLast: {
        marginBottom: 0,
    },
    statIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: SPACING.MEDIUM || 12,
    },
    statValue: {
        color: COLORS.DARK_TEXT || "#1F2937",
        fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE || 18,
        fontWeight: "bold",
        marginBottom: 2,
    },
    statLabel: {
        color: COLORS.SECONDARY_TEXT || "#6B7280",
        fontSize: FONT_SIZE.STAT_ITEM_LABEL || 12,
    },
    badgeContainer: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BORDER_RADIUS.BACK_BUTTON || 12,
        paddingVertical: SPACING.SMALL || 8,
        paddingHorizontal: SPACING.MEDIUM || 12,
        marginBottom: SPACING.MEDIUM_LARGE || 16,
    },
    badgeIcon: {
        marginRight: SPACING.XS || 6,
    },
    badgeText: {
        fontSize: FONT_SIZE.LABEL || 14,
        fontWeight: "bold",
    },
    badgeTextError: {
        color: COLORS.ERROR_TEXT || "#991B1B",
    },
    badgeTextSuccess: {
        color: COLORS.SUCCESS_TEXT || "#065F46",
    },
    deleteButtonActiveWrapper: {
        width: "100%",
    },
    deleteButtonActive: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BORDER_RADIUS.FEATURE_BADGE || 14,
        paddingVertical: SPACING.MEDIUM_LARGE || 16,
    },
    deleteButtonDisabled: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.DIVIDER_GRAY || "#D1D5DB",
        borderRadius: BORDER_RADIUS.FEATURE_BADGE || 14,
        paddingVertical: SPACING.MEDIUM_LARGE || 16,
        marginBottom: SPACING.MEDIUM || 12,
    },
    buttonIcon: {
        marginRight: SPACING.SMALL || 8,
    },
    deleteButtonTextActive: {
        color: COLORS.WHITE,
        fontSize: FONT_SIZE.CREATE_FOOTER_BUTTON || 16,
        fontWeight: "bold",
    },
    deleteButtonTextDisabled: {
        color: COLORS.SECONDARY_TEXT || "#6A707C",
        fontSize: FONT_SIZE.CREATE_FOOTER_BUTTON || 16,
        fontWeight: "bold",
    },
    cardWarningContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.RED_LIGHT_BG || "#FEF2F2",
        borderColor: COLORS.RED_LIGHT_BORDER || "#FECACA",
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: SPACING.MEDIUM || 12,
        paddingHorizontal: SPACING.MEDIUM || 12,
        marginTop: SPACING.MEDIUM || 12,
    },
    infoIcon: {
        marginRight: SPACING.SMALL || 8,
    },
    cardWarningText: {
        color: COLORS.ERROR_TEXT || "#991B1B",
        fontSize: 13,
        flex: 1,
    },
});

export default DeleteBoardingHouseCard