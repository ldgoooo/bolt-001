import { useState } from 'react';
import { useBills } from '@/hooks/useBills';
import { Bill } from '@/types/bill';
import { Dashboard } from '@/components/Dashboard';
import { BillList } from '@/components/BillList';
import { BillForm } from '@/components/BillForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Receipt, BarChart3, Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

function App() {
  const { bills, loading, error, addBill, updateBill, deleteBill, markAsPaid, markAsUnpaid } = useBills();
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const handleAddBill = async (billData: Omit<Bill, 'id' | 'createdAt'>) => {
    try {
      await addBill(billData);
      toast.success('Bill added successfully!');
    } catch (error) {
      toast.error('Failed to add bill. Please try again.');
    }
  };

  const handleUpdateBill = async (billData: Omit<Bill, 'id' | 'createdAt'>) => {
    if (!editingBill) return;
    
    try {
      await updateBill(editingBill.id, billData);
      setEditingBill(null);
      toast.success('Bill updated successfully!');
    } catch (error) {
      toast.error('Failed to update bill. Please try again.');
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await deleteBill(id);
      toast.success('Bill deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete bill. Please try again.');
    }
  };

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    try {
      if (isPaid) {
        await markAsPaid(id);
        toast.success('Bill marked as paid!');
      } else {
        await markAsUnpaid(id);
        toast.info('Bill marked as unpaid');
      }
    } catch (error) {
      toast.error('Failed to update payment status. Please try again.');
    }
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBill(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your bills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Bill Manager</h1>
              <p className="text-gray-600">Keep track of all your monthly bills and payments</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)} 
              className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Add Bill
            </Button>
          </div>
          <Separator className="mt-6" />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="bills" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              All Bills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard bills={bills} />
          </TabsContent>

          <TabsContent value="bills">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <BillList
                  bills={bills}
                  onEdit={handleEditBill}
                  onDelete={handleDeleteBill}
                  onTogglePaid={handleTogglePaid}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bill Form Modal */}
        <BillForm
          bill={editingBill}
          open={showForm}
          onOpenChange={handleCloseForm}
          onSubmit={editingBill ? handleUpdateBill : handleAddBill}
        />

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;