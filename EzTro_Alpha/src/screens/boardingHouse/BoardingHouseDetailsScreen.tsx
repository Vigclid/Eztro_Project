import React, { useCallback, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/theme";
import { IRoom } from "../../types/room";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/navigation.type";
import { IHouse } from "../../types/house";
import { getHouseApi } from "../../api/house/house";
import { getRoomApi } from "../../api/room/room";
import { ApiResponse } from "../../types/app.common";
import {
    ArrowLeft,
    Pen,
    Building2,
    Zap,
    House,
    DollarSign,
    MapPin,
    Plus,
    Receipt,
    Settings,
    type LucideIcon,
} from "lucide-react-native";

type DetailsRouteProps = RouteProp<MainStackParamList, 'boardingHouseDetailsScreen'>;


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

const RoomCard = ({
    item,
    onPressTenant,
    onPressRoom,
}: {
    item: IRoom;
    onPressTenant: () => void;
    onPressRoom: () => void;
}) => {
    const isRented = item.status === 'rented' || item.status === 'Đang Thuê';

    const formatCurrency = (value: number | string) => {
        if (!value) return '0 đ';
        return Number(value).toLocaleString('vi-VN') + ' đ';
    };
    const formatDate = (date?: Date | string) => {
        if (!date) return "--/--/----";
        return new Date(date).toLocaleDateString('vi-VN');
    };

    return (
        <TouchableOpacity onPress={onPressRoom}>
            <View style={styles.cardContainer}>
                <View style={styles.roomHeader}>
                    <View style={styles.roomTitleWrapper}>
                        <Text style={styles.roomTitle}>{item.roomName}</Text>
                    </View>
                    <View style={isRented ? styles.badgeWarning : styles.badgeSuccess}>
                        <Text style={isRented ? styles.badgeWarningText : styles.badgeSuccessText}>
                            {isRented ? "Đang thuê" : "Trống"}
                        </Text>
                    </View>
                </View>

                {/* --- PHẦN BẠN MUỐN SỬA --- */}
                <LinearGradient colors={COLORS.grayGradient} style={styles.roomDetailsBox}>

                    {/* Dòng 1: Ngày tạo */}
                    <View style={[styles.rowCenter, styles.mb9, { justifyContent: 'space-between' }]}>
                        <Text style={styles.textGray}>Ngày tạo:</Text>
                        <Text style={[styles.textBoldBlack, { fontSize: 14 }]}>
                            {/* Thay item.createdAt bằng trường ngày thực tế từ API của bạn */}
                            {formatDate(item.rentDate)}
                        </Text>
                    </View>

                    {/* Dòng 3: Giá */}
                    <View style={[styles.rowCenter, { justifyContent: 'space-between' }]}>
                        <Text style={styles.textGray}>Giá thuê:</Text>
                        <Text style={styles.priceText}>
                            {/* Thêm ?? 0 vào đây */}
                            {formatCurrency(item.rentalFee ?? 0)}
                        </Text>
                    </View>

                </LinearGradient>
                {/* ------------------------- */}

                {/* Footer (Người thuê / Button thêm) - Giữ nguyên logic cũ */}
                {/* Danh sách người thuê (nếu có) */}
                {item.virtualTenants && item.virtualTenants.length > 0 && (
                    <View style={styles.tenantList}>
                        {item.virtualTenants.map((t, index) => (
                            <View key={`${t.tenantName}-${index}`} style={styles.tenantRow}>
                                <Image
                                    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ev7746c0_expires_30_days.png" }}
                                    resizeMode="stretch"
                                    style={styles.iconSmall}
                                />
                                <View>
                                    <Text style={styles.textBoldGray}>{t.tenantName}</Text>
                                    <Text style={styles.textGraySmall}>{t.phoneNumber}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Nút thêm người thuê */}
                <TouchableOpacity onPress={onPressTenant}>
                    <LinearGradient colors={COLORS.blueGradient} style={styles.addTenantBtn}>
                        <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/yfzfhesb_expires_30_days.png" }} resizeMode="stretch" style={styles.iconSmall} />
                        <Text style={styles.textWhiteBtn}>Thêm người thuê</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

interface TabButtonProps {
    isActive: boolean;
    title: string;
    iconUri: LucideIcon;
    onPress: () => void;
}

const TabButton = ({
    isActive,
    title,
    iconUri: Icon,
    onPress
}: TabButtonProps) => {
    if (isActive) {
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
                <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.tabActive}
                >
                    <View style={styles.tabIconActive}>
                        <Icon size={16} color={COLORS.white} />
                    </View>
                    <Text style={styles.tabTextActive}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
            <View style={styles.tabInactive}>
                <View style={styles.tabIconInactive}>
                    <Icon size={16} color={`#485565`} />
                </View>
                <Text style={styles.tabTextInactive}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

// ============================================================================
// MAIN SCREEN
// ============================================================================

export const BoardingHouseDetailsScreen = () => {
    const [activeTab, setActiveTab] = useState<'roomList' | 'fixedFee'>('roomList');
    const [boardingHouse, setBoardingHouse] = useState<IHouse | null>(null);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const navigation = useNavigation()

    const route = useRoute<DetailsRouteProps>();
    const { _id } = route.params;
    const { getHouseById } = getHouseApi
    const { getAllRoomsByHouseId } = getRoomApi;

    const fetchData = useCallback(async () => {
        // Lấy thông tin cụm trọ
        const resHouse = await getHouseById(_id) as ApiResponse<IHouse>;
        if (resHouse.status === "success") {
            setBoardingHouse(resHouse.data as IHouse);
        }

        // Lấy danh sách phòng theo houseId
        const resRooms = await getAllRoomsByHouseId(_id) as ApiResponse<IRoom[]>;
        if (resRooms.status === "success" && Array.isArray(resRooms.data)) {
            const mappedRooms: IRoom[] = (resRooms.data as any[]).map((room: any) => ({
                _id: room._id,
                houseId: room.houseId,
                area: undefined,
                floor: undefined,
                roomName: room.roomName,
                rentalFee: room.rentalFee,
                status: room.status,
                rentDate: room.rentalDate ? new Date(room.rentalDate) : undefined,
                virtualTenants: room.virtualTenants || [],
            }));
            setRooms(mappedRooms);
        }
    }, [_id, getHouseById, getAllRoomsByHouseId]);

    // Refetch dữ liệu mỗi khi màn hình được focus (khi quay lại từ CreateNewRoomScreen/AddTenantScreen)
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );
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
                            <View style={styles.headerIcon}>
                                <ArrowLeft
                                    color={COLORS.WHITE}
                                />
                            </View>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headerTitle}>Chi tiết cụm trọ</Text>
                        </View>
                        <View style={styles.headerIcon}>
                            <Pen
                                color={COLORS.WHITE}
                            />
                        </View>
                    </LinearGradient>

                    <View style={styles.contentContainer}>
                        {/* --- House Info Card --- */}
                        <View style={styles.mainCard}>
                            <View style={styles.mb28}>
                                <View style={styles.mainImage}>
                                    <Building2
                                        color={COLORS.WHITE}
                                        size={50}
                                    />
                                </View>
                                <View>
                                    <View style={styles.mb9}>
                                        <Text style={styles.houseName}>{boardingHouse?.houseName}</Text>
                                    </View>
                                    <View style={styles.rowCenter}>
                                        <View style={styles.iconTiny}>
                                            <MapPin
                                                size={15}
                                                color={`#00c282`}
                                            />
                                        </View>
                                        <Text style={styles.addressText}>{boardingHouse?.address}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.statsRow}>
                                <StatBox value={rooms.length.toString()} label="Tổng phòng" />
                                <StatBox
                                    value={rooms.filter((r) =>
                                        r.status === "Đang Thuê" || r.status === "rented"
                                    ).length.toString()}
                                    label="Đang thuê"
                                />
                                <StatBox
                                    value={(
                                        rooms.length -
                                        rooms.filter((r) =>
                                            r.status === "Đang Thuê" || r.status === "rented"
                                        ).length
                                    ).toString()}
                                    label="Còn trống"
                                    isLast
                                />
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
                                iconUri={House}
                                onPress={() => setActiveTab('roomList')}
                            />
                            <View style={{ width: 4 }} />
                            <TabButton
                                isActive={activeTab === 'fixedFee'}
                                title="Phí cố định"
                                iconUri={DollarSign}
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
                                                <View style={styles.actionIconOrange} >
                                                    <Receipt
                                                        size={15}
                                                        color={COLORS.WHITE}
                                                    />
                                                </View>
                                                <View style={styles.flex1} />
                                                <Text style={styles.actionTextOrange}>Tạo hóa đơn hàng loạt</Text>
                                                <View style={styles.flex1} />
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() =>
                                                // Điều hướng sang màn thêm phòng, chỉ truyền houseId
                                                navigation.navigate(
                                                    // @ts-ignore do dùng chung stack
                                                    "createNewRoomScreen" as never,
                                                    {
                                                        houseId: _id,
                                                    } as never,
                                                )
                                            }
                                        >
                                            <LinearGradient
                                                colors={COLORS.primaryGradient}
                                                style={styles.actionBtnGreen}
                                            >
                                                <View style={styles.actionIconGreen}>
                                                    <Plus
                                                        size={15}
                                                        color={COLORS.WHITE}
                                                    />
                                                </View>
                                                <Text style={styles.actionTextGreen}>Thêm phòng</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {rooms.map((room) => (
                                    <RoomCard
                                        key={room._id}
                                        item={room}
                                        onPressRoom={() =>
                                            navigation.navigate(
                                                // @ts-ignore
                                                "createNewRoomScreen" as never,
                                                {
                                                    houseId: _id,
                                                    room,
                                                } as never,
                                            )
                                        }
                                        onPressTenant={() =>
                                            navigation.navigate(
                                                // @ts-ignore
                                                "addTenantScreen" as never,
                                                {
                                                    roomId: room._id!,
                                                    room,
                                                } as never,
                                            )
                                        }
                                    />
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
                                        <View style={[styles.iconTiny]}>
                                            <Settings
                                                size={15}
                                                color={COLORS.WHITE}
                                            />
                                        </View>
                                        <Text style={styles.manageBadgeText}>Quản lý</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Empty State Card */}
                                <View style={styles.emptyCard}>
                                    <View style={styles.emptyIcon}>
                                        <Zap
                                            color={`#d1d5dc`}
                                            size={100}
                                        />
                                    </View>
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
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "#FFFFFF50",
        borderRadius: 10,
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
        backgroundColor: "#00cb99",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
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
        alignItems: "center",
        justifyContent: "center",
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
        backgroundColor: "#f4f5f7",
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
        width: 70,
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
    tenantList: {
        marginTop: 8,
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
    textGraySmall: {
        color: "#697282",
        fontSize: 12,
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
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