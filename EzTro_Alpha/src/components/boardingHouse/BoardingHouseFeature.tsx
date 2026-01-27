// components/Features.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZE,
    SPACING,
} from "../../constants/theme";

interface FeaturesProps {
    features:  {
        key: string,
        value: number
    }[];
}

const BoardingHouseFeature = ({ features }: FeaturesProps) => {
    const displayedFeatures = features.slice(0, 4);
    const hasMore = features.length > 4;

    return (
        <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
                {displayedFeatures.slice(0, 2).map((feature, index) => (
                    <TouchableOpacity key={index} style={styles.featureBadge} onPress={() => alert("Pressed!")}>
                        <Text style={styles.featureBadgeText}>{feature.key}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.featureRow}>
                {displayedFeatures.slice(2, 4).map((feature, index) => (
                    <TouchableOpacity key={index + 2} style={styles.featureBadge} onPress={() => alert("Pressed!")}>
                        <Text style={styles.featureBadgeText}>{feature.key}</Text>
                    </TouchableOpacity>
                ))}

                {hasMore && (
                    <TouchableOpacity style={styles.featureBadgeGray} onPress={() => alert("Pressed!")}>
                        <Text style={styles.featureBadgeGrayText}>+{features.length - 4}</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.featureSpacer} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    featuresContainer: {
        alignSelf: "flex-start",
        marginLeft: SPACING.DISTRICT_MARGIN_LEFT,
    },
    featureRow: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.FEATURE_ROW_MARGIN_BOTTOM,
    },
    featureBadge: {
        backgroundColor: COLORS.GREEN_VERY_LIGHT,
        borderColor: COLORS.GREEN_LIGHT_BORDER,
        borderRadius: BORDER_RADIUS.FEATURE_BADGE,
        borderWidth: 1,
        paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
        paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
        marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT,
    },
    featureBadgeText: {
        color: COLORS.GREEN_DARK,
        fontSize: FONT_SIZE.FEATURE_BADGE,
        fontWeight: "bold",
    },
    featureBadgeGray: {
        backgroundColor: COLORS.GRAY_LIGHT,
        borderColor: COLORS.BORDER_GRAY,
        borderRadius: BORDER_RADIUS.FEATURE_BADGE,
        borderWidth: 1,
        paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
        paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
        marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_SMALL,
    },
    featureBadgeGrayText: {
        color: COLORS.GRAY_DARK,
        fontSize: FONT_SIZE.FEATURE_BADGE,
        fontWeight: "bold",
    },
    featureSpacer: {
        width: 91,
        height: SPACING.PRICE_MARGIN_BOTTOM,
    },
});

export default BoardingHouseFeature