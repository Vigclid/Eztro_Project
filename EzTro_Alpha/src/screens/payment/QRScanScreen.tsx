import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
} from "react-native";
import {
    ArrowLeft,
    Copy,
    QrCode,
    CircleAlert
} from 'lucide-react-native'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IPackage } from "../../types/package";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { getPackageApi } from "../../api/package/package";
import { ApiResponse } from "../../types/app.common";
import { GeneratedRandomCode } from "../../constants/GeneratedRandomCode";
import axios from "axios";
import { postHouseApi } from "../../api/house/house";
import { IHouse } from "../../types/house";
import { appNavigator } from "../../navigation/navigationActions";

const COLORS = {
    white: "#FFFFFF",
    whiteTransparent: "#FFFFFF33",
    primary: "#10B981",
    primaryLight: "#14B8A6",
    primaryLightest: "#D1FAE5",
    primaryDark: "#047857",
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray300: "#D1D5DB",
    gray500: "#6B7280",
    gray700: "#374151",
    gray900: "#111827",
    successBackground: "#F0FDF4",
    infoBackground: "#DBEAFE",
    infoText: "#1E40AF",
    warningBackground: "#FEF3C7",
    warningText: "#92400E",
    shadow: "#0000001A",
};


const RADIUS = {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
};

