import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
    Settings,
    Zap,
    Edit2,
    Trash2,
    DollarSign,
    Plus
} from "lucide-react-native";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { COLORS } from "../../constants/theme";
import { appNavigator } from "../../navigation/navigationActions";
import { IUtilitesCharge } from "../../types/house";
import { patchHouseApi } from "../../api/house/house";
import { ApiResponse } from "../../types/app.common";

interface FixedFeeTabProps {
    houseId: string | undefined;
    utilites?: IUtilitesCharge[];
    onRefresh: () => void
}

const FixedFeeTab = ({ houseId, utilites, onRefresh }: FixedFeeTabProps) => {

    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN') + " đ";
    };

    const handleDelete = (utility: IUtilitesCharge) => {
        Alert.alert("Xác nhận", `Bạn có chắc muốn xóa phí ${utility.key}?`, [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", style: "destructive", onPress: () => deleteUtility(utility) },
        ]);
    };

    const deleteUtility = async (utility: IUtilitesCharge) => {
        const { updateUtility } = patchHouseApi
        try {
            const payload = {
                action: "remove",
                key: utility.key
            }
            const res = await updateUtility(houseId, payload) as ApiResponse<any>
            if (res.status === "success") {
                Alert.alert("Thành Công", "Xóa phí cố định thành công")
                onRefresh()
            }
        } catch (err) { }
    }

    return (
        <View>
            {/* Tiêu đề ngoài card */}
            <View style={styles.mb9}>
                <Text style={styles.listTitle}>Phí cố định</Text>
            </View>

            {/* Toàn bộ nội dung nằm trong Card trắng này */}
            <View style={styles.mainContainerCard}>

                {utilites && utilites.length > 0 ? (
                    <View>
                        {/* Header của Card khi có dữ liệu */}
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardSubtitle}>Danh sách phí thu</Text>
                            <TouchableOpacity
                                style={styles.miniAddBtn}
                                onPress={() => appNavigator.goToCreateFixedFeeServiceScreen(houseId, "create")}
                            >
                                <Plus size={16} color={COLORS.PRIMARY} />
                                <Text style={styles.miniAddBtnText}>Thêm</Text>
                            </TouchableOpacity>
                        </View>

                        {/* List danh sách các dòng phí */}
                        {utilites.map((item, index) => (
                            <View key={index} style={[
                                styles.feeItemRow,
                                index === utilites.length - 1 && { borderBottomWidth: 0 }
                            ]}>
                                <View style={styles.feeInfoContainer}>
                                    <View style={styles.feeIconCircle}>
                                        <DollarSign size={16} color="#00A96B" />
                                    </View>
                                    <View>
                                        <Text style={styles.feeName}>{item.key}</Text>
                                        <Text style={styles.feePrice}>{formatCurrency(item.value)}</Text>
                                    </View>
                                </View>

                                <View style={styles.actionGroup}>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => appNavigator.goToCreateFixedFeeServiceScreen(houseId, "edit", item)}
                                    >
                                        <Edit2 size={16} color="#64748B" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, { marginLeft: 4 }]}
                                        onPress={() => handleDelete(item)}
                                    >
                                        <Trash2 size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContent}>
                        <View style={styles.emptyIconCircle}>
                            <Zap color={`#d1d5dc`} size={60} />
                        </View>
                        <Text style={styles.emptyTitle}>Chưa có phí cố định nào</Text>
                        <Text style={styles.emptySub}>Thiết lập các khoản phí thu hàng tháng</Text>

                        <TouchableOpacity
                            onPress={() => appNavigator.goToCreateFixedFeeServiceScreen(houseId, "create")}
                        >
                            <LinearGradient
                                colors={COLORS.primaryGradient}
                                style={styles.addFeeBtn}
                            >
                                <Text style={styles.addFeeBtnText}>Thêm phí cố định</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mb9: { marginBottom: 9 },
    listTitle: {
        color: "#101727",
        fontSize: 18,
        fontWeight: "bold",
    },
    // Ô Card trắng ban đầu của bạn
    mainContainerCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        minHeight: 200, // Đảm bảo độ cao tối thiểu khi trống
    },
    // Header bên trong card
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    miniAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    miniAddBtnText: {
        color: '#00A96B',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    // Từng dòng phí
    feeItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    feeInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    feeIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    feeName: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
    feePrice: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '700',
    },
    actionGroup: {
        flexDirection: 'row',
    },
    actionBtn: {
        padding: 8,
        borderRadius: 8,
    },
    // Style cho trạng thái trống (Empty)
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyIconCircle: {
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    emptySub: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 20,
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

export default FixedFeeTab;