export type ExpenseEntry = {
  id: string;
  date: string; // e.g., "2025-07-29"
  category: string;
  amount: number;
  note?: string;
};
