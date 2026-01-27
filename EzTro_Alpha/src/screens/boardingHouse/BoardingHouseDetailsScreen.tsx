import React, { use, useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/theme";
import { IRoom } from "../../types/room";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/navigation.type";
import { IHouse } from "../../types/house";
import { getHouseApi } from "../../api/house/house";
import { ApiResponse } from "../../types/app.common";

type DetailsRouteProps = RouteProp<MainStackParamList, 'boardingHouseDetailsScreen'>;

// ============================================================================
// DATA & TYPES
// ============================================================================
//m²
const ROOMS_DATA: IRoom[] = [
    { _id: '101', roomName: 'Phòng 101', status: 'rented', area: 25, floor: 1, rentalFee: 3000000, rentDate: new Date() },
    { _id: '102', roomName: 'Phòng 102', status: 'empty', area: 20, floor: 1, rentalFee: 2000000, rentDate: new Date() },
    { _id: '201', roomName: 'Phòng 201', status: 'rented', area: 30, floor: 2, rentalFee: 3500000, rentDate: new Date() },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const StatBox = ({ value, label, isLast }: { value: string; label: string; isLast?: boolean }) => (
    <LinearGradient
        colors={COLORS.secondaryGradient}
        style={[styles.statBox, isLast ? { padding: 13 } : { marginRight: 9 }]}
    >
        <View style={styles.centerMb4}>
            <Text style={styles.statValue}>{value}</Text>
        </View>
        <View style={styles.center}>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    </LinearGradient>
);

const AmenityChip = ({ label, isLast }: { label: string; isLast?: boolean }) => (
    <TouchableOpacity
        style={[styles.amenityChip, !isLast && { marginRight: 9 }]}
        onPress={() => alert(`Clicked ${label}`)}
    >
        <Text style={styles.amenityText}>{label}</Text>
    </TouchableOpacity>
);

const RoomCard = ({ item }: { item: IRoom }) => {
    const isRented = item.status === 'rented';
    return (
        <TouchableOpacity>
            <View style={styles.cardContainer}>
                <View style={styles.roomHeader}>
                    <View style={styles.roomTitleWrapper}>
                        <Text style={styles.roomTitle}>{item.roomName}</Text>
                    </View>
                    <TouchableOpacity
                        style={isRented ? styles.badgeWarning : styles.badgeSuccess}
                        onPress={() => alert('Status pressed')}
                    >
                        <Text style={isRented ? styles.badgeWarningText : styles.badgeSuccessText}>
                            {isRented ? "Đang thuê" : "Trống"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <LinearGradient colors={COLORS.grayGradient} style={styles.roomDetailsBox}>
                    <View style={styles.mb9}>
                        <Text style={styles.textGray}>Diện tích: {item.area}</Text>
                    </View>
                    <View style={styles.mb9}>
                        <Text style={styles.textGray}>Tầng: {item.floor}</Text>
                    </View>
                    <View>
                        <Text style={styles.priceText}>{item.rentalFee}</Text>
                    </View>
                </LinearGradient>

                {isRented ? (
                    <>
                        <View style={styles.tenantRow}>
                            <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ev7746c0_expires_30_days.png", }} resizeMode="stretch" style={styles.iconSmall} />
                            <Text style={styles.textBoldGray}>{ }</Text>
                        </View>
                        <View style={styles.invoiceRow}>
                            <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/cg6b2r7k_expires_30_days.png", }} resizeMode="stretch" style={styles.iconSmall} />
                            <Text style={styles.textBoldBlack}>Chưa có hóa đơn</Text>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity onPress={() => alert('Add Tenant')}>
                        <LinearGradient colors={COLORS.blueGradient} style={styles.addTenantBtn}>
                            <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/yfzfhesb_expires_30_days.png" }} resizeMode="stretch" style={styles.iconSmall} />
                            <Text style={styles.textWhiteBtn}>Thêm người thuê</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Component Tab Button
const TabButton = ({
    isActive,
    title,
    iconUri,
    onPress
}: {
    isActive: boolean;
    title: string;
    iconUri: string;
    onPress: () => void;
}) => {
    if (isActive) {
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
                <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.tabActive}
                >
                    <Image source={{ uri: iconUri }} resizeMode="stretch" style={styles.tabIconActive} />
                    <Text style={styles.tabTextActive}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
            <View style={styles.tabInactive}>
                <Image source={{ uri: iconUri }} resizeMode="stretch" style={styles.tabIconInactive} />
                <Text style={styles.tabTextInactive}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

// ============================================================================
// MAIN SCREEN
// ============================================================================

export const BoardingHouseDetailsScreen = () => {
    const [description, setDescription] = useState("");
    const [activeTab, setActiveTab] = useState<'roomList' | 'fixedFee'>('roomList');
    const [boardingHouse, setBoardingHouse] = useState<IHouse | null>(null);
    const navigation = useNavigation()

    const route = useRoute<DetailsRouteProps>();
    const { _id } = route.params;
    const { getHouseById } = getHouseApi

    useEffect(() => {
        const getBoardingHouse = async () => {
            const res = await getHouseById(_id) as ApiResponse<IHouse>
            if (res.status === "success") {
                setBoardingHouse(res.data as IHouse)
            }
        }
        getBoardingHouse()
    }, [_id, getHouseById])
    const handleGoBack = () => {
        navigation.goBack();
    }

    if (!boardingHouse) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.headerWrapper}>
                    {/* Header Gradient */}
                    <LinearGradient
                        colors={COLORS.primaryGradient}
                        style={styles.headerGradient}
                    >
                        <TouchableOpacity onPress={handleGoBack}>
                            <Image
                                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/dxvz9uow_expires_30_days.png" }}
                                resizeMode="stretch"
                                style={styles.headerIcon}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headerTitle}>Chi tiết cụm trọ</Text>
                        </View>
                        <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/jxi4r78b_expires_30_days.png" }} resizeMode="stretch" style={styles.headerIcon} />
                    </LinearGradient>

                    <View style={styles.contentContainer}>
                        {/* --- House Info Card --- */}
                        <View style={styles.mainCard}>
                            <View style={styles.mb28}>
                                <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/h3nkxcrm_expires_30_days.png" }} resizeMode="stretch" style={styles.mainImage} />
                                <View>
                                    <View style={styles.mb9}>
                                        <Text style={styles.houseName}>{boardingHouse?.houseName}</Text>
                                    </View>
                                    <View style={styles.rowCenter}>
                                        <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/cfins1et_expires_30_days.png", }} resizeMode="stretch" style={styles.iconTiny} />
                                        <Text style={styles.addressText}>{boardingHouse?.address}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.statsRow}>
                                <StatBox value="3" label="Tổng phòng" />
                                <StatBox value="2" label="Đang thuê" />
                                <StatBox value="1" label="Còn trống" isLast />
                            </View>

                            <View>
                                <Text style={styles.descriptionInput}>
                                    {boardingHouse?.description}
                                </Text>
                            </View>

                            <View style={styles.pb1}>
                                <View style={styles.mb12}>
                                    <Text style={styles.sectionTitle}>Tiện ích:</Text>
                                </View>
                                <View style={styles.pr20}>
                                    <View style={[styles.rowCenter, styles.mb9]}>
                                        <AmenityChip label="Wifi miễn phí" />
                                        <AmenityChip label="Máy giặt chung" />
                                        <AmenityChip label="Bảo vệ 24/7" isLast />
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.amenityChip, styles.amenityChipSelfStart]}
                                        onPress={() => alert('Pressed!')}
                                    >
                                        <Text style={styles.amenityText}>Camera an ninh</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* --- Tab Buttons --- */}
                        <View style={styles.tabContainer}>
                            <TabButton
                                isActive={activeTab === 'roomList'}
                                title="Danh sách phòng"
                                iconUri="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/sp5wt3ou_expires_30_days.png"
                                onPress={() => setActiveTab('roomList')}
                            />
                            <View style={{ width: 4 }} />
                            <TabButton
                                isActive={activeTab === 'fixedFee'}
                                title="Phí cố định"
                                iconUri="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/7r3tx5ka_expires_30_days.png"
                                onPress={() => setActiveTab('fixedFee')}
                            />
                        </View>

                        {/* --- Tab Content --- */}
                        {activeTab === 'roomList' ? (
                            <View>
                                <View style={styles.listHeader}>
                                    <View style={styles.listTitleWrapper}>
                                        <Text style={styles.listTitle}>Danh sách phòng</Text>
                                    </View>
                                    <View style={styles.rowCenter}>
                                        <TouchableOpacity style={{ flex: 1, marginRight: 9 }}>
                                            <LinearGradient
                                                colors={COLORS.orangeGradient}
                                                style={styles.actionBtnOrange}
                                            >
                                                <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/j3tfo06k_expires_30_days.png" }} resizeMode="stretch" style={styles.actionIconOrange} />
                                                <View style={styles.flex1} />
                                                <Text style={styles.actionTextOrange}>Tạo hóa đơn hàng loạt</Text>
                                                <View style={styles.flex1} />
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ flex: 1 }} onPress={() => alert('Add Room')}>
                                            <LinearGradient
                                                colors={COLORS.primaryGradient}
                                                style={styles.actionBtnGreen}
                                            >
                                                <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/vlg522hs_expires_30_days.png" }} resizeMode="stretch" style={styles.actionIconGreen} />
                                                <Text style={styles.actionTextGreen}>Thêm phòng</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {ROOMS_DATA.map((room) => (
                                    <RoomCard key={room._id} item={room} />
                                ))}
                            </View>
                        ) : (
                            /* --- PHÍ CỐ ĐỊNH TAB DESIGN --- */
                            <View>
                                {/* Header Title */}
                                <View style={styles.mb9}>
                                    <Text style={styles.listTitle}>Phí cố định</Text>
                                </View>

                                {/* Manage Badge */}
                                <TouchableOpacity style={styles.manageBadgeContainer}>
                                    <LinearGradient
                                        colors={COLORS.primaryGradient}
                                        style={styles.manageBadge}
                                    >
                                        {/* Icon Gear (dùng tạm icon có sẵn hoặc thay icon gear thật) */}
                                        <Image
                                            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/cfins1et_expires_30_days.png" }}
                                            style={[styles.iconTiny, { tintColor: COLORS.WHITE }]}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.manageBadgeText}>Quản lý</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Empty State Card */}
                                <View style={styles.emptyCard}>
                                    <Image
                                        source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/lightning_bolt_placeholder.png" }}
                                        // Lưu ý: Bạn cần thay URL trên bằng URL icon tia sét thật, hiện tại dùng placeholder
                                        style={styles.emptyIcon}
                                        resizeMode="contain"
                                    />
                                    {/* Dùng Text icon tia sét nếu chưa có ảnh: ⚡ */}
                                    {/* <Text style={{fontSize: 50, marginBottom: 16, opacity: 0.3}}>⚡</Text> */}

                                    <Text style={styles.emptyText}>Chưa có phí cố định nào</Text>

                                    <TouchableOpacity onPress={() => alert('Add Fee')}>
                                        <LinearGradient
                                            colors={COLORS.primaryGradient}
                                            style={styles.addFeeBtn}
                                        >
                                            <Text style={styles.addFeeBtnText}>Thêm phí cố định</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default BoardingHouseDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    flex1: {
        flex: 1,
    },
    center: {
        alignItems: "center",
    },
    centerMb4: {
        alignItems: "center",
        marginBottom: 4,
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    mb4: { marginBottom: 4 },
    mb9: { marginBottom: 9 },
    mb12: { marginBottom: 12 },
    mb28: { marginBottom: 28 },
    pb1: { paddingBottom: 1 },
    pr20: { paddingRight: 20 },

    // Header
    headerWrapper: {
        backgroundColor: COLORS.WHITE,
        paddingBottom: 97,
    },
    headerGradient: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 23,
        paddingTop: 50,
    },
    headerIcon: {
        width: 43,
        height: 43,
    },
    headerTitle: {
        color: COLORS.WHITE,
        fontSize: 20,
        fontWeight: "bold",
    },

    // Content
    contentContainer: {
        backgroundColor: COLORS.background,
        padding: 15,
        marginBottom: 97,
    },

    // Cards
    mainCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginBottom: 17,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    cardContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#00000000",
        paddingVertical: 17,
        paddingHorizontal: 18,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 8,
    },

    // Main Info
    mainImage: {
        width: 79,
        height: 79,
        marginBottom: 16,
    },
    houseName: {
        color: "#101727",
        fontSize: 24,
        fontWeight: "bold",
    },
    addressText: {
        color: "#495565",
        fontSize: 14,
    },
    iconTiny: {
        width: 15,
        height: 15,
        marginRight: 8,
    },

    // Stats
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 29,
    },
    statBox: {
        flex: 1,
        borderColor: "#A4F3CF",
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 13,
        paddingHorizontal: 14,
    },
    statValue: {
        color: "#009865",
        fontSize: 24,
        fontWeight: "bold",
    },
    statLabel: {
        color: "#495565",
        fontSize: 12,
        fontWeight: "bold",
    },

    // Inputs & Amenity
    descriptionInput: {
        color: "#354152",
        fontSize: 14,
        marginBottom: 17,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: "#101727",
        fontSize: 16,
        fontWeight: "bold",
    },
    amenityChip: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#ECFDF5",
        borderColor: "#A4F3CF",
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 6,
    },
    amenityChipSelfStart: {
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        flex: 0,
    },
    amenityText: {
        color: "#007955",
        fontSize: 12,
        fontWeight: "bold",
    },

    // Tabs
    tabContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 7,
        paddingHorizontal: 4,
        marginBottom: 17,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    tabActive: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    tabInactive: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 10,
    },
    tabIconActive: {
        borderRadius: 8,
        width: 16,
        height: 16,
        marginRight: 10,
    },
    tabIconInactive: {
        borderRadius: 8,
        width: 15,
        height: 15,
        marginRight: 7,
    },
    tabTextActive: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: "bold",
    },
    tabTextInactive: {
        color: "#495565",
        fontSize: 14,
        fontWeight: "bold",
    },

    // List Header
    listHeader: {
        marginBottom: 17,
    },
    listTitleWrapper: {
        alignSelf: "flex-start",
        marginBottom: 13,
    },
    listTitle: {
        color: "#101727",
        fontSize: 18,
        fontWeight: "bold",
    },
    actionBtnOrange: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 3,
        flex: 1
    },
    actionBtnGreen: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 12,
        flex: 1
    },
    actionIconOrange: {
        borderRadius: 16,
        width: 15,
        height: 15,
        marginLeft: 16,
    },
    actionTextOrange: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        width: 71,
    },
    actionIconGreen: {
        borderRadius: 16,
        width: 15,
        height: 15,
        marginRight: 8,
    },
    actionTextGreen: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: "bold",
    },

    // Room Card
    roomHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 13,
    },
    roomTitleWrapper: {
        paddingRight: 36,
    },
    roomTitle: {
        color: "#101727",
        fontSize: 18,
        fontWeight: "bold",
    },
    badgeWarning: {
        backgroundColor: "#FEF3C6",
        borderColor: "#FDE585",
        borderRadius: 999,
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    badgeWarningText: {
        color: "#BA4C00",
        fontSize: 12,
        fontWeight: "bold",
    },
    badgeSuccess: {
        backgroundColor: "#D0FAE5",
        borderColor: "#A4F3CF",
        borderRadius: 999,
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    badgeSuccessText: {
        color: "#007955",
        fontSize: 12,
        fontWeight: "bold",
    },
    roomDetailsBox: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 13,
    },
    textGray: {
        color: "#354152",
        fontSize: 14,
    },
    priceText: {
        color: "#009865",
        fontSize: 20,
        fontWeight: "bold",
    },
    tenantRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 7,
        marginBottom: 12,
    },
    invoiceRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 7,
    },
    iconSmall: {
        width: 15,
        height: 15,
        marginRight: 8,
    },
    textBoldGray: {
        color: "#354152",
        fontSize: 14,
        fontWeight: "bold",
    },
    textBoldBlack: {
        color: "#0A0A0A",
        fontSize: 14,
        fontWeight: "bold",
    },
    addTenantBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 8,
    },
    textWhiteBtn: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },

    // --- Fixed Fee Tab Styles ---
    manageBadgeContainer: {
        alignSelf: 'flex-start',
        marginBottom: 17,
    },
    manageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    manageBadgeText: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: "bold",
    },
    emptyCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1, // Bóng nhẹ hơn chút cho empty state
        shadowRadius: 10,
        elevation: 8,
    },
    emptyIcon: {
        width: 60,
        height: 60,
        marginBottom: 16,
        tintColor: '#CBD5E1', // Màu xám nhạt cho icon
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 24,
        textAlign: 'center',
    },
    addFeeBtn: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    addFeeBtnText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: 'bold',
    },
});