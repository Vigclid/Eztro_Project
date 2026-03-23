import React, { useCallback, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ChevronLeft,
    AlertTriangle,
} from "lucide-react-native";

import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../../constants/theme";
import { appNavigator } from "../../navigation/navigationActions";
import { IHouseDelete } from "../../types/house";
import { useFocusEffect } from "@react-navigation/native";
import { ApiResponse } from "../../types/app.common";
import { deleteHouseApi, getHouseApi } from "../../api/house/house";
import DeleteBoardingHouseCard from "../../components/boardingHouse/DeleteBoardingHouseCard";

// --- Local Constants & Styling Adjustments ---
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

// --- Main Screen Component ---

export const DeleteBoardingHouseScreen = () => {
    const [houses, setHouses] = useState<IHouseDelete[]>([])

    const handleDeleteHouse = useCallback(async (houseId: string) => {
        try {
            const res = await deleteHouseApi.deleteHouse(houseId) as ApiResponse<any>;
            if (res.status === 'success') {
                fetchHouses();
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchHouses = useCallback(async () => {
        const { getHouseDelete } = getHouseApi;
        try {
            const res = await getHouseDelete() as ApiResponse<IHouseDelete[]>;
            if (res.status === 'success') {
                setHouses(res.data as IHouseDelete[]);
            }
        } catch (err) { }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchHouses();
        }, [fetchHouses])
    );

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <LinearGradient colors={SCREEN_GRADIENTS.HEADER} style={styles.headerGradient}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => appNavigator.goBack()} style={styles.headerIconWrapper}>
                        <ChevronLeft color={COLORS.WHITE} size={ICON_SIZES.HEADER} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Xóa cụm trọ</Text>
                    <View style={styles.headerSpacer} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <LinearGradient colors={SCREEN_GRADIENTS.WARNING_BANNER} style={styles.warningBanner}>
                    <View style={styles.warningBannerIconWrapper}>
                        <AlertTriangle color={COLORS.ERROR_TEXT} size={ICON_SIZES.WARNING} />
                    </View>
                    <View style={styles.warningBannerTextCol}>
                        <Text style={styles.warningBannerTitle}>Lưu ý quan trọng</Text>
                        <Text style={styles.warningBannerText}>
                            Bạn chỉ có thể xóa các cụm trọ không còn người thuê. Vui lòng chấm dứt tất cả hợp đồng trước khi xóa.
                        </Text>
                    </View>
                </LinearGradient>

                <View style={styles.listContainer}>
                    {houses.map((house: IHouseDelete) => (
                        <DeleteBoardingHouseCard
                            key={house._id}
                            house={house}
                            handleDeleteHouse={handleDeleteHouse}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.RED_TEXT || "#EF4444",
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_GRAY || "#FFFFFF",
    },
    scrollContent: {
        paddingBottom: SPACING.SCROLL_BOTTOM_PADDING || 56,
    },
    headerGradient: {
        paddingBottom: SPACING.LARGE || 24,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING || 23,
        paddingTop: SPACING.LARGE || 24,
    },
    headerIconWrapper: {
        padding: SPACING.XS || 4,
    },
    headerTitle: {
        color: COLORS.WHITE,
        fontSize: FONT_SIZE.HEADER_TITLE || 20,
        fontWeight: "bold",
    },
    headerSpacer: {
        width: ICON_SIZES.HEADER,
        height: ICON_SIZES.HEADER,
    },
    warningBanner: {
        flexDirection: "row",
        borderColor: COLORS.RED_LIGHT_BORDER || "#FECACA",
        borderRadius: BORDER_RADIUS.BUTTON || 20,
        borderWidth: 1,
        padding: SPACING.XXL || 22,
        marginHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING || 23,
        marginTop: SPACING.XL || 20,
        marginBottom: SPACING.XL || 24,
    },
    warningBannerIconWrapper: {
        marginRight: SPACING.MEDIUM || 12,
        justifyContent: "center",
    },
    warningBannerTextCol: {
        flex: 1,
        paddingRight: SPACING.MEDIUM || 12,
    },
    warningBannerTitle: {
        color: "#991B1B",
        fontSize: FONT_SIZE.CREATE_FORM_INPUT || 16,
        fontWeight: "bold",
        marginBottom: SPACING.SMALL || 8,
    },
    warningBannerText: {
        color: "#7F1D1D",
        fontSize: FONT_SIZE.LABEL || 14,
        lineHeight: 20,
    },
    listContainer: {
        paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING || 23,
        gap: SPACING.MEDIUM_LARGE || 20,
    },
});