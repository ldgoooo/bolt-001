import { useState } from 'react';
import { Bill, BillCategory } from '@/types/bill';
import { billCategories } from '@/data/billCategories';
import { sortBillsByDueDate } from '@/utils/billUtils';
import { BillCard } from './BillCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortAsc } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BillListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string, isPaid: boolean) => void;
}

export const BillList = ({ bills, onEdit, onDelete, onTogglePaid }: BillListProps) => {
  const [filterCategory, setFilterCategory] = useState<BillCategory | 'all'>('all');
  const [sortByDue, setSortByDue] = useState(false);

  const filteredBills = bills.filter(bill => 
    filterCategory === 'all' || bill.category === filterCategory
  );

  const displayBills = sortByDue ? sortBillsByDueDate(filteredBills) : filteredBills;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select
              value={filterCategory}
              onValueChange={(value: BillCategory | 'all') => setFilterCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(billCategories).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={sortByDue ? "default" : "outline"}
            size="sm"
            onClick={() => setSortByDue(!sortByDue)}
            className="flex items-center gap-2"
          >
            <SortAsc className="w-4 h-4" />
            Sort by Due Date
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {displayBills.length} {displayBills.length === 1 ? 'bill' : 'bills'}
          </Badge>
        </div>
      </div>

      {displayBills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePaid={onTogglePaid}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-500">
            {filterCategory === 'all' 
              ? "Add your first bill to get started with managing your finances."
              : `No bills found in the ${billCategories[filterCategory as BillCategory]?.label} category.`
            }
          </p>
        </div>
      )}
    </div>
  );
};