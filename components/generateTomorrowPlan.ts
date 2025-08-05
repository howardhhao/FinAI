import { fetchAITipsFromMistral } from "./fetchAITipsFromMistral";

export async function generateTomorrowPlan({
  todayTotal,
  totalSpentSoFar,
  dailyBudget,
  daysPassed,
  daysInMonth,
  budget,
  weeklyTotals,
  totalWeekSpending,
}: {
  todayTotal: number;
  totalSpentSoFar: number;
  dailyBudget: number;
  daysPassed: number;
  daysInMonth: number;
  budget: number;
  weeklyTotals: Record<string, number>;
  totalWeekSpending: number;
}) {
  const daysLeft = daysInMonth - daysPassed;
  const remaining = budget - totalSpentSoFar;
  const suggested = Math.max(0, remaining / Math.max(1, daysLeft));

  let message = "";
  if (todayTotal < dailyBudget * 0.75) {
    message = "🎯 Great control today! You’re under budget.";
  } else if (todayTotal > dailyBudget * 1.25) {
    message = "⚠️ You went over budget today. Let’s aim lower tomorrow.";
  } else {
    message = "✅ You’re close to your target. Keep it up!";
  }

  const tips = await fetchAITipsFromMistral(weeklyTotals, totalWeekSpending);

  return {
    suggested: parseFloat(suggested.toFixed(2)),
    message,
    tips,
  };
}
