import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statPending: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
  },
  statProgress: {
    flex: 1,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  statCompleted: {
    flex: 1,
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderRadius: 16,
    padding: 16,
  },
  statLabelPending: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  statLabelProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  statLabelCompleted: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.GREEN_DARK,
  },
  statValuePending: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 4,
  },
  statValueProgress: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginTop: 4,
  },
  statValueCompleted: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.GREEN_DARK,
    marginTop: 4,
  },
  filterTabs: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: COLORS.WHITE,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  filterTabTextActive: {
    color: COLORS.GREEN_PRIMARY,
  },
  ticketList: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
    marginTop: 16,
  },
  ticketCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.GREEN_PRIMARY,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
    lineHeight: 20,
  },
  ticketLocation: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 13,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: 10,
    lineHeight: 18,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketDate: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
  },
  badgeUrgent: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeMedium: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonStart: {
    backgroundColor: '#DBEAFE',
  },
  actionButtonComplete: {
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
