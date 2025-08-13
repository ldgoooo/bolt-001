import { Bill } from '@/types/bill';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const getDaysUntilDue = (dueDate: number): number => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();
  
  let targetMonth = currentMonth;
  let targetYear = currentYear;
  
  if (dueDate < currentDay) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }
  
  const dueDateTime = new Date(targetYear, targetMonth, dueDate);
  const todayTime = new Date(currentYear, currentMonth, currentDay);
  
  const diffTime = dueDateTime.getTime() - todayTime.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const sortBillsByDueDate = (bills: Bill[]): Bill[] => {
  return [...bills].sort((a, b) => {
    const daysA = getDaysUntilDue(a.dueDate);
    const daysB = getDaysUntilDue(b.dueDate);
    return daysA - daysB;
  });
};

export const getTotalMonthlyAmount = (bills: Bill[]): number => {
  return bills.reduce((total, bill) => total + bill.monthlyAmount, 0);
};

export const getUpcomingBills = (bills: Bill[], days: number = 7): Bill[] => {
  return bills.filter(bill => {
    const daysUntilDue = getDaysUntilDue(bill.dueDate);
    return !bill.isPaid && daysUntilDue <= days;
  });
};