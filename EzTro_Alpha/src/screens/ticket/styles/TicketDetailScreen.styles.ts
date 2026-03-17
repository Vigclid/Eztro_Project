import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
  },
  infoCard: {
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    width: 100,
  },
  metaValue: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_GRAY,
    marginVertical: 16,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    lineHeight: 20,
  },
  repliesSection: {
    marginBottom: 16,
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: 12,
  },
  replyCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  replyTime: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  replyContent: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    lineHeight: 20,
  },
  noReplies: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingVertical: 24,
  },
  replyInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.GREEN_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.GRAY_DARK,
    opacity: 0.5,
  },
  // Chat message alignment styles
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.GREEN_LIGHT,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
  },
  // Chat disabled container
  chatDisabledContainer: {
    padding: 16,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
    alignItems: 'center',
  },
  chatDisabledText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});
