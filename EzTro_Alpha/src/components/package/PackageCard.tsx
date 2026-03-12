import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPackage } from "../../types/package";
import { House, Clock, Check, FileText, Users, BarChart3, AlertCircle } from 'lucide-react-native';

interface PackageComponentProps {
    pkg: IPackage;
    roomCount: number;
    isSelected: boolean;
    onSelect: () => void;
}

const PackageCard = ({ pkg, roomCount, isSelected, onSelect }: PackageComponentProps) => {
    const isDisable = roomCount > pkg.maxRoom;

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN');
    };

    interface PackageFeatureProps {
        text: string;
        IconComponent: any;
    }

    const PackageFeature = ({ text, IconComponent }: PackageFeatureProps) => (
        <View style={styles.featureRow}>
            <IconComponent size={18} color={THEME.colors.primary} style={styles.featureIcon} />
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );

    return (
        <TouchableOpacity
            style={[
                styles.packageCard,
                isSelected && styles.selectedCard,
                isDisable && { opacity: 0.5 }
            ]}
            onPress={onSelect}
            activeOpacity={0.8}
            disabled={isDisable}
        >
            {/* Badge đã chọn */}
            {isSelected && (
                <View style={styles.selectedBadge}>
                    <Check size={16} color="white" strokeWidth={3} />
                </View>
            )}

            {isDisable &&
                <View style={styles.badgeDanger}>
                    <AlertCircle size={14} color={THEME.colors.danger} style={{ marginRight: 4 }} />
                    <Text style={styles.badgeTextDanger}>Không đủ phòng</Text>
                </View>
            }

            <Text style={styles.packageName}>{pkg.packageName}</Text>
            <Text style={styles.packageDescription}>{pkg.description}</Text>

            <View style={styles.priceContainer}>
                <Text style={styles.priceAmount}>{formatPrice(pkg.price)}</Text>
                <Text style={styles.priceCurrency}>₫</Text>
                <Text style={styles.pricePeriod}>/tháng</Text>
            </View>

            <View style={styles.specRow}>
                <View style={styles.specItem}>
                    <House size={20} color={THEME.colors.primary} style={styles.specIcon} />
                    <Text style={styles.specText}>{pkg.maxRoom} phòng</Text>
                </View>
                <View style={styles.specItem}>
                    <Clock size={20} color={THEME.colors.primary} style={styles.specIcon} />
                    <Text style={styles.specText}>{pkg.duration} tháng</Text>
                </View>
            </View>

            <Text style={styles.featuresHeading}>Tính năng nổi bật</Text>

            <PackageFeature
                text={`Quản lý tối đa ${pkg.maxRoom} phòng`}
                IconComponent={House}
            />
            <PackageFeature
                text="Tạo hóa đơn tự động"
                IconComponent={FileText}
            />
            <PackageFeature
                text="Quản lý khách thuê"
                IconComponent={Users}
            />
            <PackageFeature
                text="Báo cáo cơ bản"
                IconComponent={BarChart3}
            />
        </TouchableOpacity>
    );
};

const THEME = {
    colors: {
        primary: "#10B981",
        danger: "#B91C1C",
        dangerLight: "#FEE2E2",
        white: "#FFFFFF",
        textMain: "#111827",
        textSecondary: "#6B7280",
        textMuted: "#4B5563",
        grayLight: "#E5E7EB",
        bgLight: "#F9FAFB"
    },
    spacing: { sm: 8, md: 16, lg: 24 },
    radius: { md: 12, lg: 16, xl: 24, full: 9999 }
};

const styles = StyleSheet.create({
    packageCard: {
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.radius.xl,
        borderWidth: 2,
        borderColor: THEME.colors.grayLight,
        padding: THEME.spacing.lg,
        marginHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
        position: 'relative'
    },
    selectedCard: {
        borderColor: THEME.colors.primary,
        backgroundColor: "#F0FDF4"
    },
    selectedBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: THEME.colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    badgeDanger: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "flex-start",
        backgroundColor: THEME.colors.dangerLight,
        borderRadius: THEME.radius.full,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: THEME.spacing.sm
    },
    badgeTextDanger: {
        color: THEME.colors.danger,
        fontSize: 12,
        fontWeight: "bold"
    },
    packageName: {
        color: THEME.colors.textMain,
        fontSize: 20,
        fontWeight: "bold"
    },
    packageDescription: {
        color: THEME.colors.textSecondary,
        fontSize: 14,
        marginTop: 2
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        backgroundColor: THEME.colors.bgLight,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.md,
        marginVertical: THEME.spacing.md
    },
    priceAmount: { color: THEME.colors.textMain, fontSize: 32, fontWeight: "bold" },
    priceCurrency: { color: THEME.colors.textSecondary, fontSize: 20, marginHorizontal: 4 },
    pricePeriod: { color: THEME.colors.textSecondary, fontSize: 14 },
    specRow: {
        flexDirection: "row",
        backgroundColor: THEME.colors.bgLight,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.lg
    },
    specItem: { flexDirection: "row", alignItems: "center", marginRight: THEME.spacing.lg },
    specIcon: { marginRight: 8 },
    specText: { color: THEME.colors.textMuted, fontSize: 14, fontWeight: "bold" },
    featuresHeading: { color: THEME.colors.textMain, fontSize: 14, fontWeight: "bold", marginBottom: THEME.spacing.sm },
    featureRow: { flexDirection: "row", alignItems: "center", marginBottom: THEME.spacing.sm },
    featureIcon: { marginRight: 10 },
    featureText: { color: THEME.colors.textMuted, fontSize: 14 },
});

export default PackageCard;