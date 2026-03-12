import React, { useCallback, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import {
    Building2,
    MapPin,
    House,
    SquarePen,
    ArrowLeft,
    Package
} from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { getPackageApi } from "../../api/package/package";
import { IPackage } from "../../types/package";
import { useFocusEffect } from "@react-navigation/native";
import { ApiResponse } from "../../types/app.common";
import PackageCard from "../../components/package/PackageCard";
import { useNavigation } from "expo-router";
import { NavigationProp } from "../../navigation/navigation.type";
import { appNavigator } from "../../navigation/navigationActions";

const { width } = Dimensions.get("window");

const THEME = {
    colors: {
        primary: "#10B981",
        secondary: "#14B8A6",
        warning: "#F59E0B",
        warningDark: "#D97706",
        danger: "#B91C1C",
        dangerLight: "#FEE2E2",
        white: "#FFFFFF",
        textMain: "#111827",
        textSecondary: "#6B7280",
        textMuted: "#4B5563",
        border: "#D1FAE5",
        bgLight: "#F9FAFB",
        grayLight: "#F3F4F6",
        grayMedium: "#D1D5DB",
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    }
};


export const PackagePaymentScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { houseData } = route.params as any
    const { getAllPackages } = getPackageApi
    const [packages, setPackages] = useState<IPackage[] | null>(null);
    const [packageSelectedId, setPackageSelectedId] = useState<string | null>(null);

    const handleConfirmPayment = () => {
        appNavigator.goToQRScanScreen(houseData, packageSelectedId, 'PKG');
    }
    useFocusEffect(
        useCallback(() => {
            const fetchPackages = async () => {
                try {
                    const res = (await getAllPackages()) as ApiResponse<IPackage[]>
                    if (res.status === "success") {
                        setPackages(res.data as IPackage[]);
                    }
                } catch (err) { }
            }
            fetchPackages();
            return () => { }
        }, [])
    )

    // Hàm format tiền VND
    const formatVND = (value: number) => {
        return value.toLocaleString('vi-VN');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.mainColumn}>

                    {/* Header Section */}
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[THEME.colors.primary, THEME.colors.secondary]}
                        style={styles.headerGradient}
                    >
                        <TouchableOpacity style={styles.headerIcon}
                            onPress={() => navigation.goBack()}
                        >
                            <ArrowLeft color={'#FFFFFF'} />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Chọn gói quản lý</Text>
                            <Text style={styles.headerSubtitle}>Chọn gói phù hợp với nhu cầu của bạn</Text>
                        </View>
                    </LinearGradient>

                    {/* House Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.houseRow}>
                            <View style={styles.houseImage}>
                                <Building2 size={50} color={'#FFFFFF'} />
                            </View>
                            <View style={styles.houseDetails}>
                                <Text style={styles.houseName}>{houseData.houseName}</Text>
                                <View style={styles.addressRow}>
                                    <View style={styles.smallIcon}>
                                        <MapPin size={15} />
                                    </View>
                                    <Text style={styles.addressText}>{houseData.address}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.editButton}
                                onPress={() => navigation.goBack()}
                            >
                                <View style={styles.editIcon}>
                                    <SquarePen size={15} color={THEME.colors.textMuted} />
                                </View>
                                <Text style={styles.editText}>Sửa</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.statsDivider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Số phòng</Text>
                                <View style={styles.statValueContainer}>
                                    <View style={styles.smallIcon}>
                                        <House size={18} />
                                    </View>
                                    <Text style={styles.statValue}>{houseData.roomCount}</Text>
                                </View>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Giá mặc định</Text>
                                <Text style={styles.statValue}>{formatVND(Number(houseData.defaultPrice))} ₫</Text>
                            </View>
                        </View>
                    </View>

                    {/* Package Selection Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Các gói tính năng</Text>
                        <Text style={styles.sectionSubtitle}>Chọn gói phù hợp với số lượng phòng bạn cần quản lý</Text>
                    </View>

                    {/* Package Card - Basic */}
                    {packages && packages.map((pkg) => (
                        <PackageCard
                            key={pkg._id}
                            pkg={pkg}
                            roomCount={houseData.roomCount}
                            isSelected={packageSelectedId === pkg._id}
                            onSelect={() => {
                                setPackageSelectedId(pkg._id)
                            }}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Fixed Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => handleConfirmPayment()}
                    style={[
                        styles.submitButton,
                        packageSelectedId ? { backgroundColor: THEME.colors.primary } : { backgroundColor: THEME.colors.grayMedium }
                    ]}
                    activeOpacity={0.8}
                    disabled={!packageSelectedId}
                >
                    <View style={styles.submitIcon}>
                        <Package color={'#FFFFFF'}/>
                    </View>
                    <Text style={styles.submitText}>Xác nhận và thanh toán</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.white,
    },
    scrollView: {
        flex: 1,
    },
    mainColumn: {
        paddingBottom: 120,
    },
    headerGradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 28,
    },
    headerIcon: {
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF70',
        borderRadius: 10,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: THEME.spacing.md,
    },
    headerTitle: {
        color: THEME.colors.white,
        fontSize: 20,
        fontWeight: "bold",
    },
    headerSubtitle: {
        color: THEME.colors.white,
        fontSize: 14,
        marginTop: 2,
    },
    infoCard: {
        backgroundColor: THEME.colors.white,
        borderColor: THEME.colors.border,
        borderRadius: THEME.radius.xl,
        borderWidth: 1,
        padding: THEME.spacing.lg,
        marginHorizontal: THEME.spacing.lg,
        marginTop: THEME.spacing.lg,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    houseRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    houseImage: {
        padding: 35,
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        borderRadius: 10,
        backgroundColor: '#14b893',
    },
    houseDetails: {
        flex: 1,
        marginLeft: THEME.spacing.md,
    },
    houseName: {
        color: THEME.colors.textMain,
        fontSize: 18,
        fontWeight: "bold",
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    smallIcon: {
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        marginRight: 4,
    },
    addressText: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: THEME.colors.grayLight,
        borderRadius: THEME.radius.md,
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.md,
    },
    editIcon: {
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        marginRight: 6,
    },
    editText: {
        color: THEME.colors.textMuted,
        fontSize: 14,
        fontWeight: "bold",
    },
    statsDivider: {
        height: 1,
        backgroundColor: THEME.colors.grayLight,
        marginVertical: THEME.spacing.md,
    },
    statsRow: {
        flexDirection: "row",
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        color: THEME.colors.textSecondary,
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
    },
    statValueContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statValue: {
        color: THEME.colors.textMain,
        fontSize: 16,
        fontWeight: "bold",
    },
    sectionHeader: {
        marginTop: THEME.spacing.lg,
        marginHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
    },
    sectionTitle: {
        color: THEME.colors.textMain,
        fontSize: 18,
        fontWeight: "bold",
    },
    sectionSubtitle: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: width,
        backgroundColor: THEME.colors.white,
        paddingVertical: THEME.spacing.md,
        paddingHorizontal: THEME.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: THEME.colors.grayLight,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 6,
        elevation: 8,
    },
    submitButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: THEME.radius.lg,
        paddingVertical: 14,
    },
    submitIcon: {
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        marginRight: 8,
    },
    submitText: {
        color: THEME.colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});