import React, { useState } from "react";
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
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
    COLORS,
    SPACING,
    BORDER_RADIUS,
    FONT_SIZE,
    IMAGE_SIZE,
} from "../../constants/theme";
import { BoardingHouseNavigationProp } from "../../navigation/navigation.type";

export const ViewBoardingHousePage: React.FC = () => {
    const navigation = useNavigation<BoardingHouseNavigationProp>();
    const [searchText, onChangeSearchText] = useState("");

    const handleCreateBoardingHouse = () => {
        navigation.navigate("createBoardingHouse");
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerDivider} />
                        <View style={styles.headerContent}>
                            <Image
                                source={{
                                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/e693ktri_expires_30_days.png",
                                }}
                                resizeMode="stretch"
                                style={styles.headerLogo}
                            />
                            <View>
                                <Text style={styles.headerTitle}>{"Quản lý Nhà trọ"}</Text>
                            </View>
                            <View style={styles.headerSpacer} />
                        </View>
                    </LinearGradient>

                    <View style={styles.mainContent}>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchInputContainer}>
                                <Image
                                    source={{
                                        uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/n295p5iq_expires_30_days.png",
                                    }}
                                    resizeMode="stretch"
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    placeholder="Tìm kiếm cụm trọ..."
                                    value={searchText}
                                    onChangeText={onChangeSearchText}
                                    style={styles.searchInput}
                                />
                            </View>
                            <Image
                                source={{
                                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/2ddkzfae_expires_30_days.png",
                                }}
                                resizeMode="stretch"
                                style={styles.filterIcon}
                            />
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Image
                                    source={{
                                        uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/5yfeh1st_expires_30_days.png",
                                    }}
                                    resizeMode="stretch"
                                    style={styles.statIcon}
                                />
                                <View style={styles.statTextContainer}>
                                    <View style={styles.statLabelContainer}>
                                        <Text style={styles.statLabel}>{"Tổng cụm trọ"}</Text>
                                    </View>
                                    <View style={styles.statValueContainer}>
                                        <Text style={styles.statValue}>{"3"}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.statCard}>
                                <Image
                                    source={{
                                        uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/y1mirkee_expires_30_days.png",
                                    }}
                                    resizeMode="stretch"
                                    style={styles.statIcon}
                                />
                                <View style={styles.statTextContainer}>
                                    <View style={styles.statLabelContainer}>
                                        <Text style={styles.statLabel}>{"Tổng cộng phòng"}</Text>
                                    </View>
                                    <View style={styles.statLabelContainer}>
                                        <Text style={styles.statValue}>{"4"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.boardingHousesContainer}>
                            {/* Boarding House 1 */}
                            <View style={styles.boardingHouseCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{"Nhà trọ Hòa Bình"}</Text>
                                    <TouchableOpacity
                                        style={styles.statusBadgeAvailable}
                                        onPress={() => alert("Pressed!")}
                                    >
                                        <Text style={styles.statusBadgeText}>{"Còn phòng"}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.addressContainer}>
                                    <Image
                                        source={{
                                            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/7d8w1i7n_expires_30_days.png",
                                        }}
                                        resizeMode="stretch"
                                        style={styles.addressIcon}
                                    />
                                    <View>
                                        <Text style={styles.addressText}>{"123 Nguyễn Văn Linh"}</Text>
                                    </View>
                                </View>

                                <View style={styles.districtContainer}>
                                    <Text style={styles.districtText}>{"Quận 7"}</Text>
                                </View>

                                <View style={styles.roomStatsContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItem}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/a7pleg90_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainer}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"3"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Tổng phòng"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItem}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/z4dttm2t_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainerAlt}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"2"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Đang thuê"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItemLast}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/wrezapz8_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainerAlt2}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"1"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Còn trống"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View>

                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>{"3.000.000 đ"}</Text>
                                    <View style={styles.priceUnitContainer}>
                                        <Text style={styles.priceUnitText}>{"/tháng"}</Text>
                                    </View>
                                    <View style={styles.priceSpacer} />
                                </View>

                                <View style={styles.featuresContainer}>
                                    <View style={styles.featureRow}>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Wifi miễn phí"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Máy giặt chung"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Bảo vệ 24/7"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.featureBadgeGray}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeGrayText}>{"+1"}</Text>
                                        </TouchableOpacity>
                                        <View style={styles.featureSpacer} />
                                    </View>
                                </View>
                            </View>
                            {/* Boarding House 2 */}
                            <View style={styles.boardingHouseCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{"Phòng trọ An Khang"}</Text>
                                    <TouchableOpacity
                                        style={styles.statusBadgeAvailable}
                                        onPress={() => alert("Pressed!")}
                                    >
                                        <Text style={styles.statusBadgeText}>{"Còn phòng"}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.addressContainer}>
                                    <Image
                                        source={{
                                            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/1jbp2vfx_expires_30_days.png",
                                        }}
                                        resizeMode="stretch"
                                        style={styles.addressIcon}
                                    />
                                    <View>
                                        <Text style={styles.addressText}>{"456 Lê Văn Việt"}</Text>
                                    </View>
                                </View>

                                <View style={styles.districtContainer}>
                                    <Text style={styles.districtText}>{"Quận 9"}</Text>
                                </View>

                                <View style={styles.roomStatsContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItem}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/i39y6kyv_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainer}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"1"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Tổng phòng"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItem}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/9w68gzb2_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainerAlt}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"0"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Đang thuê"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItemLast}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/pqxaax5g_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainerAlt2}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"1"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Còn trống"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View>

                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>{"2.500.000 đ"}</Text>
                                    <View style={styles.priceUnitContainer}>
                                        <Text style={styles.priceUnitText}>{"/tháng"}</Text>
                                    </View>
                                    <View style={styles.priceSpacer} />
                                </View>

                                <View style={styles.featuresContainer}>
                                    <View style={styles.featureRow}>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Wifi miễn phí"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Thang máy"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.featureBadgeSingle}
                                        onPress={() => alert("Pressed!")}
                                    >
                                        <Text style={styles.featureBadgeText}>{"Gửi xe miễn phí"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Boarding House 3 */}
                            <View style={styles.boardingHouseCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{"Nhà trọ Sinh Viên"}</Text>
                                    <TouchableOpacity
                                        style={styles.statusBadgeFull}
                                        onPress={() => alert("Pressed!")}
                                    >
                                        <Text style={styles.statusBadgeFullText}>{"Hết phòng"}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.addressContainer}>
                                    <Image
                                        source={{
                                            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/igutppbz_expires_30_days.png",
                                        }}
                                        resizeMode="stretch"
                                        style={styles.addressIcon}
                                    />
                                    <View>
                                        <Text style={styles.addressText}>{"789 Võ Văn Ngân"}</Text>
                                    </View>
                                </View>

                                <View style={styles.districtContainer}>
                                    <Text style={styles.districtText}>{"Thủ Đức"}</Text>
                                </View>

                                <View style={styles.roomStatsContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItem}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/my2bcvoc_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainer}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"0"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Tổng phòng"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItem}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/juzfs9dx_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainerAlt}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"0"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Đang thuê"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[
                                            COLORS.GRAY_LIGHT_GRADIENT_START,
                                            COLORS.GRAY_LIGHT_GRADIENT_END,
                                        ]}
                                        style={styles.roomStatItemLast}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/j7pyxdas_expires_30_days.png",
                                            }}
                                            resizeMode="stretch"
                                            style={styles.roomStatIcon}
                                        />
                                        <View style={styles.roomStatTextContainerAlt2}>
                                            <View style={styles.roomStatValueContainer}>
                                                <Text style={styles.roomStatValue}>{"0"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.roomStatLabel}>{"Còn trống"}</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View>

                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>{"2.000.000 đ"}</Text>
                                    <View style={styles.priceUnitContainer}>
                                        <Text style={styles.priceUnitText}>{"/tháng"}</Text>
                                    </View>
                                    <View style={styles.priceSpacer} />
                                </View>

                                <View style={styles.featuresContainer}>
                                    <View style={styles.featureRow}>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Wifi miễn phí"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.featureBadge}
                                            onPress={() => alert("Pressed!")}
                                        >
                                            <Text style={styles.featureBadgeText}>{"Bếp chung"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.featureBadgeSingleAlt}
                                        onPress={() => alert("Pressed!")}
                                    >
                                        <Text style={styles.featureBadgeText}>{"Giờ giấc tự do"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {/* Floating Button */}
            <TouchableOpacity onPress={handleCreateBoardingHouse}>
                <Image
                    source={{
                        uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/6j9znJEUUf/ollwsyj9_expires_30_days.png",
                    }}
                    resizeMode="stretch"
                    style={styles.floatingButton}
                />
            </TouchableOpacity>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        marginTop: 9,
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    content: {
        backgroundColor: COLORS.WHITE,
        paddingBottom: SPACING.CONTENT_BOTTOM_MARGIN,
    },
    headerGradient: {
        paddingTop: SPACING.HEADER_TOP_PADDING,
    },
    headerDivider: {
        height: SPACING.HEADER_DIVIDER_HEIGHT,
        marginBottom: SPACING.HEADER_DIVIDER_MARGIN_BOTTOM,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.HEADER_MARGIN_BOTTOM,
        marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
    },
    headerLogo: {
        width: IMAGE_SIZE.HEADER_LOGO,
        height: IMAGE_SIZE.HEADER_LOGO,
    },
    headerTitle: {
        color: COLORS.WHITE,
        fontSize: FONT_SIZE.HEADER_TITLE,
        fontWeight: "bold",
    },
    headerSpacer: {
        width: IMAGE_SIZE.HEADER_LOGO,
        height: SPACING.XS,
    },
    mainContent: {
        backgroundColor: COLORS.BACKGROUND_GRAY,
        paddingVertical: SPACING.CONTENT_VERTICAL_PADDING,
        paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
        marginBottom: SPACING.CONTENT_BOTTOM_MARGIN,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.BORDER_GRAY,
        borderRadius: BORDER_RADIUS.INPUT,
        borderWidth: 1,
        marginRight: SPACING.SEARCH_INPUT_MARGIN_RIGHT,
    },
    searchIcon: {
        width: IMAGE_SIZE.SEARCH_ICON,
        height: IMAGE_SIZE.SEARCH_ICON,
        marginLeft: SPACING.SEARCH_ICON_MARGIN_LEFT,
        marginRight: SPACING.SEARCH_ICON_MARGIN_RIGHT,
    },
    searchInput: {
        color: COLORS.PLACEHOLDER_GRAY,
        fontSize: FONT_SIZE.SEARCH_INPUT,
        marginRight: SPACING.ICON_MARGIN_RIGHT,
        flex: 1,
        paddingVertical: SPACING.SEARCH_INPUT_PADDING_VERTICAL,
    },
    filterIcon: {
        width: IMAGE_SIZE.FILTER_ICON,
        height: IMAGE_SIZE.FILTER_ICON,
    },
    statsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.STATS_CONTAINER_MARGIN_BOTTOM,
    },
    statCard: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        borderRadius: BORDER_RADIUS.STAT_CARD,
        paddingVertical: SPACING.STAT_CARD_PADDING_VERTICAL,
        marginRight: SPACING.STAT_CARD_MARGIN_RIGHT,
        shadowColor: COLORS.SHADOW_COLOR,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        elevation: 4,
    },
    statIcon: {
        borderRadius: BORDER_RADIUS.STAT_CARD,
        width: IMAGE_SIZE.STAT_ICON,
        height: IMAGE_SIZE.STAT_ICON,
        marginRight: SPACING.STAT_CARD_ICON_MARGIN_RIGHT,
    },
    statTextContainer: {
        paddingBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
    },
    statTextContainerAlt: {
        paddingBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
        paddingRight: SPACING.STAT_CARD_TEXT_MARGIN_RIGHT,
    },
    statLabelContainer: {
        alignSelf: "flex-start",
    },
    statValueContainer: {
        alignSelf: "flex-start",
        marginRight: SPACING.STAT_CARD_TEXT_MARGIN_RIGHT,
    },
    statLabel: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: FONT_SIZE.STAT_LABEL,
        width: 44,
    },
    statValue: {
        color: COLORS.TEXT_DARK,
        fontSize: FONT_SIZE.STAT_VALUE,
        fontWeight: "bold",
    },
    boardingHousesContainer: {
        marginBottom: SPACING.BOARDING_HOUSES_CONTAINER_MARGIN_BOTTOM,
    },
    boardingHouseCard: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: BORDER_RADIUS.BOARDING_HOUSE_CARD,
        borderWidth: 1,
        paddingVertical: SPACING.BOARDING_HOUSE_CARD_PADDING_VERTICAL,
        paddingRight: SPACING.BOARDING_HOUSE_CARD_PADDING_RIGHT,
        marginBottom: SPACING.BOARDING_HOUSE_CARD_MARGIN_BOTTOM,
        shadowColor: COLORS.SHADOW_COLOR,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.BOARDING_HOUSE_TITLE_MARGIN_BOTTOM,
        marginLeft: SPACING.BOARDING_HOUSE_CARD_MARGIN_LEFT,
    },
    cardTitle: {
        color: COLORS.TEXT_DARK,
        fontSize: FONT_SIZE.BOARDING_HOUSE_TITLE,
        fontWeight: "bold",
    },
    statusBadgeAvailable: {
        backgroundColor: COLORS.GREEN_LIGHT_BG,
        borderColor: COLORS.GREEN_LIGHT_BORDER,
        borderRadius: BORDER_RADIUS.STATUS_BADGE,
        borderWidth: 1,
        paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
        paddingHorizontal: SPACING.STATUS_BADGE_PADDING_HORIZONTAL,
    },
    statusBadgeText: {
        color: COLORS.GREEN_DARK,
        fontSize: FONT_SIZE.STATUS_BADGE,
        fontWeight: "bold",
    },
    statusBadgeFull: {
        backgroundColor: COLORS.RED_LIGHT_BG,
        borderColor: COLORS.RED_LIGHT_BORDER,
        borderRadius: BORDER_RADIUS.STATUS_BADGE,
        borderWidth: 1,
        paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
        paddingHorizontal: SPACING.STATUS_BADGE_PADDING_HORIZONTAL - SPACING.XS,
    },
    statusBadgeFullText: {
        color: COLORS.RED_TEXT,
        fontSize: FONT_SIZE.STATUS_BADGE,
        fontWeight: "bold",
    },
    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.ADDRESS_MARGIN_BOTTOM,
        marginLeft: SPACING.BOARDING_HOUSE_CARD_MARGIN_LEFT,
    },
    addressIcon: {
        width: IMAGE_SIZE.ADDRESS_ICON,
        height: IMAGE_SIZE.ADDRESS_ICON,
        marginRight: SPACING.ADDRESS_ICON_MARGIN_RIGHT,
    },
    addressText: {
        color: COLORS.TEXT_MEDIUM,
        fontSize: FONT_SIZE.ADDRESS,
    },
    districtContainer: {
        paddingLeft: SPACING.DISTRICT_PADDING_LEFT,
        marginBottom: SPACING.DISTRICT_MARGIN_BOTTOM,
        marginLeft: SPACING.DISTRICT_MARGIN_LEFT,
    },
    districtText: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: FONT_SIZE.DISTRICT,
    },
    roomStatsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.PRICE_MARGIN_BOTTOM,
        marginLeft: SPACING.DISTRICT_MARGIN_LEFT,
    },
    roomStatItem: {
        flex: 1,
        alignItems: "center",
        borderColor: COLORS.BORDER_GRAY,
        borderRadius: BORDER_RADIUS.STAT_ITEM,
        borderWidth: 1,
        paddingVertical: SPACING.STAT_ITEM_PADDING_VERTICAL,
        marginRight: SPACING.STAT_ITEM_MARGIN_RIGHT,
    },
    roomStatItemLast: {
        flex: 1,
        alignItems: "center",
        borderColor: COLORS.BORDER_GRAY,
        borderRadius: BORDER_RADIUS.STAT_ITEM,
        borderWidth: 1,
        paddingVertical: SPACING.STAT_ITEM_PADDING_VERTICAL,
    },
    roomStatIcon: {
        borderRadius: BORDER_RADIUS.STAT_ITEM,
        width: IMAGE_SIZE.STAT_ITEM_ICON,
        height: IMAGE_SIZE.STAT_ITEM_ICON,
        marginBottom: SPACING.STAT_ITEM_ICON_MARGIN_BOTTOM,
    },
    roomStatTextContainer: {
        marginHorizontal: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL,
    },
    roomStatTextContainerAlt: {
        marginHorizontal: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL_ALT,
    },
    roomStatTextContainerAlt2: {
        marginHorizontal: SPACING.STAT_ITEM_TEXT_MARGIN_HORIZONTAL_ALT2,
    },
    roomStatValueContainer: {
        alignSelf: "flex-start",
        marginBottom: SPACING.STAT_CARD_TEXT_MARGIN_BOTTOM,
    },
    roomStatValue: {
        color: COLORS.TEXT_DARK,
        fontSize: FONT_SIZE.STAT_ITEM_VALUE,
        fontWeight: "bold",
    },
    roomStatLabel: {
        color: COLORS.TEXT_MEDIUM,
        fontSize: FONT_SIZE.STAT_ITEM_LABEL,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.PRICE_MARGIN_BOTTOM,
        marginLeft: SPACING.BOARDING_HOUSE_CARD_MARGIN_LEFT,
    },
    priceText: {
        color: COLORS.GREEN_PRIMARY,
        fontSize: FONT_SIZE.PRICE,
        fontWeight: "bold",
        marginRight: SPACING.PRICE_MARGIN_RIGHT,
        flex: 1,
    },
    priceUnitContainer: {
        marginRight: SPACING.PRICE_MARGIN_RIGHT,
    },
    priceUnitText: {
        color: COLORS.TEXT_SECONDARY,
        fontSize: FONT_SIZE.PRICE_UNIT,
    },
    priceSpacer: {
        height: SPACING.PRICE_MARGIN_BOTTOM,
        flex: 1,
    },
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
    featureBadgeSingle: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.GREEN_VERY_LIGHT,
        borderColor: COLORS.GREEN_LIGHT_BORDER,
        borderRadius: BORDER_RADIUS.FEATURE_BADGE,
        borderWidth: 1,
        paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
        paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
        marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_LARGE,
    },
    featureBadgeSingleAlt: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.GREEN_VERY_LIGHT,
        borderColor: COLORS.GREEN_LIGHT_BORDER,
        borderRadius: BORDER_RADIUS.FEATURE_BADGE,
        borderWidth: 1,
        paddingVertical: SPACING.FEATURE_BADGE_PADDING_VERTICAL,
        paddingHorizontal: SPACING.FEATURE_BADGE_PADDING_HORIZONTAL,
        marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_XLARGE,
    },
    featureSpacer: {
        width: 91,
        height: SPACING.PRICE_MARGIN_BOTTOM,
    },
    floatingButton: {
        position: "absolute",
        bottom: -30,
        left: 280,
        // top: SPACING.FLOATING_BUTTON_TOP,
        // right: SPACING.FLOATING_BUTTON_RIGHT,
        width: IMAGE_SIZE.FLOATING_BUTTON,
        height: IMAGE_SIZE.FLOATING_BUTTON,
    },
});
