import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Square } from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { appNavigator } from "../../navigation/navigationActions";
import { useRoute } from "@react-navigation/native";
import { patchHouseApi } from "../../api/house/house";
import { ApiResponse } from "../../types/app.common";
import { formatCurrencyVND } from "../../utils/currency";

const FEE_TYPES = [
    { id: "internet", icon: "📶", label: "WiFi", unit: "Tháng" },
    { id: "trash", icon: "🗑️", label: "Rác", unit: "Tháng" },
    { id: "parking", icon: "🅿️", label: "Gửi xe", unit: "Tháng" },
    { id: "other", icon: "📋", label: "Khác", unit: "" },
];

export const CreateFixedServiceScreen = () => {
    const route = useRoute()
    const { houseId, action } = route.params as any
    const [feeName, setFeeName] = useState("");
    const [unit, setUnit] = useState("");
    const [price, setPrice] = useState("");
    // const [description, setDescription] = useState("");
    const [selectedFeeType, setSelectedFeeType] = useState("electricity");
    // const [isDefault, setIsDefault] = useState(false); 
    const [oldKey, setOldKey] = useState("");

    useEffect(() => {
        if (action === 'edit') {
            const { utility } = route.params as any
            setFeeName(utility.key)
            setOldKey(utility.key)
            setPrice(formatCurrencyVND(utility.value))
            const feeType = FEE_TYPES.find(f => f.id === utility.key)
            if (feeType) {
                setUnit(feeType.unit)
            } else {
                setUnit("")
            }
        }
    }, [action])

    const handleSave = async () => {
        const { updateUtility } = patchHouseApi
        switch (action) {
            case 'create':
                try {
                    const payload = {
                        action,
                        utility: {
                            key: feeName,
                            value: price
                        }
                    }
                    const res = await updateUtility(houseId, payload) as ApiResponse<any>
                    if (res.status === "success") {
                        Alert.alert("Thành Công", "Thêm phí cố định thành công")
                        appNavigator.goBack()
                    }
                } catch (err) { }
                return;
            case "edit":
                try {
                    const payload = {
                        action,
                        oldKey,
                        utility: {
                            key: feeName,
                            value: price
                        }
                    }
                    const res = await updateUtility(houseId, payload) as ApiResponse<any>
                    if (res.status === "success") {
                        Alert.alert("Thành Công", "Câp nhật phí cố định thành công")
                        appNavigator.goBack()
                    }
                } catch (err) { }
                return
            default:
                return
        }
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.columnWrapper}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[COLORS.GRADIENT_START || "#00BC7C", COLORS.GRADIENT_END || "#00BBA6"]}
                        style={styles.headerGradient}
                    >
                        {/* Replaced Image with Lucide ArrowLeft */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => appNavigator.goBack()}
                        >
                            <ArrowLeft color={COLORS.WHITE || "#FFFFFF"} size={28} />
                        </TouchableOpacity>

                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitleText}>{`${action === "edit" ? "Câp nhật" : "Thêm"} phí cố định`}</Text>
                        </View>
                        <View style={styles.headerSpacer} />
                    </LinearGradient>

                    <View style={styles.formContainer}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitleText}>Thêm phí mới</Text>
                        </View>

                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>Loại phí</Text>
                        </View>

                        <View style={styles.feeTypesGrid}>
                            {FEE_TYPES.map((fee) => {
                                const isSelected = selectedFeeType === fee.id;
                                return (
                                    <TouchableOpacity
                                        key={fee.id}
                                        style={[
                                            styles.feeTypeCard,
                                            isSelected && styles.feeTypeCardSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedFeeType(fee.id)
                                            setFeeName(fee.label);
                                            setUnit(fee.unit);
                                        }}
                                    >
                                        <View style={styles.feeIconContainer}>
                                            <Text style={styles.feeIconText}>{fee.icon}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.feeLabelText}>{fee.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.inputSection}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.labelText}>Tên phí</Text>
                            </View>
                            <TextInput
                                placeholder="Tiền điện"
                                placeholderTextColor={COLORS.PLACEHOLDER_TEXT || "#8390A1"}
                                value={feeName}
                                onChangeText={setFeeName}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.rowInputsContainer}>
                            <View style={styles.halfInputWrapperRightMargin}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.labelText}>Đơn vị</Text>
                                </View>
                                <TextInput
                                    placeholder="số"
                                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT || "#8390A1"}
                                    value={unit}
                                    onChangeText={setUnit}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.halfInputWrapper}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.labelText}>Giá (đ)</Text>
                                </View>
                                <TextInput
                                    placeholder="3500"
                                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT || "#8390A1"}
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* <View style={styles.inputSectionLargeMargin}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.labelText}>Mô tả (tùy chọn)</Text>
                            </View>
                            <View style={styles.textAreaContainer}>
                                <TextInput
                                    placeholder="Ghi chú về phí này..."
                                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT || "#8390A1"}
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    style={styles.textAreaInput}
                                />
                            </View>
                        </View> */}

                        {/* Replaced empty View with interactive Lucide Checkbox */}
                        {/* <TouchableOpacity
                            style={[
                                styles.checkboxContainer,
                                isDefault && styles.checkboxContainerActive
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setIsDefault(!isDefault)}
                        >
                            <View style={styles.checkboxIconWrapper}>
                                {isDefault ? (
                                    <CheckSquare color={COLORS.PRIMARY || "#52C41A"} size={24} />
                                ) : (
                                    <Square color={COLORS.LIGHT_GRAY_TEXT || "#99A1AE"} size={24} />
                                )}
                            </View>
                            <View>
                                <Text style={styles.checkboxLabel}>
                                    Áp dụng mặc định cho tất cả phòng
                                </Text>
                            </View>
                        </TouchableOpacity> */}

                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => appNavigator.goBack()}
                            >
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.submitButtonContainer}
                                onPress={() => handleSave()}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    colors={[COLORS.GRADIENT_START || "#00BC7C", COLORS.GRADIENT_END || "#00BBA6"]}
                                    style={styles.submitButtonGradient}
                                >
                                    <Text style={styles.submitButtonText}>Thêm phí</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* <View style={styles.listContainer}>
                    <Text style={styles.listTitleText}>Danh sách phí (0)</Text>
                </View> */}
            </ScrollView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE || "#FFFFFF",
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        paddingBottom: 104,
    },
    columnWrapper: {
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        marginBottom: 26,
    },
    headerGradient: {
        paddingTop: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 1,
        marginBottom: 24,
    },
    backButton: {
        width: 50,
        height: 50,
        marginLeft: 10,
        backgroundColor: "#FFFFFF70",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    headerTitleContainer: {
        alignSelf: "flex-start",
        marginBottom: 1,
        marginLeft: 16,
        marginTop: 10
    },
    headerTitleText: {
        color: COLORS.WHITE || "#FFFFFF",
        fontSize: 20,
        fontWeight: "bold",
    },
    headerSpacer: {
        width: 47,
        height: 31,
    },
    formContainer: {
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderRadius: 24,
        paddingVertical: 24,
        paddingRight: 24,
        marginHorizontal: 23,
        shadowColor: "#0000001A",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    sectionTitleContainer: {
        alignSelf: "flex-start",
        marginBottom: 17,
        marginLeft: 24,
    },
    sectionTitleText: {
        color: COLORS.DARK_TEXT || "#101828",
        fontSize: 24,
        fontWeight: "bold",
    },
    labelContainer: {
        marginBottom: 9,
        marginLeft: 24,
    },
    labelText: {
        color: COLORS.SECONDARY_TEXT || "#364153",
        fontSize: 16,
        fontWeight: "bold",
    },
    feeTypesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 24,
        marginBottom: 8,
    },
    feeTypeCard: {
        width: "30%",
        alignItems: "center",
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderColor: COLORS.BORDER || "#E5E7EB",
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 10,
        marginRight: 8,
        marginBottom: 12,
    },
    feeTypeCardSelected: {
        backgroundColor: COLORS.LIGHT_GREEN_BACKGROUND || "#ECFDF5",
        borderColor: COLORS.GRADIENT_START || "#00BC7D",
        shadowColor: "#0000001A",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
    },
    feeIconContainer: {
        paddingHorizontal: 6,
        marginBottom: 8,
    },
    feeIconText: {
        color: COLORS.BLACK || "#0A0A0A",
        fontSize: 30,
    },
    feeLabelText: {
        color: COLORS.SECONDARY_TEXT || "#364153",
        fontSize: 12,
        fontWeight: "bold",
    },
    inputSection: {
        marginBottom: 21,
        marginLeft: 24,
    },
    inputSectionLargeMargin: {
        marginBottom: 27,
        marginLeft: 24,
    },
    input: {
        color: COLORS.BLACK,
        fontSize: 16,
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderColor: COLORS.BORDER || "#E5E7EB",
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 17,
        paddingHorizontal: 20,
    },
    rowInputsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 21,
        marginLeft: 24,
    },
    halfInputWrapperRightMargin: {
        flex: 1,
        marginRight: 17,
    },
    halfInputWrapper: {
        flex: 1,
    },
    textAreaContainer: {
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderColor: COLORS.BORDER || "#E5E7EB",
        borderRadius: 16,
        borderWidth: 1,
        paddingTop: 16,
        paddingLeft: 20,
        minHeight: 90,
    },
    textAreaInput: {
        color: COLORS.SECONDARY_TEXT || "#99A1AF",
        fontSize: 16,
        textAlignVertical: "top",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderColor: COLORS.BORDER || "#E5E7EB",
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 17,
        marginBottom: 36,
        marginLeft: 24,
    },
    checkboxContainerActive: {
        backgroundColor: COLORS.LIGHT_GREEN_BACKGROUND || "#ECFDF5",
        borderColor: COLORS.GRADIENT_START || "#A4F4CF",
    },
    checkboxIconWrapper: {
        marginLeft: 18,
        marginRight: 13,
    },
    checkboxLabel: {
        color: COLORS.SECONDARY_TEXT || "#364153",
        fontSize: 14,
        fontWeight: "bold",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 24,
    },
    cancelButton: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderColor: COLORS.BORDER || "#E5E7EB",
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 11,
        marginRight: 13,
    },
    cancelButtonText: {
        color: COLORS.SECONDARY_TEXT || "#364153",
        fontSize: 16,
        fontWeight: "bold",
    },
    submitButtonContainer: {
        flex: 1,
    },
    submitButtonGradient: {
        alignItems: "center",
        borderRadius: 16,
        paddingVertical: 11,
    },
    submitButtonText: {
        color: COLORS.WHITE || "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    listContainer: {
        backgroundColor: COLORS.WHITE || "#FFFFFF",
        borderRadius: 24,
        paddingTop: 24,
        paddingBottom: 56,
        paddingHorizontal: 24,
        marginHorizontal: 23,
        shadowColor: "#0000001A",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    listTitleText: {
        color: COLORS.DARK_TEXT || "#101828",
        fontSize: 20,
        fontWeight: "bold",
    },
});