// utils/budget.ts
import dayjs from 'dayjs';

export const getTodayDate = () => dayjs().format('YYYY-MM-DD');

export const getYesterdayDate = () => dayjs().subtract(1, 'day').format('YYYY-MM-DD');

export const getRemainingDaysInMonth = () => {
  const today = dayjs();
  const end = today.endOf('month');
  return end.diff(today, 'day') + 1;
};

export const calculateTomorrowBudget = (monthlyBudget: number, spentSoFar: number) => {
  const remaining = monthlyBudget - spentSoFar;
  const daysLeft = getRemainingDaysInMonth();
  return daysLeft > 0 ? remaining / daysLeft : 0;
};
