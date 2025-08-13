export interface Bill {
  id: string;
  name: string;
  category: BillCategory;
  monthlyAmount: number;
  dueDate: number; // Day of month (1-31)
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  lastPaidDate?: string;
  notes?: string;
  createdAt: string;
}

export type BillCategory = 
  | 'water'
  | 'electricity'
  | 'household'
  | 'credit-card'
  | 'phone'
  | 'internet';

export type PaymentMethod = 
  | 'bank-transfer'
  | 'credit-card'
  | 'debit-card'
  | 'cash'
  | 'auto-pay';

export interface BillCategoryConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}