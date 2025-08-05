import dayjs from 'dayjs';

export type Frequency = 'daily' | 'weekend' | 'monthly' | 'occasional';

export const categoryFrequencies: Record<string, Frequency> = {
  Food: 'daily',
  Transport: 'daily',
  Groceries: 'weekend',
  Entertainment: 'weekend',
  Bills: 'monthly',
  Shopping: 'occasional',
};

// Define base weights (must be normalized later)
const baseWeights: Record<string, number> = {
  Food: 0.3,
  Transport: 0.25,
  Groceries: 0.2,
  Entertainment: 0.15,
  Bills: 0.1,
};

/**
 * Returns dynamic category allocation percentages
 * based on today's date and frequency logic.
 * Only includes categories active today.
 */
export const getDynamicAllocations = (): Record<string, number> => {
  const today = dayjs();
  const dayOfWeek = today.day();     // Sunday = 0, Saturday = 6
  const dayOfMonth = today.date();   // 1–31

  // Select categories active today based on their frequency
  const activeCategories = Object.entries(categoryFrequencies)
    .filter(([_, freq]) => {
      switch (freq) {
        case 'daily':
          return true;
        case 'weekend':
          return dayOfWeek === 0 || dayOfWeek === 6;
        case 'monthly':
          return dayOfMonth <= 3;
        default:
          return false; // exclude 'occasional' or unknowns
      }
    })
    .map(([cat]) => cat);

  // Filter weights only for active categories
  const filteredWeights = Object.entries(baseWeights)
    .filter(([cat]) => activeCategories.includes(cat));

  const totalWeight = filteredWeights.reduce((sum, [_, w]) => sum + w, 0);

  // Normalize weights so they sum to 1
  const normalized = Object.fromEntries(
    filteredWeights.map(([cat, w]) => [cat, w / totalWeight])
  );

  return normalized;
};
