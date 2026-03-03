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
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  selectScroll: {
    marginBottom: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  selectOptionActive: {
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_PRIMARY,
  },
  selectOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  selectOptionTextActive: {
    color: COLORS.GREEN_PRIMARY,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  categoryCardActive: {
    backgroundColor: COLORS.GREEN_VERY_LIGHT,
    borderColor: COLORS.GREEN_PRIMARY,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.TEXT_DARK,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR_TEXT,
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.GREEN_PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});
