import { BillCategory, BillCategoryConfig } from '@/types/bill';

export const billCategories: Record<BillCategory, BillCategoryConfig> = {
  water: {
    label: 'Water',
    icon: '💧',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  electricity: {
    label: 'Electricity',
    icon: '⚡',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  household: {
    label: 'Household',
    icon: '🏠',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  'credit-card': {
    label: 'Credit Card',
    icon: '💳',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  phone: {
    label: 'Phone',
    icon: '📱',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  internet: {
    label: 'Internet',
    icon: '🌐',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
};

export const paymentMethods = {
  'bank-transfer': 'Bank Transfer',
  'credit-card': 'Credit Card',
  'debit-card': 'Debit Card',
  'cash': 'Cash',
  'auto-pay': 'Auto Pay'
};