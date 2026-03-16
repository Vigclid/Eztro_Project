import React, { useCallback, useEffect, useState } from "react";
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
import { appNavigator } from "../../navigation/navigationActions";

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
    item: IRoom & { accountTenants?: any[] };
    onPressTenant: () => void;
    onPressRoom: () => void;
}) => {
    const isRented = item.status === 'rented' || item.status === 'Đang Thuê';
    const hasAccountTenants = !!item.accountTenants?.length;
    const hasVirtualTenants = !!item.virtualTenants?.length;
    const totalTenants = (item.accountTenants?.length || 0) + (item.virtualTenants?.length || 0);

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

                {totalTenants > 0 && (
                    <View style={styles.tenantSummaryRow}>
                        <Text style={styles.tenantSummaryText}>Người thuê hiện tại</Text>
                        <View style={styles.tenantCountBadge}>
                            <Text style={styles.tenantCountBadgeText}>{totalTenants}</Text>
                        </View>
                    </View>
                )}

                {/* Danh sách người thuê có tài khoản */}
                {hasAccountTenants && (
                    <View style={styles.tenantList}>
                        <View style={styles.tenantGroupHeader}>
                            <Text style={styles.tenantGroupTitle}>Tài khoản hệ thống</Text>
                        </View>
                        {item.accountTenants?.map((member, index) => {
                            const fullName = `${member?.userId?.lastName || ""} ${member?.userId?.firstName || ""}`.trim();
                            return (
                                <View key={`${member?._id || index}`} style={styles.tenantRow}>
                                    <Image
                                        source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ev7746c0_expires_30_days.png" }}
                                        resizeMode="stretch"
                                        style={styles.iconSmall}
                                    />
                                    <View style={styles.tenantInfoWrap}>
                                        <Text style={styles.textBoldGray}>
                                            {fullName || member?.userId?.email || "Không rõ tên"}
                                        </Text>
                                        <Text style={styles.textGraySmall}>
                                            {member?.userId?.phoneNumber || member?.userId?.email || "Không có liên hệ"}
                                        </Text>
                                    </View>
                                    <View style={styles.accountTypeBadge}>
                                        <Text style={styles.accountTypeBadgeText}>
                                            {member?.role === "TENANT" ? "Chính" : "Phụ"}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Danh sách người thuê không có tài khoản (virtual tenant) */}
                {hasVirtualTenants && (
                    <View style={styles.tenantList}>
                        <View style={styles.tenantGroupHeader}>
                            <Text style={styles.tenantGroupTitle}>Người thuê thủ công</Text>
                        </View>
                        {item.virtualTenants?.map((t, index) => (
                            <View key={`${t.tenantName}-${index}`} style={styles.tenantRow}>
                                <Image
                                    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ev7746c0_expires_30_days.png" }}
                                    resizeMode="stretch"
                                    style={styles.iconSmall}
                                />
                                <View style={styles.tenantInfoWrap}>
                                    <Text style={styles.textBoldGray}>{t.tenantName}</Text>
                                    <Text style={styles.textGraySmall}>{t.phoneNumber}</Text>
                                </View>
                                <View style={styles.virtualTypeBadge}>
                                    <Text style={styles.virtualTypeBadgeText}>Virtual</Text>
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
    const [rooms, setRooms] = useState<(IRoom & { accountTenants?: any[] })[]>([]);
    const navigation = useNavigation()

    const route = useRoute<DetailsRouteProps>();
    const { _id } = route.params;
    const { getHouseById } = getHouseApi
    const { getAllRoomsByHouseId } = getRoomApi;

    const formatCurrency = (value?: number) => {
        if (!value) return "0 đ";
        return Number(value).toLocaleString("vi-VN") + " đ";
    };

    const formatDate = (value?: string | Date) => {
        if (!value) return "--/--/----";
        return new Date(value).toLocaleDateString("vi-VN");
    };

    const fetchData = useCallback(async () => {
        // Lấy thông tin cụm trọ
        const resHouse = await getHouseById(_id) as ApiResponse<IHouse>;
        if (resHouse.status === "success") {
            setBoardingHouse(resHouse.data as IHouse);
        }

        // Lấy danh sách phòng theo houseId
        const resRooms = await getAllRoomsByHouseId(_id) as ApiResponse<IRoom[]>;
        if (resRooms.status === "success" && Array.isArray(resRooms.data)) {
            const mappedRooms = await Promise.all((resRooms.data as any[]).map(async (room: any) => {
                let accountTenants: any[] = [];
                try {
                    const rawMembers = await getRoomApi.getRoomMembers(room._id);
                    const membersRes = rawMembers as ApiResponse<any[]>;
                    if (membersRes.status === "success" && Array.isArray(membersRes.data)) {
                        accountTenants = membersRes.data;
                    }
                } catch {
                    accountTenants = [];
                }

                return {
                    _id: room._id,
                    houseId: room.houseId,
                    area: undefined,
                    floor: undefined,
                    roomName: room.roomName,
                    rentalFee: room.rentalFee,
                    status: room.status,
                    rentDate: room.rentalDate ? new Date(room.rentalDate) : undefined,
                    virtualTenants: room.virtualTenants || [],
                    accountTenants,
                };
            }));
            setRooms(mappedRooms);
        }
    }, [_id, getHouseById, getAllRoomsByHouseId]);

    // Lần đầu vào màn hình cũng load dữ liệu
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefreshRooms = useCallback(() => {
        fetchData();
    }, [fetchData]);

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

    const currentPackage = boardingHouse?.housePackage?.package;
    const packageExpiration = boardingHouse?.housePackage?.expirationDate;
    const maxRoomByPackage = currentPackage?.maxRoom || 0;
    const usedRoom = rooms.length;
    const usagePercent =
        maxRoomByPackage > 0
            ? Math.min(100, Math.round((usedRoom / maxRoomByPackage) * 100))
            : 0;

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
                        <TouchableOpacity
                            onPress={() => appNavigator.goToCreateBoardingHousePage(boardingHouse)}
                            style={styles.headerIcon}>
                            <Pen
                                color={COLORS.WHITE}
                            />
                        </TouchableOpacity>
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

                            <View style={styles.packageCard}>
                                <View style={styles.packageHeaderRow}>
                                    <View style={styles.rowCenter}>
                                        <View style={styles.packageIconWrap}>
                                            <Zap color="#FFFFFF" size={16} />
                                        </View>
                                        <View>
                                            <Text style={styles.packageTitle}>Gói quản lý đang dùng</Text>
                                            <Text style={styles.packageName}>
                                                {currentPackage?.packageName || "Chưa có gói"}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={
                                            boardingHouse?.housePackage?.isExpired ||
                                                !currentPackage
                                                ? styles.packageExpiredBadge
                                                : styles.packageActiveBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                boardingHouse?.housePackage?.isExpired ||
                                                    !currentPackage
                                                    ? styles.packageExpiredText
                                                    : styles.packageActiveText
                                            }
                                        >
                                            {boardingHouse?.housePackage?.isExpired || !currentPackage ? "Hết hạn" : "Đang hiệu lực"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.packageMetaGrid}>
                                    <View style={styles.packageMetaItem}>
                                        <Text style={styles.packageMetaLabel}>Giới hạn phòng</Text>
                                        <Text style={styles.packageMetaValue}>
                                            {maxRoomByPackage > 0 ? `${maxRoomByPackage} phòng` : "--"}
                                        </Text>
                                    </View>
                                    <View style={styles.packageMetaItem}>
                                        <Text style={styles.packageMetaLabel}>Đơn giá gói</Text>
                                        <Text style={styles.packageMetaValue}>
                                            {currentPackage ? formatCurrency(currentPackage.price) : "--"}
                                        </Text>
                                    </View>
                                    <View style={styles.packageMetaItem}>
                                        <Text style={styles.packageMetaLabel}>Thời hạn gói</Text>
                                        <Text style={styles.packageMetaValue}>
                                            {currentPackage?.duration ? `${currentPackage.duration} tháng` : "--"}
                                        </Text>
                                    </View>
                                    <View style={styles.packageMetaItem}>
                                        <Text style={styles.packageMetaLabel}>Hạn sử dụng</Text>
                                        <Text style={styles.packageMetaValue}>{formatDate(packageExpiration as any)}</Text>
                                    </View>
                                </View>

                                {maxRoomByPackage > 0 && (
                                    <View style={styles.packageProgressWrap}>
                                        <View style={styles.packageProgressLabelRow}>
                                            <Text style={styles.packageProgressLabel}>Mức sử dụng phòng</Text>
                                            <Text style={styles.packageProgressValue}>
                                                {usedRoom}/{maxRoomByPackage} ({usagePercent}%)
                                            </Text>
                                        </View>
                                        <View style={styles.packageProgressTrack}>
                                            <View
                                                style={[
                                                    styles.packageProgressBar,
                                                    { width: `${usagePercent}%` },
                                                    usagePercent >= 90
                                                        ? styles.packageProgressBarWarning
                                                        : null,
                                                ]}
                                            />
                                        </View>
                                    </View>
                                )}
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
                                                <TouchableOpacity>
                                                    <Text style={styles.actionTextOrange}>
                                                        Tạo hóa đơn hàng loạt
                                                    </Text>
                                                </TouchableOpacity>
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
                                                        onRefresh: handleRefreshRooms,
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
                                                    onRefresh: handleRefreshRooms,
                                                } as never,
                                            )
                                        }
                                        onPressTenant={() =>
                                            navigation.navigate(
                                                // @ts-ignore
                                                "addTenantScreen" as never,
                                                {
                                                    roomId: room._id!,
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
    packageCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5EAF1",
        padding: 14,
        marginBottom: 16,
    },
    packageHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    packageIconWrap: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00A96B",
        marginRight: 10,
    },
    packageTitle: {
        color: "#64748B",
        fontSize: 12,
        fontWeight: "600",
    },
    packageName: {
        color: "#0F172A",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 2,
    },
    packageActiveBadge: {
        backgroundColor: "#DCFCE7",
        borderColor: "#86EFAC",
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    packageActiveText: {
        color: "#15803D",
        fontSize: 11,
        fontWeight: "700",
    },
    packageExpiredBadge: {
        backgroundColor: "#FEE2E2",
        borderColor: "#FCA5A5",
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    packageExpiredText: {
        color: "#B91C1C",
        fontSize: 11,
        fontWeight: "700",
    },
    packageMetaGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    packageMetaItem: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#EAECEF",
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 8,
    },
    packageMetaLabel: {
        color: "#64748B",
        fontSize: 11,
        marginBottom: 3,
    },
    packageMetaValue: {
        color: "#111827",
        fontSize: 13,
        fontWeight: "700",
    },
    packageProgressWrap: {
        marginTop: 2,
    },
    packageProgressLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    packageProgressLabel: {
        color: "#64748B",
        fontSize: 12,
    },
    packageProgressValue: {
        color: "#0F172A",
        fontSize: 12,
        fontWeight: "700",
    },
    packageProgressTrack: {
        height: 8,
        borderRadius: 999,
        backgroundColor: "#E2E8F0",
        overflow: "hidden",
    },
    packageProgressBar: {
        height: "100%",
        borderRadius: 999,
        backgroundColor: "#00A96B",
    },
    packageProgressBarWarning: {
        backgroundColor: "#EA580C",
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
        paddingVertical: 9,
        paddingHorizontal: 10,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E7ECF3",
    },
    tenantList: {
        marginTop: 8,
    },
    tenantSummaryRow: {
        marginTop: 4,
        marginBottom: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    tenantSummaryText: {
        color: "#354152",
        fontSize: 13,
        fontWeight: "600",
    },
    tenantCountBadge: {
        minWidth: 26,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E8FDF2",
        borderWidth: 1,
        borderColor: "#A4F3CF",
    },
    tenantCountBadgeText: {
        color: "#007955",
        fontSize: 12,
        fontWeight: "bold",
    },
    tenantGroupHeader: {
        marginBottom: 7,
    },
    tenantGroupTitle: {
        color: "#667085",
        fontSize: 12,
        fontWeight: "600",
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
    tenantInfoWrap: {
        flex: 1,
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
    accountTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#EEF4FF",
        borderWidth: 1,
        borderColor: "#C9DBFF",
    },
    accountTypeBadgeText: {
        color: "#2D5BDA",
        fontSize: 11,
        fontWeight: "700",
    },
    virtualTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    virtualTypeBadgeText: {
        color: "#6B7280",
        fontSize: 11,
        fontWeight: "700",
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