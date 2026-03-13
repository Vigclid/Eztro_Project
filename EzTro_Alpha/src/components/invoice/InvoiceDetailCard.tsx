import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import {
    COLORS,
} from "../../constants/theme";
interface InvoiceDetailCardProps {
    selectedRoomDetail: any
    setSelectedRoomDetail: (data: any) => void
}

const InvoiceDetailCard = ({ selectedRoomDetail, setSelectedRoomDetail }: InvoiceDetailCardProps) => {
    return (
        <Modal
            visible={!!selectedRoomDetail}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSelectedRoomDetail(null)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderTitles}>
                            <Text style={styles.modalHeaderTitleMain}>Chi tiết hóa đơn</Text>
                            <Text style={styles.modalHeaderSubtitle}>
                                {selectedRoomDetail?.name} - {selectedRoomDetail?.tenantName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setSelectedRoomDetail(null)}
                        >
                            <Text style={styles.modalCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modal Scroll Content */}
                    <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>

                        {/* Tiền phòng */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailCardHeader}>
                                <Text style={styles.detailIcon}>🏠</Text>
                                <Text style={styles.detailCardTitle}>Tiền phòng</Text>
                            </View>
                            <Text style={styles.detailRentAmount}>3.000.000đ</Text>
                        </View>

                        {/* Tiền điện */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailCardHeader}>
                                <Text style={styles.detailIcon}>⚡</Text>
                                <Text style={styles.detailCardTitle}>Tiền điện</Text>
                            </View>

                            <View style={styles.meterInputContainer}>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số cũ</Text>
                                    <TextInput style={styles.meterInput} />
                                </View>
                                <Text style={styles.meterArrow}>→</Text>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số mới</Text>
                                    <TextInput style={styles.meterInput} />
                                </View>
                            </View>

                            <View style={styles.calculationBox}>
                                <View style={styles.calcRow}>
                                    <Text style={styles.calcLabel}>Tiêu thụ:</Text>
                                    <Text style={styles.calcValueOrange}>63 số</Text>
                                </View>
                                <View style={styles.calcRow}>
                                    <Text style={styles.calcLabel}>Đơn giá: 3.500đ/số</Text>
                                </View>
                                <View style={styles.calcDivider} />
                                <View style={styles.calcRow}>
                                    <Text style={styles.calcLabelBold}>Thành tiền:</Text>
                                    <Text style={styles.calcValueGreen}>220.500đ</Text>
                                </View>
                            </View>

                            <Text style={styles.imageBoxLabel}>📷 Ảnh đồng hồ điện</Text>
                            <TouchableOpacity style={styles.imageBox}>
                                <Text style={styles.imageBoxIcon}>📷</Text>
                                <Text style={styles.imageBoxText}>Tải ảnh đồng hồ điện</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tiền nước */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailCardHeader}>
                                <Text style={styles.detailIcon}>💧</Text>
                                <Text style={styles.detailCardTitle}>Tiền nước</Text>
                            </View>

                            <View style={styles.meterInputContainer}>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số cũ</Text>
                                    <TextInput style={styles.meterInput} />
                                </View>
                                <Text style={styles.meterArrow}>→</Text>
                                <View style={styles.meterColumn}>
                                    <Text style={styles.meterLabel}>Số mới</Text>
                                    <TextInput style={styles.meterInput} />
                                </View>
                            </View>

                            <View style={styles.calculationBox}>
                                <View style={styles.calcRow}>
                                    <Text style={styles.calcLabel}>Tiêu thụ:</Text>
                                    <Text style={styles.calcValueBlue}>12 số</Text>
                                </View>
                                <View style={styles.calcRow}>
                                    <Text style={styles.calcLabel}>Đơn giá: 25.000đ/số</Text>
                                </View>
                                <View style={styles.calcDivider} />
                                <View style={styles.calcRow}>
                                    <Text style={styles.calcLabelBold}>Thành tiền:</Text>
                                    <Text style={styles.calcValueGreen}>300.000đ</Text>
                                </View>
                            </View>

                            <Text style={styles.imageBoxLabel}>📷 Ảnh đồng hồ nước</Text>
                            <TouchableOpacity style={styles.imageBox}>
                                <Text style={styles.imageBoxIcon}>📷</Text>
                                <Text style={styles.imageBoxText}>Tải ảnh đồng hồ nước</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Phí khác */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailCardHeader}>
                                <Text style={styles.detailIcon}>💰</Text>
                                <Text style={styles.detailCardTitle}>Phí khác</Text>
                            </View>

                            <View style={styles.otherFeeRow}>
                                <Text style={styles.otherFeeLabel}>📶 Internet</Text>
                                <TextInput style={styles.otherFeeInput} />
                            </View>
                            <View style={styles.otherFeeRow}>
                                <Text style={styles.otherFeeLabel}>🗑️ Rác</Text>
                                <TextInput style={styles.otherFeeInput} />
                            </View>
                            <View style={styles.otherFeeRow}>
                                <Text style={styles.otherFeeLabel}>🅿️ Gửi xe</Text>
                                <TextInput style={styles.otherFeeInput} />
                            </View>
                        </View>

                        {/* Tổng cộng Modal */}
                        <View style={styles.modalTotalBox}>
                            <Text style={styles.modalTotalLabel}>Tổng cộng</Text>
                            <Text style={styles.modalTotalAmount}>3.770.500đ</Text>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export default InvoiceDetailCard

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
        padding: 24,
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
});