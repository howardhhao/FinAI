import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#FAFAFA',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },

  // Summary Texts
  summary: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4,
  },
  comparison: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  tipText: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 10,
  },

  // Plan card
 planCard: {
  backgroundColor: '#F9FAFB',
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  marginTop: 12,
},

planTitle: {
  fontSize: 14,
  fontWeight: '500',
  color: '#6B7280',
  marginBottom: 4,
},

planBudget: {
  fontSize: 22,
  fontWeight: '700',
  color: '#111',
  marginBottom: 16,
},


  // Expenses
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginTop: 8,
    marginBottom: 8,
  },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  expenseText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },
  noteText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
  },

  // Pie chart card (if still used)
  pieChartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pieTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 10,
  },
section: {
  marginBottom: 24,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 12,
  color: '#111',
},

summaryCard: {
  backgroundColor: '#F9FAFB',
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},

summaryLabel: {
  fontSize: 14,
  color: '#374151',
},

summaryValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111',
},

overBudget: {
  color: '#DC2626', // subtle red for overspending
},
breakdownWrapper: {
  marginTop: 8,
},

breakdownTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#374151',
  marginBottom: 8,
},

breakdownGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 6 ,
},

breakdownItem: {
  width: '48%',
  backgroundColor: '#FFF',
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  marginBottom: 8,
},

breakdownCategory: {
  fontSize: 13,
  color: '#6B7280',
},

breakdownAmount: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111',
  marginTop: 4,
},
expenseCard: {
  backgroundColor: '#fff',
  padding: 14,
  borderRadius: 12,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

expenseHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
},

expenseCategory: {
  fontSize: 16,
  fontWeight: '600',
  color: '#374151',
},

expenseAmount: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#111',
},

expenseNote: {
  fontSize: 14,
  color: '#6b7280',
  marginBottom: 4,
},

expenseTimestamp: {
  fontSize: 12,
  color: '#9ca3af',
  textAlign: 'right',
},



});