export const QRScanScreen: React.FC = () => {
    const route = useRoute();
    const { houseData, packageId, paymentType } = route.params as any;
    const [bankName, setBankName] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { getPackageById } = getPackageApi
    const [pkg, setPkg] = useState<IPackage | null>(null)
    const [isSuccess, setIsSuccess] = useState(false);
    const { createHouse } = postHouseApi

    useFocusEffect(
        useCallback(() => {
            const fetchPackage = async () => {
                try {
                    const res = (await getPackageById(packageId)) as ApiResponse<IPackage>
                    if (res.status === "success") {
                        setPkg(res.data as IPackage)
                    }
                } catch (err) {
                    throw err
                }
            }
            if (paymentType === "PKG") fetchPackage();
        }, [])
    )

    const paymentDisplay = useMemo(() => {
        switch (paymentType) {
            case 'PKG':
                return {
                    amount: pkg?.price || 0,
                    title: "Thanh toán gói dịch vụ",
                    detailLabel: "Gói đăng ký",
                    detailValue: pkg?.packageName,
                    subCode: "PKG"
                };
            case 'INVOICE':
                return
            default:
                return
        }
    }, [paymentType, pkg]);

    const handleConfirmPayment = () => {
        setIsConfirmed(true);
    };

    useFocusEffect(
        useCallback(() => {
            if (!isConfirmed) return
            if (isSuccess) {
                handleSave();
                return
            }
            const timer = setInterval(() => {
                checkPaid(pkg?.price as number, transactionCode)
            }, 2000)

            return () => {
                clearInterval(timer)
            }
        }, [isConfirmed, isSuccess])
    )

    const checkPaid = async (amount: number, infor: string) => {
        if (isSuccess) return
        try {
            const response = await axios.get(
                'https://script.google.com/macros/s/AKfycbxHT2rsbazaMghhZJHZdtb1aXDnTmIBEFMN2ndH4cgKRg0JHS_dgVR8sLwJbvqaqWc9/exec'
            )
            const lastPaid = await response.data.data[response.data.data.length - 1]
            const paidInfor: string = lastPaid["Mô tả"]
            const paidAmount: number = lastPaid["Giá trị"]
            if (paidAmount === amount && paidInfor.includes(infor)) {
                setIsSuccess(true)
            }
        } catch (err) {
            Alert.alert(`Lỗi giao dịch`)
            console.error(err)
        }
    }

    const handleSave = async () => {
        switch (paymentType) {
            case 'PKG':
                houseData.packageId = packageId
                const res = (await createHouse(houseData)) as ApiResponse<IHouse>
                if (res.status === "success") {
                    Alert.alert('Thanh toán thành công!')
                    appNavigator.goToViewBoardingHousePage();
                }
            case 'INVOICE':
                return
            default:
                return
        }
    }

    const transactionCode = useMemo(() => {
        return `Pay${GeneratedRandomCode()}${paymentDisplay?.subCode}`
    }, [])

    const paymentQR = `https://img.vietqr.io/image/OCB-CASS049204001504-qr-only.png?amount=${paymentDisplay?.amount}&addInfo=${transactionCode}&accountName=NGUYEN%20VIET%20NGUYEN`;

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* HEADER SECTION */}
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    style={styles.headerGradient}
                >
                    <View style={styles.rowCentered}>
                        <TouchableOpacity >
                            <View style={styles.iconLarge}>
                                <ArrowLeft color={'#FFFFFF'} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.headerTextWrapper}>
                            <Text style={styles.titleText}>Thanh toán</Text>
                            <Text style={styles.subtitleText}>Hoàn tất đơn hàng của bạn</Text>
                        </View>
                    </View>

                </LinearGradient>

                {/* ORDER INFO CARD */}
                <View style={styles.orderInfoCard}>
                    <View style={styles.orderInfoHeader}>
                        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                        <LinearGradient
                            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                            colors={[COLORS.primaryLightest, "#A7F3D0"]}
                            style={styles.badgeGradient}
                        >
                            <Text style={styles.badgeText}>{paymentDisplay?.title}</Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Mã giao dịch</Text>
                        <View style={styles.transactionCodeWrapper}>
                            <View style={styles.transactionButton}>
                                <Text style={styles.transactionText}>{transactionCode}</Text>
                            </View>
                            <TouchableOpacity style={styles.iconMedium}>
                                <Copy color={`#6C757D`} size={15} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.spaceBetweenRow}>
                        <Text style={styles.labelText}>Cụm trọ</Text>
                        <Text style={styles.valueTextBold}>{houseData.houseName}</Text>
                    </View>

                    {paymentType === 'PKG' && (
                        <View>
                            <View style={styles.spaceBetweenRow}>
                                <Text style={styles.labelText}>{paymentDisplay?.detailLabel}</Text>
                                <Text style={styles.valueTextBold}>{paymentDisplay?.detailValue}</Text>
                            </View>
                            <View style={styles.spaceBetweenRow}>
                                <Text style={styles.labelText}>Thời hạn</Text>
                                <Text style={styles.valueTextBold}>{pkg?.duration} tháng</Text>
                            </View>
                            <View style={styles.spaceBetweenRow}>
                                <Text style={styles.labelText}>Giá gốc</Text>
                                <Text style={styles.labelText}>{pkg?.price}₫</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalValue}>{paymentDisplay?.amount}₫</Text>
                    </View>

                    {!isConfirmed && (
                        <TouchableOpacity style={styles.mainActionBtn} onPress={handleConfirmPayment}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primaryLight]}
                                style={styles.mainActionGradient}
                            >
                                <Text style={styles.primaryButtonText}>Xác nhận thanh toán ngay</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>

                {isConfirmed && (
                    <>
                        {/* QR CARD */}
                        <View style={styles.methodCard}>
                            <View style={styles.qrHeaderRow}>
                                <View style={styles.qrHeaderIcon}>
                                    <QrCode color={'#FFFFFF'} />
                                </View>
                                <View style={styles.flexOne}>
                                    <Text style={styles.qrTitle}>Quét mã QR</Text>
                                    <Text style={styles.labelText}>Mở ứng dụng Ngân hàng để quét</Text>
                                </View>
                            </View>

                            <LinearGradient colors={[COLORS.gray50, COLORS.gray100]} style={styles.qrBoxBackground}>
                                <View style={styles.qrCodeWrapper}>
                                    <Image
                                        source={{ uri: paymentQR }}
                                        style={styles.qrImage}
                                    />
                                    <Text style={styles.qrCodeLabel}>Mã QR thanh toán tự động</Text>
                                </View>
                            </LinearGradient>

                            <View style={styles.infoBanner}>
                                <View style={styles.infoBannerIcon}>
                                    <CircleAlert size={15} color={COLORS.infoText} />
                                </View>
                                <Text style={styles.infoBannerText}>Số tiền và nội dung đã được điền sẵn</Text>
                            </View>
                        </View>

                        {/* MANUAL TRANSFER CARD */}
                        <View style={styles.methodCard}>
                            <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Chuyển khoản thủ công</Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.inputLabel}>Ngân hàng</Text>
                                <TextInput placeholder="OCB" value={bankName} onChangeText={setBankName} style={styles.inputField} />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.inputLabel}>Số tài khoản</Text>
                                <View style={styles.copyableField}>
                                    <Text style={styles.copyableTextPrimary}>CASS049204001504</Text>
                                    <TouchableOpacity style={styles.iconMedium}>
                                        <Copy color={`#6C757D`} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.inputLabel}>Nội dung chuyển khoản</Text>
                                <View style={styles.copyableField}>
                                    <Text style={styles.copyableTextPrimary}>{transactionCode}</Text>
                                    <TouchableOpacity style={styles.iconMedium}>
                                        <Copy color={`#6C757D`} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.warningBanner}>
                                <View style={styles.warningIcon}>
                                    <CircleAlert size={20} color={COLORS.warningText} />
                                </View>
                                <View style={styles.flexOne}>
                                    <Text style={styles.warningTitle}>Lưu ý quan trọng</Text>
                                    <Text style={styles.warningText}>Vui lòng giữ đúng nội dung để hệ thống tự động kích hoạt gói ngay lập tức.</Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* SUPPORT SECTION */}
                <View style={styles.supportSection}>
                    <Text style={styles.totalLabel}>Cần hỗ trợ?</Text>
                    <Text style={styles.supportText}>Liên hệ: 0356 675 177 hoặc Eztro@gmail.com</Text>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.gray50 },
    scrollView: { flex: 1 },
    flexOne: { flex: 1 },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 40,
        paddingHorizontal: 23,
    },
    rowCentered: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    iconLarge: { alignItems: "center", justifyContent: "center", width: 43, height: 43, padding: 24, backgroundColor: "#FFFFFF70", borderRadius: 10 },
    headerTextWrapper: { flex: 1, marginLeft: 15 },
    titleText: { color: COLORS.white, fontSize: 22, fontWeight: "bold" },
    subtitleText: { color: COLORS.white, fontSize: 14, opacity: 0.9 },
    countdownContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.whiteTransparent,
        borderRadius: RADIUS.l,
        paddingVertical: 10,
    },
    iconSmall: { width: 18, height: 18, marginRight: 8 },
    orderInfoCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: 20,
        marginHorizontal: 20,
        marginTop: -30,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    orderInfoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    sectionTitle: { color: COLORS.gray900, fontSize: 18, fontWeight: "bold" },
    badgeGradient: { borderRadius: RADIUS.round, paddingVertical: 4, paddingHorizontal: 12 },
    badgeText: { color: COLORS.primaryDark, fontSize: 12, fontWeight: "bold" },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
    labelText: { color: COLORS.gray500, fontSize: 14 },
    transactionCodeWrapper: { flexDirection: "row", alignItems: "center" },
    transactionButton: { backgroundColor: COLORS.gray100, borderRadius: RADIUS.s, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8 },
    transactionText: { color: COLORS.gray900, fontSize: 12, fontWeight: "bold" },
    iconMedium: { alignItems: "center", justifyContent: "center", width: 24, height: 24 },
    spaceBetweenRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    valueTextBold: { color: COLORS.gray900, fontSize: 14, fontWeight: "bold" },
    vatRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    totalLabel: { color: COLORS.gray900, fontSize: 16, fontWeight: "bold" },
    totalValue: { color: COLORS.primary, fontSize: 24, fontWeight: "bold" },
    mainActionBtn: { marginTop: 20 },
    mainActionGradient: { borderRadius: RADIUS.m, paddingVertical: 15, alignItems: "center" },
    primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
    methodCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.05,
        elevation: 3,
    },
    qrHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    qrHeaderIcon: { alignItems: "center", justifyContent: "center", width: 40, height: 40, marginRight: 12, backgroundColor: '#14b899', borderRadius: 10 },
    qrTitle: { color: COLORS.gray900, fontSize: 18, fontWeight: "bold" },
    qrBoxBackground: {
        borderRadius: RADIUS.l,
        padding: 10,
        marginBottom: 15
    },
    qrCodeWrapper: { alignItems: "center", backgroundColor: COLORS.white, borderRadius: RADIUS.l, padding: 30, borderWidth: 1, borderColor: COLORS.gray300 },
    qrImage: { width: 300, height: 220, marginBottom: 10 },
    qrCodeLabel: { color: COLORS.gray500, fontSize: 12 },
    infoBanner: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.infoBackground, borderRadius: RADIUS.m, padding: 12 },
    infoBannerIcon: { alignItems: "center", justifyContent: "center", width: 16, height: 16, marginRight: 8 },
    infoBannerText: { color: COLORS.infoText, fontSize: 13, fontWeight: "600", flex: 1 },
    formGroup: { marginBottom: 15 },
    inputLabel: { color: COLORS.gray500, fontSize: 12, fontWeight: "bold", marginBottom: 8 },
    inputField: { backgroundColor: COLORS.gray50, borderRadius: RADIUS.m, padding: 12, color: COLORS.gray900, fontWeight: "bold" },
    copyableField: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.gray50, borderRadius: RADIUS.m, padding: 12 },
    copyableTextPrimary: { color: COLORS.primary, fontSize: 16, fontWeight: "bold" },
    warningBanner: { flexDirection: "row", backgroundColor: COLORS.warningBackground, borderRadius: RADIUS.m, padding: 12, marginTop: 10 },
    warningIcon: { width: 20, height: 20, marginRight: 10 },
    warningTitle: { color: COLORS.warningText, fontSize: 14, fontWeight: "bold", marginBottom: 2 },
    warningText: { color: COLORS.warningText, fontSize: 12, opacity: 0.9 },
    supportSection: { padding: 40, alignItems: "center" },
    supportText: { color: COLORS.gray500, fontSize: 13, marginTop: 8, textAlign: "center" },
});