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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  ticketTitleContainer: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  ticketLocation: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  badgeUrgent: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeMedium: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  ticketDescription: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: 16,
    lineHeight: 20,
  },
  ticketMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: COLORS.GREEN_PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  completeButton: {
    backgroundColor: COLORS.GREEN_PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});
