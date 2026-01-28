import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppButton } from "../../components/misc/AppButton";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  IMAGE_SIZE,
  SPACING,
} from "../../constants/theme";

type PaymentStatusFilter = "all" | "unpaid" | "paid" | "overdue";

interface PaymentItem {
  id: string;
  tenantName: string;
  monthLabel: string;
  status: "paid" | "unpaid";
  paidAt?: string;
  items: Array<{
    id: string;
    label: string;
    amount: string;
  }>;
  total: string;
}

const demoPayments: PaymentItem[] = [
  {
    id: "p1",
    tenantName: "Nguyễn Văn A",
    monthLabel: "Tháng 2024-12",
    status: "paid",
    paidAt: "Đã thanh toán: 3/12/2024",
    items: [
      { id: "rent", label: "Tiền phòng", amount: "3.000.000 đ" },
      { id: "electric", label: "Tiền điện", amount: "245.000 đ" },
      { id: "water", label: "Tiền nước", amount: "60.000 đ" },
      { id: "other", label: "Internet & Khác", amount: "200.000 đ" },
    ],
    total: "3.505.000 đ",
  },
  {
    id: "p2",
    tenantName: "Nguyễn Văn A",
    monthLabel: "Tháng 2025-01",
    status: "unpaid",
    items: [
      { id: "rent", label: "Tiền phòng", amount: "3.000.000 đ" },
      { id: "electric", label: "Tiền điện", amount: "280.000 đ" },
      { id: "water", label: "Tiền nước", amount: "75.000 đ" },
      { id: "other", label: "Internet & Khác", amount: "200.000 đ" },
    ],
    total: "3.555.000 đ",
  },
  {
    id: "p3",
    tenantName: "Trần Thị C",
    monthLabel: "Tháng 2024-12",
    status: "paid",
    paidAt: "Đã thanh toán: 4/12/2026",
    items: [
      { id: "rent", label: "Tiền phòng", amount: "3.500.000 đ" },
      { id: "electric", label: "Tiền điện", amount: "210.000 đ" },
      { id: "water", label: "Tiền nước", amount: "45.000 đ" },
      { id: "other", label: "Internet & Khác", amount: "200.000 đ" },
    ],
    total: "3.955.000 đ",
  },
  {
    id: "p4",
    tenantName: "Trần Thị C",
    monthLabel: "Tháng 2025-01",
    status: "unpaid",
    items: [
      { id: "rent", label: "Tiền phòng", amount: "3.500.000 đ" },
      { id: "electric", label: "Tiền điện", amount: "0 đ" },
      { id: "water", label: "Tiền nước", amount: "0 đ" },
      { id: "other", label: "Internet & Khác", amount: "200.000 đ" },
    ],
    total: "3.700.000 đ",
  },
  {
    id: "p5",
    tenantName: "Trần Thị D",
    monthLabel: "Tháng 2026-01",
    status: "paid",
    items: [
      { id: "rent", label: "Tiền phòng", amount: "3.250.000 đ" },
      { id: "electric", label: "Tiền điện", amount: "10.000 đ" },
      { id: "water", label: "Tiền nước", amount: "10.000 đ" },
      { id: "other", label: "Internet & Khác", amount: "200.000 đ" },
    ],
    total: "3.470.000 đ",
  },
];

