import { Bill } from '@/types/bill';
import { formatCurrency, getTotalMonthlyAmount, getUpcomingBills } from '@/utils/billUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface DashboardProps {
  bills: Bill[];
}

export const Dashboard = ({ bills }: DashboardProps) => {
  const totalMonthly = getTotalMonthlyAmount(bills);
  const upcomingBills = getUpcomingBills(bills, 7);
  const paidBills = bills.filter(bill => bill.isPaid);
  const unpaidBills = bills.filter(bill => !bill.isPaid);
  const paidPercentage = bills.length > 0 ? (paidBills.length / bills.length) * 100 : 0;

  const stats = [
    {
      title: 'Total Monthly Bills',
      value: formatCurrency(totalMonthly),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming Bills',
      value: upcomingBills.length.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Paid This Month',
      value: paidBills.length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Bills',
      value: bills.length.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Bills Paid This Month</span>
                <span>{paidBills.length} of {bills.length}</span>
              </div>
              <Progress value={paidPercentage} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Paid: {formatCurrency(paidBills.reduce((sum, bill) => sum + bill.monthlyAmount, 0))}</span>
                <span>Remaining: {formatCurrency(unpaidBills.reduce((sum, bill) => sum + bill.monthlyAmount, 0))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBills.length > 0 ? (
                upcomingBills.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-sm text-gray-600">Due: {bill.dueDate}{getOrdinalSuffix(bill.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(bill.monthlyAmount)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming bills in the next 7 days</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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