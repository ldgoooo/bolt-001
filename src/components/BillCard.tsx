import { Bill } from '@/types/bill';
import { billCategories, paymentMethods } from '@/data/billCategories';
import { formatCurrency, getDaysUntilDue } from '@/utils/billUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BillCardProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string, isPaid: boolean) => void;
}

export const BillCard = ({ bill, onEdit, onDelete, onTogglePaid }: BillCardProps) => {
  const category = billCategories[bill.category];
  const daysUntilDue = getDaysUntilDue(bill.dueDate);
  
  const getDueDateStatus = () => {
    if (bill.isPaid) return 'paid';
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'urgent';
    if (daysUntilDue <= 7) return 'warning';
    return 'normal';
  };

  const status = getDueDateStatus();
  
  const statusColors = {
    paid: 'border-green-200 bg-green-50',
    overdue: 'border-red-200 bg-red-50',
    urgent: 'border-orange-200 bg-orange-50',
    warning: 'border-yellow-200 bg-yellow-50',
    normal: 'border-gray-200 bg-white'
  };

  const statusBadgeColors = {
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    urgent: 'bg-orange-100 text-orange-800',
    warning: 'bg-yellow-100 text-yellow-800',
    normal: 'bg-gray-100 text-gray-800'
  };

  const getStatusText = () => {
    if (bill.isPaid) return 'Paid';
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return 'Due today';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
      statusColors[status]
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-2xl', category.bgColor)}>
              {category.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{bill.name}</h3>
              <p className={cn('text-sm', category.color)}>{category.label}</p>
            </div>
          </div>
          <Badge variant="secondary" className={statusBadgeColors[status]}>
            {getStatusText()}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Amount</span>
            <span className="font-semibold text-lg">{formatCurrency(bill.monthlyAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Due Date</span>
            <span className="font-medium">Every {bill.dueDate}{getOrdinalSuffix(bill.dueDate)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Method</span>
            <span className="font-medium">{paymentMethods[bill.paymentMethod]}</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Button
            variant={bill.isPaid ? "destructive" : "default"}
            size="sm"
            onClick={() => onTogglePaid(bill.id, !bill.isPaid)}
            className="flex-1"
          >
            {bill.isPaid ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Mark Unpaid
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Mark Paid
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(bill)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(bill.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return 'th';
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};