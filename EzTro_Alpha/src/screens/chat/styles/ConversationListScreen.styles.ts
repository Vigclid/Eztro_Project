import { StyleSheet } from "react-native";

export const ConversationListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
  },
  // Header gradient wrapper
  headerGradient: {
    // No additional styles needed, gradient handles background
  },
  // Header content
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  // Search section
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontSize: 15,
    color: "#000000",
  },
  connectionStatus: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFF3CD",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE69C",
  },
  connectionStatusText: {
    fontSize: 13,
    color: "#856404",
    fontWeight: "500",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
  },
  loadMoreButton: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  loadMoreButtonText: {
    fontSize: 14,
    color: "#1ABC9C",
    fontWeight: "600",
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
