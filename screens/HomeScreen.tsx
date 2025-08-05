import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase';
import { styles } from '../styles/home.screen';
import BudgetModal from '../components/BudgetModal';
import dayjs from 'dayjs';
import { getDynamicAllocations } from '../types/categoryFrequencies';
import { fetchAITipsFromMistral } from '../components/fetchAITipsFromMistral';

const getToday = () => new Date().toISOString().split('T')[0];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [expensesToday, setExpensesToday] = useState<any[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [plan, setPlan] = useState<{
    suggested: number;
    message: string;
    tips: string[];
  }>({
    suggested: 0,
    message: '',
    tips: [],
  });
  const [yesterdayTotal, setYesterdayTotal] = useState(0);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setRefreshing(true);
    await Promise.all([fetchExpenses(), fetchBudget()]);
    setRefreshing(false);
  };

  const fetchExpenses = async () => {
    const todayStart = dayjs().startOf('day').toISOString();
    const todayEnd = dayjs().endOf('day').toISOString();

    const { data: todayData, error: errorToday } = await supabase
      .from('expenses')
      .select('*')
      .gte('created_at', todayStart)
      .lte('created_at', todayEnd)
      .order('created_at', { ascending: false });

    if (errorToday) {
      console.error('Supabase fetch error:', errorToday);
      return;
    }

    const todaySpent = todayData?.reduce((sum, e) => sum + e.amount, 0) || 0;
    setExpensesToday(todayData || []);
    setTodayTotal(todaySpent);

    // Fetch yesterday's expenses
    const yesterdayStart = dayjs().subtract(1, 'day').startOf('day').toISOString();
    const yesterdayEnd = dayjs().subtract(1, 'day').endOf('day').toISOString();

    const { data: yesterdayData, error: errorYesterday } = await supabase
      .from('expenses')
      .select('*')
      .gte('created_at', yesterdayStart)
      .lte('created_at', yesterdayEnd);

    if (errorYesterday) {
      console.error("Error fetching yesterday's expenses:", errorYesterday);
      return;
    }

    const totalYesterday = yesterdayData?.reduce((sum, e) => sum + e.amount, 0) || 0;
    setYesterdayTotal(totalYesterday);

    // Generate tomorrow plan
    const daysPassed = new Date().getDate();
    const daysInMonth = dayjs().daysInMonth();
    const totalSpentSoFar = await getTotalSpentThisMonth();

    const newPlan = generateTomorrowPlan({
      todayTotal: todaySpent,
      totalSpentSoFar,
      dailyBudget,
      daysPassed,
      daysInMonth,
      budget: monthlyBudget,
    });

    // Calculate weekly category totals
    const startOfWeek = dayjs().startOf('week').toISOString();
    const endOfToday = dayjs().endOf('day').toISOString();

    const { data: weeklyData, error: weeklyError } = await supabase
      .from('expenses')
      .select('*')
      .gte('created_at', startOfWeek)
      .lte('created_at', endOfToday);

    if (weeklyError) {
      console.error('Weekly fetch error:', weeklyError);
      return;
    }

    const weeklyTotals: Record<string, number> = {};
    let totalWeekSpending = 0;

    (weeklyData || []).forEach((e) => {
      const cat = e.category || 'Other';
      weeklyTotals[cat] = (weeklyTotals[cat] || 0) + e.amount;
      totalWeekSpending += e.amount;
    });

    const tips = await fetchAITipsFromMistral(weeklyTotals, totalWeekSpending);

    setPlan({
      ...newPlan,
      tips,
    });
  };

  const getTotalSpentThisMonth = async () => {
    const startOfMonth = dayjs().startOf('month').toISOString();
    const endOfToday = dayjs().endOf('day').toISOString();

    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .gte('created_at', startOfMonth)
      .lte('created_at', endOfToday);

    if (error) {
      console.error('Failed to calculate total spent:', error.message);
      return 0;
    }

    return data?.reduce((sum, e) => sum + e.amount, 0) || 0;
  };

  const fetchBudget = async () => {
    const month = getToday().slice(0, 7); // e.g., "2025-08"
    const { data, error } = await supabase
      .from('budget')
      .select('amount')
      .eq('month', month)
      .single();

    if (error) {
      console.warn('No budget set for this month.');
      setMonthlyBudget(0);
      setDailyBudget(0);
      return;
    }

    setMonthlyBudget(data.amount);
    setDailyBudget(data.amount / 30);
  };

  const generateTomorrowPlan = ({
    todayTotal,
    totalSpentSoFar,
    dailyBudget,
    daysPassed,
    daysInMonth,
    budget,
  }: {
    todayTotal: number;
    totalSpentSoFar: number;
    dailyBudget: number;
    daysPassed: number;
    daysInMonth: number;
    budget: number;
  }) => {
    if (!budget || !dailyBudget) return { suggested: 0, message: '' };

    const remainingDays = daysInMonth - daysPassed;
    const remainingBudget = budget - totalSpentSoFar;
    const averageNeeded = remainingDays > 0 ? remainingBudget / remainingDays : 0;

    const suggested = parseFloat(averageNeeded.toFixed(2));
    let message = '';

    if (todayTotal > dailyBudget) {
      message = `You overspent today. Try to spend around RM${suggested.toFixed(2)} tomorrow.`;
    } else {
      message = `Good job staying within your budget! Tomorrow's suggested budget is RM${suggested.toFixed(2)}.`;
    }

    return {
      suggested,
      message,
    };
  };

  const categoryAllocations = getDynamicAllocations();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAll} />
      }
    >
      {/* 1. Buttons */}
      <View style={styles.section}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddExpense' as never)}
          >
            <Text style={styles.addButtonText}>+ Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setBudgetModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add/Edit Budget</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Today's Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Budget</Text>
            <Text style={styles.summaryValue}>RM {dailyBudget.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Spent Today</Text>
            <Text
              style={[
                styles.summaryValue,
                todayTotal > dailyBudget && styles.overBudget,
              ]}
            >
              RM {todayTotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Spent Yesterday</Text>
            <Text style={styles.summaryValue}>RM {yesterdayTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 3. Spending Insight */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Spending Insight</Text>

  {plan.tips && plan.tips.length > 0 ? (
  plan.tips.map((tip, index) => (
    <Text key={index} style={styles.tipText}>
      {tip}
    </Text>
  ))
) : (
  <Text style={styles.tipText}>You're staying on track. Keep it up!</Text>
)}


  <View style={styles.planCard}>
    <Text style={styles.planTitle}>Tomorrow's Suggested Budget</Text>
    <Text style={styles.planBudget}>RM {plan.suggested.toFixed(2)}</Text>

    <View style={styles.breakdownWrapper}>
      <Text style={styles.breakdownTitle}>Breakdown by Category</Text>

      <View style={styles.breakdownGrid}>
        {Object.entries(categoryAllocations).map(([cat, pct]) => (
  <View key={cat} style={styles.breakdownItem}>
    <Text style={styles.breakdownCategory}>{cat}</Text>
    <Text style={styles.breakdownAmount}>
      RM {(plan.suggested * pct).toFixed(2)}
    </Text>
  </View>
))}
      </View>
    </View>
  </View>
</View>

      {/* 4. Today's Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Expenses</Text>

        {expensesToday.length === 0 ? (
          <Text style={styles.empty}>No expenses yet today.</Text>
        ) : (
          expensesToday.map((item) => (
            <View key={item.id} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <Text style={styles.expenseAmount}>RM {item.amount.toFixed(2)}</Text>
              </View>
              {item.note ? (
                <Text style={styles.expenseNote}>📝 {item.note}</Text>
              ) : null}
              <Text style={styles.expenseTimestamp}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* 5. Modal */}
      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSave={async (numericBudget: number) => {
          const month = dayjs().format('YYYY-MM');

          const { error } = await supabase
            .from('budget')
            .upsert({ month, amount: numericBudget }, { onConflict: 'month' });

          if (error) {
            console.error('Failed to save budget:', error.message);
            return false;
          }

          await fetchAll();
          return true;
        }}
      />
    </ScrollView>
  );
}
export const generateCoachingTips = (
  weeklyTotals: Record<string, number>,
  totalWeekSpending: number
): string[] => {
  if (totalWeekSpending === 0) return ['Try logging some expenses to get insights!'];

  const tips: string[] = [];

  const sortedCategories = Object.entries(weeklyTotals).sort((a, b) => b[1] - a[1]);

  for (const [category, amount] of sortedCategories.slice(0, 3)) {
    tips.push(`You've spent RM${amount.toFixed(2)} on ${category} this week. Consider reducing if needed.`);
  }

  return tips;
};
