import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111827',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
  },
  activeCategory: {
    backgroundColor: '#111',
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scanButton: {
  marginTop: 8,
  marginBottom: 16,
  padding: 12,
  backgroundColor: '#111',
  borderRadius: 8,
  alignItems: 'center',
},
scanButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '500',
},
  saveButton: {
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  editBudgetButton: {
  backgroundColor: '#E0F2FE',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 10,
},
editBudgetButtonText: {
  color: '#0369A1',
  fontSize: 16,
  fontWeight: '600',
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

});