export const TrackingPaymentStatus: React.FC = () => {
  const [filter, setFilter] = useState<PaymentStatusFilter>("all");

  const collectedAmountLabel = "7.5M";
  const uncollectedAmountLabel = "7.3M";

  const filteredPayments = useMemo(() => {
    if (filter === "all") {
      return demoPayments;
    }
    if (filter === "paid") {
      return demoPayments.filter((p) => p.status === "paid");
    }
    if (filter === "unpaid" || filter === "overdue") {
      return demoPayments.filter((p) => p.status === "unpaid");
    }
    return demoPayments;
  }, [filter]);

  const handleConfirmPaid = (paymentId: string) => {
    // Placeholder for future API integration.
    void paymentId;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.headerGradient}
      >
        <View style={styles.headerDivider} />
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <View>
            <Text style={styles.headerTitle}>{"Trạng thái thu chi"}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCardCollected}>
          <Text style={styles.summaryLabelCollected}>Đã thu</Text>
          <Text style={styles.summaryValueCollected}>
            {collectedAmountLabel}
          </Text>
        </View>
        <View style={styles.summaryCardUncollected}>
          <Text style={styles.summaryLabelUncollected}>Chưa thu</Text>
          <Text style={styles.summaryValueUncollected}>
            {uncollectedAmountLabel}
          </Text>
        </View>
      </View>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "all" && styles.filterChipPrimary,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === "all" && styles.filterChipTextPrimary,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "unpaid" && styles.filterChipActiveGray,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilter("unpaid")}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === "unpaid" && styles.filterChipTextDark,
            ]}
          >
            Chưa TT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "paid" && styles.filterChipActiveGray,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilter("paid")}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === "paid" && styles.filterChipTextDark,
            ]}
          >
            Đã TT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "overdue" && styles.filterChipActiveGray,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilter("overdue")}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === "overdue" && styles.filterChipTextDark,
            ]}
          >
            Quá hạn
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredPayments.map((payment) => (
          <View key={payment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.avatarPlaceholder} />
                <View>
                  <Text style={styles.tenantName}>{payment.tenantName}</Text>
                  <Text style={styles.monthLabel}>{payment.monthLabel}</Text>
                </View>
              </View>

              <View
                style={
                  payment.status === "paid"
                    ? styles.badgePaid
                    : styles.badgeUnpaid
                }
              >
                <Text
                  style={
                    payment.status === "paid"
                      ? styles.badgePaidText
                      : styles.badgeUnpaidText
                  }
                >
                  {payment.status === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownList}>
              {payment.items.map((item) => (
                <View key={item.id} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <Text style={styles.breakdownAmount}>{item.amount}</Text>
                </View>
              ))}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{payment.total}</Text>
            </View>

            {payment.paidAt ? (
              <View style={styles.paidAtRow}>
                <Text style={styles.paidAtText}>{payment.paidAt}</Text>
              </View>
            ) : (
              <View style={styles.confirmButtonContainer}>
                <AppButton
                  title="Xác nhận đã thanh toán"
                  onPress={() => handleConfirmPaid(payment.id)}
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  headerDivider: {
    height: SPACING.HEADER_DIVIDER_HEIGHT,
    marginBottom: SPACING.HEADER_DIVIDER_MARGIN_BOTTOM,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: SPACING.HEADER_MARGIN_BOTTOM,
    marginTop: SPACING.HEADER_MARGIN_BOTTOM,
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.HEADER_TITLE,
    fontWeight: "bold",
    paddingTop: 30,
  },

  headerSpacer: {
    width: IMAGE_SIZE.CREATE_HEADER_LOGO,
    height: SPACING.XS,
  },
  backButtonPlaceholder: {
    width: SPACING.SEARCH_ICON_MARGIN_LEFT,
    height: SPACING.SEARCH_ICON_MARGIN_LEFT,
    borderRadius: BORDER_RADIUS.STATUS_BADGE,
    backgroundColor: COLORS.WHITE_SEMI_TRANSPARENT,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
    marginTop: 12,
  },
  summaryCardCollected: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    borderRadius: BORDER_RADIUS.STAT_CARD,
    paddingVertical: SPACING.STAT_CARD_PADDING_VERTICAL,
    paddingHorizontal: SPACING.SEARCH_ICON_MARGIN_LEFT,
    marginRight: SPACING.STAT_CARD_MARGIN_RIGHT,
  },
  summaryCardUncollected: {
    flex: 1,
    backgroundColor: "#FFFBEB",
    borderRadius: BORDER_RADIUS.STAT_CARD,
    paddingVertical: SPACING.STAT_CARD_PADDING_VERTICAL,
    paddingHorizontal: SPACING.SEARCH_ICON_MARGIN_LEFT,
  },
  summaryLabelCollected: {
    color: COLORS.successDark,
    fontSize: FONT_SIZE.STAT_LABEL,
  },
  summaryValueCollected: {
    color: COLORS.successText,
    fontSize: FONT_SIZE.PRICE,
    fontWeight: "bold",
  },
  summaryLabelUncollected: {
    color: COLORS.warningText,
    fontSize: FONT_SIZE.STAT_LABEL,
  },
  summaryValueUncollected: {
    color: COLORS.warningText,
    fontSize: FONT_SIZE.PRICE,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM / 2,
    marginHorizontal: SPACING.HEADER_HORIZONTAL_MARGIN,
  },
  filterChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.FEATURE_BADGE,
    backgroundColor: COLORS.GRAY_LIGHT,
    paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
    marginRight: SPACING.FEATURE_BADGE_MARGIN_RIGHT_SMALL,
  },
  filterChipPrimary: {
    backgroundColor: COLORS.GREEN_PRIMARY,
  },
  filterChipActiveGray: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  filterChipText: {
    fontSize: FONT_SIZE.STATUS_BADGE,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "bold",
  },
  filterChipTextPrimary: {
    color: COLORS.WHITE,
  },
  filterChipTextDark: {
    color: COLORS.TEXT_DARK,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    paddingTop: SPACING.CONTENT_VERTICAL_PADDING,
    paddingBottom: SPACING.CONTENT_BOTTOM_MARGIN,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.STAT_CARD,
    paddingVertical: SPACING.STAT_CARD_PADDING_VERTICAL,
    paddingHorizontal: SPACING.CONTENT_HORIZONTAL_PADDING,
    marginBottom: SPACING.STATS_CONTAINER_MARGIN_BOTTOM,
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
    marginBottom: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM / 2,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: SPACING.SEARCH_ICON_MARGIN_LEFT + SPACING.SMALL,
    height: SPACING.SEARCH_ICON_MARGIN_LEFT + SPACING.SMALL,
    borderRadius: BORDER_RADIUS.STAT_CARD,
    backgroundColor: COLORS.GRAY_LIGHT,
    marginRight: SPACING.SEARCH_ICON_MARGIN_RIGHT,
  },
  tenantName: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  monthLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.LABEL,
  },
  badgePaid: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderRadius: BORDER_RADIUS.STATUS_BADGE,
    borderWidth: 1,
    paddingHorizontal: SPACING.STATUS_BADGE_PADDING_HORIZONTAL,
    paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
  },
  badgeUnpaid: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warningBorder,
    borderRadius: BORDER_RADIUS.STATUS_BADGE,
    borderWidth: 1,
    paddingHorizontal: SPACING.STATUS_BADGE_PADDING_HORIZONTAL,
    paddingVertical: SPACING.STATUS_BADGE_PADDING_VERTICAL,
  },
  badgePaidText: {
    color: COLORS.successDark,
    fontSize: FONT_SIZE.STATUS_BADGE,
    fontWeight: "bold",
  },
  badgeUnpaidText: {
    color: COLORS.warningText,
    fontSize: FONT_SIZE.STATUS_BADGE,
    fontWeight: "bold",
  },
  breakdownList: {
    marginTop: SPACING.LABEL_MARGIN_BOTTOM,
    marginBottom: SPACING.LABEL_MARGIN_BOTTOM,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.STAT_ITEM_TEXT_MARGIN_BOTTOM + SPACING.XS,
  },
  breakdownLabel: {
    color: COLORS.TEXT_MEDIUM,
    fontSize: FONT_SIZE.LABEL,
  },
  breakdownAmount: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.LABEL,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
    paddingTop: SPACING.STAT_ITEM_TEXT_MARGIN_BOTTOM + SPACING.XS,
    marginBottom: SPACING.LABEL_MARGIN_BOTTOM,
  },
  totalLabel: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZE.SEARCH_INPUT,
    fontWeight: "bold",
  },
  totalValue: {
    color: COLORS.GREEN_PRIMARY,
    fontSize: FONT_SIZE.PRICE,
    fontWeight: "bold",
  },
  paidAtRow: {
    alignItems: "flex-end",
  },
  paidAtText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.STATUS_BADGE,
  },
  confirmButtonContainer: {
    marginTop: SPACING.SEARCH_CONTAINER_MARGIN_BOTTOM / 2,
  },
});
