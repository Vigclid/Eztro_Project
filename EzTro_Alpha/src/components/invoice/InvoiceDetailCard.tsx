import React, { useState, useEffect } from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import { COLORS } from "../../constants/theme";
import { IRoomInvoice } from "../../types/invoice";
import { formatCurrencyVND } from "../../utils/currency";

interface InvoiceDetailCardProps {
    selectedRoomDetail: IRoomInvoice | null;
    setSelectedRoomDetail: (data: IRoomInvoice | null) => void;
    onUpdateRoom: (data: IRoomInvoice) => void;
}

const InvoiceDetailCard = ({ selectedRoomDetail, setSelectedRoomDetail, onUpdateRoom }: InvoiceDetailCardProps) => {
    // 1. Dùng local state để chỉnh sửa mà không ảnh hưởng data gốc
    const [data, setData] = useState<IRoomInvoice | null>(null);

    useEffect(() => {
        if (selectedRoomDetail) {
            setData({ ...selectedRoomDetail });
        }
    }, [selectedRoomDetail]);

    // 2. Logic tính toán lại khi có thay đổi
    const updateCalculations = (newData: IRoomInvoice) => {
        const eUsage = Math.max(0, newData.currentElectricityNumber - newData.previousElectricityNumber);
        const wUsage = Math.max(0, newData.currentWaterNumber - newData.previousWaterNumber);

        const eCost = eUsage * newData.electricityPrice;
        const wCost = wUsage * newData.waterPrice;
        const uCost = newData.utilities.reduce((sum, item) => sum + item.value, 0);

        const updated = {
            ...newData,
            electricityUsage: eUsage,
            waterUsage: wUsage,
            electricityCost: eCost,
            waterCost: wCost,
            utilitiesCost: uCost,
            totalAmount: newData.rentalFee + eCost + wCost + uCost
        };

        setData(updated);

        onUpdateRoom(updated);
    };

    const handleNumberChange = (key: keyof IRoomInvoice, val: string) => {
        if (!data) return;
        const num = parseFloat(val) || 0;
        updateCalculations({ ...data, [key]: num });
    };

    const handleUtilityChange = (index: number, val: string) => {
        if (!data) return;
        const newUtils = [...data.utilities];
        newUtils[index].value = parseFloat(val.replace(/[^0-9]/g, '')) || 0;
        updateCalculations({ ...data, utilities: newUtils });
    };

    if (!data) return null;

    return (
        <Modal
            visible={!!selectedRoomDetail}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSelectedRoomDetail(null)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderTitles}>
                            <Text style={styles.modalHeaderTitleMain}>Chi tiết hóa đơn</Text>
                            <Text style={styles.modalHeaderSubtitle}>{data.roomName} - {data.tenantName}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedRoomDetail(null)}>
                            <Text style={styles.modalCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
                        {/* Tiền phòng */}
                        <View style={styles.detailCard}>
                            <Text style={styles.detailCardTitle}>🏠 Tiền phòng</Text>
                            <Text style={styles.detailRentAmount}>{formatCurrencyVND(data.rentalFee)}</Text>
                        </View>

                        {/* Tiền điện */}
                        <View style={styles.detailCard}>
                            <Text style={styles.detailCardTitle}>⚡ Tiền điện</Text>
                            <View style={styles.meterInputContainer}>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số cũ</Text>
                                    <TextInput style={styles.meterInput} editable={false} value={data.previousElectricityNumber.toString()} />
                                </View>
                                <Text style={styles.meterArrow}>→</Text>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số mới</Text>
                                    <TextInput
                                        style={styles.meterInput}
                                        keyboardType="numeric"
                                        value={data.currentElectricityNumber.toString()}
                                        onChangeText={(v) => handleNumberChange('currentElectricityNumber', v)}
                                    />
                                </View>
                            </View>
                            <View style={styles.calculationBox}>
                                <Text style={styles.calcLabel}>Tiêu thụ: {data.electricityUsage} số</Text>
                                <Text style={styles.calcLabel}>Đơn giá: {formatCurrencyVND(data.electricityPrice)}/số</Text>
                                <Text style={styles.calcValueGreen}>Thành tiền: {formatCurrencyVND(data.electricityCost)}</Text>
                            </View>
                            <Text style={styles.imageBoxLabel}>📷 Ảnh đồng hồ điện</Text>
                            <TouchableOpacity style={styles.imageBox}>
                                {data.electricityImage ? (
                                    <Image source={{ uri: data.electricityImage }} style={styles.imageBoxImage} />
                                ) : (
                                    <>
                                        <Text style={styles.imageBoxIcon}>📷</Text>
                                        <Text style={styles.imageBoxText}>Chưa có ảnh đồng hồ điện</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Tiền nước */}
                        <View style={styles.detailCard}>
                            <Text style={styles.detailCardTitle}>💧 Tiền nước</Text>
                            <View style={styles.meterInputContainer}>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số cũ</Text>
                                    <TextInput style={styles.meterInput} editable={false} value={data.previousWaterNumber.toString()} />
                                </View>
                                <Text style={styles.meterArrow}>→</Text>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số mới</Text>
                                    <TextInput
                                        style={styles.meterInput}
                                        keyboardType="numeric"
                                        value={data.currentWaterNumber.toString()}
                                        onChangeText={(v) => handleNumberChange('currentWaterNumber', v)}
                                    />
                                </View>
                            </View>
                            <View style={styles.calculationBox}>
                                <Text style={styles.calcLabel}>Tiêu thụ: {data.waterUsage} số</Text>
                                <Text style={styles.calcLabel}>Đơn giá: {formatCurrencyVND(data.waterPrice)}/số</Text>
                                <Text style={styles.calcValueGreen}>Thành tiền: {formatCurrencyVND(data.waterCost)}</Text>
                            </View>

                            <Text style={styles.imageBoxLabel}>📷 Ảnh đồng hồ nước</Text>
                            <TouchableOpacity style={styles.imageBox}>
                                {data.waterImage ? (
                                    <Image source={{ uri: data.waterImage }} style={styles.imageBoxImage} />
                                ) : (
                                    <>
                                        <Text style={styles.imageBoxIcon}>📷</Text>
                                        <Text style={styles.imageBoxText}>Chưa có ảnh đồng hồ nước</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Phí khác */}
                        <View style={styles.detailCard}>
                            <Text style={styles.detailCardTitle}>💰 Phí khác</Text>
                            {data.utilities.map((util, index) => (
                                <View style={styles.otherFeeRow} key={index}>
                                    <Text style={styles.otherFeeLabel}>{util.key}</Text>
                                    <TextInput
                                        style={styles.otherFeeInput}
                                        keyboardType="numeric"
                                        value={formatCurrencyVND(util.value)}
                                        onChangeText={(v) => handleUtilityChange(index, v)}
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.modalTotalBox}>
                            <Text style={styles.modalTotalLabel}>Tổng cộng</Text>
                            <Text style={styles.modalTotalAmount}>{formatCurrencyVND(data.totalAmount)}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default InvoiceDetailCard;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#F8F9FA',
        height: '85%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    modalHeader: {
        backgroundColor: COLORS.GREEN_PRIMARY || '#00A152',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalHeaderTitles: {
        flex: 1,
    },
    modalHeaderTitleMain: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalHeaderSubtitle: {
        color: '#E8F5E9',
        fontSize: 14,
        marginTop: 4,
    },
    modalCloseButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalScroll: {
        flex: 1,
    },
    modalScrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    detailCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    detailCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    detailCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    detailRentAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.GREEN_PRIMARY || '#00A152',
        textAlign: 'center',
        marginVertical: 10,
    },
    meterInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    meterColumn: {
        flex: 1,
        alignItems: 'center',
    },
    meterLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    meterInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        width: '100%',
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#FFF',
    },
    meterArrow: {
        fontSize: 20,
        color: '#999',
        marginHorizontal: 12,
        marginTop: 20,
    },
    calculationBox: {
        borderWidth: 1,
        borderColor: '#C8E6C9',
        backgroundColor: '#F1F8E9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    calcRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    calcLabel: {
        fontSize: 13,
        color: '#555',
    },
    calcLabelBold: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    calcValueOrange: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E65100',
    },
    calcValueBlue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1565C0',
    },
    calcValueGreen: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.GREEN_PRIMARY || '#00A152',
    },
    calcDivider: {
        height: 1,
        backgroundColor: '#C8E6C9',
        marginVertical: 8,
    },
    imageBoxLabel: {
        fontSize: 13,
        color: '#555',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    imageBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#B0BEC5',
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    imageBoxIcon: {
        fontSize: 24,
        marginBottom: 8,
        opacity: 0.6,
    },
    imageBoxText: {
        fontSize: 13,
        color: '#78909C',
    },
    otherFeeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    otherFeeLabel: {
        fontSize: 14,
        color: '#555',
    },
    otherFeeInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        width: '40%',
        textAlign: 'right',
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#FFF',
    },
    modalTotalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
        borderColor: '#C8E6C9',
        borderRadius: 12,
        padding: 20,
        marginTop: 8,
    },
    modalTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modalTotalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.GREEN_PRIMARY || '#00A152',
    },
    imageBoxImage: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
    }
});