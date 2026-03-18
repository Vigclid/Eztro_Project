import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_GRAY },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  readAllBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readAllText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // Tabs
  body: { flex: 1 },
  tabRow: { marginTop: 16 },
  tabRowContent: { paddingHorizontal: 16, gap: 8 },

  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    backgroundColor: COLORS.WHITE,
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: COLORS.GRADIENT_START,
    borderColor: COLORS.GRADIENT_START,
  },
  categoryTabText: { fontSize: 14, fontWeight: "600", color: "#4A5565" },
  categoryTabTextActive: { color: "#fff" },
  countBadge: {
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countBadgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  countText: { fontSize: 12, fontWeight: "bold", color: "#4A5565" },
  countTextActive: { color: "#fff" },

  priorityTab: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: COLORS.BORDER_GRAY,
    backgroundColor: COLORS.WHITE,
  },
  priorityTabActive: {
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_PRIMARY,
  },
  priorityTabText: { fontSize: 14, fontWeight: "600", color: "#4A5565" },
  priorityTabTextActive: { color: COLORS.GREEN_PRIMARY },

  // Section
  sectionHeader: { paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#101828" },

  // Card
  cardWrapper: { paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 14,
  },
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.GRADIENT_START,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
    marginRight: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#101828", flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.GRADIENT_START,
    flexShrink: 0,
  },
  cardTime: { fontSize: 12, color: "#6A7282", flexShrink: 0 },
  cardBody: {
    fontSize: 14,
    color: "#4A5565",
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.3,
  },
  priorityText: { fontSize: 12, fontWeight: "bold" },
  deleteBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Loading more
  loadingMore: { paddingVertical: 24 },

  // Empty
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: COLORS.PLACEHOLDER_GRAY },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101828",
    flex: 1,
  },
  modalTime: { fontSize: 13, color: "#6A7282" },
  modalBodyScroll: { maxHeight: 200 },
  modalBody: { fontSize: 15, color: "#4A5565", lineHeight: 22 },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
