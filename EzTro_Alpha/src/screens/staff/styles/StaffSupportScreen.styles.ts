import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Header
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  // Content
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },

  // Search
  searchBar: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 20,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    height: 56,
    paddingLeft: 52,
    paddingRight: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    fontSize: 16,
    color: "#111827",
  },

  // Filters
  filtersCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterGroup: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterButtonActive: {
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  filterButtonTextActive: {
    color: "#059669",
    fontWeight: "700",
  },

  // Reports List
  reportsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
  },

  // Report Card
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reportBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  reportDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  reportMeta: {
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: "#f3f4f6",
  },
  reportMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportMetaText: {
    fontSize: 14,
    color: "#6b7280",
  },
  reportMetaRole: {
    fontSize: 12,
    color: "#9ca3af",
  },
  reportFooter: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#f3f4f6",
  },
  reportTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
