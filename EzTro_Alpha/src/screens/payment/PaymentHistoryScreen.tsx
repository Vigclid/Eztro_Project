import React, { useCallback, useState } from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Calendar, CreditCard, ArrowLeft } from "lucide-react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { IPaymentPackage } from "../../types/paymentPackage";
import { getPaymentPackageApi } from "../../api/paymentPackage/paymentPackage";
import { ApiResponse } from "../../types/app.common";
import PaymentPackageCard from "../../components/payment/PaymentPackageCard";
import { useFocusEffect } from "@react-navigation/native";
import { appNavigator } from "../../navigation/navigationActions";

// Extracted interface for transaction data typing (image URLs removed)
interface Transaction {
    id: string;
    dateStr: string;
    title: string;
    subtitle: string;
    time: string;
    amount: string;
    paymentMethod: string;
}

// Local constants for layout metrics that are not in the global theme
const METRICS = {
    HEADER_ICON_BOX: 43,
    TOTAL_CARD_RADIUS: 24,
    TX_CARD_RADIUS: 20,
    BORDER_WIDTH: 1,
    ELEVATION_HIGH: 12,
    ELEVATION_LOW: 8,
    LUCIDE_HEADER_SIZE: 28,
    LUCIDE_DATE_SIZE: 24,
    LUCIDE_TX_SIZE: 30,
};

export const PaymentHistoryScreen = () => {
    const [paymentPackages, setPaymentPackages] = useState<IPaymentPackage[]>([])

    useFocusEffect(
        useCallback(() => {
            const fetchPackage = async () => {
                const { getPaymentPackageByUserId } = getPaymentPackageApi
                try {
                    const res = await getPaymentPackageByUserId() as ApiResponse<IPaymentPackage[]>
                    if (res.status === "success") {
                        setPaymentPackages(res.data as IPaymentPackage[])
                    }
                } catch (err) { }
            }
            fetchPackage()
            return () => { }
        }, [])
    )

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.mainContainer}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[COLORS.GRADIENT_CARD_START, COLORS.GRADIENT_CARD_END]}
                        style={styles.headerGradient}
                    >
                        <TouchableOpacity style={styles.headerIconContainer}
                        onPress={() => appNavigator.goBack()}
                        >
                            <ArrowLeft size={METRICS.LUCIDE_HEADER_SIZE} color={COLORS.WHITE} />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
                        </View>
                        <View style={styles.headerRightBox} />
                    </LinearGradient>

                    <View style={styles.contentContainer}>
                        {/* <View style={styles.totalPaymentCard}>
                            <View style={styles.totalPaymentLabelContainer}>
                                <Text style={styles.totalPaymentLabel}>Tổng thanh toán gói</Text>
                            </View>
                            <View>
                                <Text style={styles.totalPaymentValue}>8.900.000đ</Text>
                            </View>
                        </View> */}

                        <View style={styles.historyListContainer}>
                            {paymentPackages.map((tx) => (
                                <View key={tx._id} style={styles.historyItem}>
                                    <PaymentPackageCard tx={tx} />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    mainContainer: {
        backgroundColor: COLORS.WHITE,
        paddingBottom: SPACING.XS,
    },
    headerGradient: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: SPACING.SMALL + 3, // ~13px
        paddingHorizontal: SPACING.MEDIUM, // 15px
    },
    headerIconContainer: {
        width: METRICS.HEADER_ICON_BOX,
        height: METRICS.HEADER_ICON_BOX,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        backgroundColor: '#FFFFFF80',
        borderRadius: 8
    },
    headerTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20
    },
    headerRightBox: {
        width: METRICS.HEADER_ICON_BOX,
        height: 75,
    },
    contentContainer: {
        padding: SPACING.MEDIUM, // 15px
    },
    totalPaymentCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: METRICS.TOTAL_CARD_RADIUS,
        padding: SPACING.INPUT_VERTICAL_PADDING, // 16px
        marginBottom: SPACING.PROFILE_WALLET_MARGIN_BOTTOM, // 25px
        shadowColor: COLORS.SHADOW_COLOR_LIGHT,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: METRICS.ELEVATION_HIGH,
        elevation: METRICS.ELEVATION_HIGH,
    },
    totalPaymentLabelContainer: {
        marginBottom: SPACING.LABEL_MARGIN_BOTTOM, // 9px
    },
    totalPaymentLabel: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: 13,
        fontWeight: "bold",
    },
    totalPaymentValue: {
        color: COLORS.ERROR_TEXT,
        fontSize: 20,
        fontWeight: "bold",
    },
    historyListContainer: {
        paddingBottom: SPACING.INPUT_VERTICAL_PADDING, // 16px
    },
    historyItem: {
        marginBottom: SPACING.PROFILE_SECTION_ITEM_MARGIN_BOTTOM, // ~33px
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING.OTP_BOX_MARGIN, // 8px
        marginBottom: SPACING.INPUT_MARGIN_BOTTOM, // 12px
    },
    dateIconWrapper: {
        marginRight: SPACING.INPUT_MARGIN_BOTTOM, // 12px
        justifyContent: "center",
        alignItems: "center",
    },
    dateText: {
        color: COLORS.TEXT_DARK,
        fontSize: 14,
        fontWeight: "bold",
    },
    transactionCard: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: METRICS.TX_CARD_RADIUS,
        borderWidth: METRICS.BORDER_WIDTH,
        paddingVertical: 17,
        paddingHorizontal: SPACING.INPUT_PADDING, // 18px
        shadowColor: COLORS.SHADOW_COLOR,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: METRICS.ELEVATION_LOW,
        elevation: METRICS.ELEVATION_LOW,
    },
    transactionHeader: {
        flexDirection: "row",
        marginBottom: SPACING.PROFILE_ROLE_MARGIN_BOTTOM, // 13px
    },
    txIconWrapper: {
        marginRight: SPACING.INPUT_VERTICAL_PADDING, // 16px
        justifyContent: "center",
        alignItems: "center",
    },
    transactionDetails: {
        flex: 1,
        marginRight: 17,
    },
    transactionTitleContainer: {
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    transactionTitle: {
        color: COLORS.TEXT_DARK,
        fontSize: 16,
        fontWeight: "bold",
    },
    transactionSubtitleContainer: {
        alignSelf: "flex-start",
        marginBottom: SPACING.LABEL_MARGIN_BOTTOM, // 9px
    },
    transactionSubtitle: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: 13,
    },
    transactionTimeContainer: {
        alignSelf: "flex-start",
    },
    transactionTime: {
        color: COLORS.PLACEHOLDER_GRAY,
        fontSize: 12,
    },
    transactionAmount: {
        color: COLORS.ERROR_TEXT,
        fontSize: 16,
        fontWeight: "bold",
    },
    paymentMethodContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: SPACING.CARD_SCREEN_HORIZONTAL_PADDING, // 21px
        paddingBottom: SPACING.OTP_BOX_MARGIN, // 8px
    },
    paymentMethodLabel: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: 13,
    },
    paymentMethodValue: {
        color: COLORS.TEXT_DARK,
        fontSize: 13,
        fontWeight: "bold",
    },
});