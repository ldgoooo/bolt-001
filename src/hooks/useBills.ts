import { useState, useEffect } from 'react';
import { Bill } from '@/types/bill';
import { billService } from '@/services/billService';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBills = await billService.getAllBills();
      setBills(fetchedBills);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bills');
      console.error('Error loading bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (bill: Omit<Bill, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newBill = await billService.createBill(bill);
      setBills(prev => [...prev, newBill]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bill');
      throw err;
    }
  };

  const updateBill = async (id: string, updates: Partial<Bill>) => {
    try {
      setError(null);
      const updatedBill = await billService.updateBill(id, updates);
      setBills(prev => prev.map(bill => 
        bill.id === id ? updatedBill : bill
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bill');
      throw err;
    }
  };

  const deleteBill = async (id: string) => {
    try {
      setError(null);
      await billService.deleteBill(id);
      setBills(prev => prev.filter(bill => bill.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bill');
      throw err;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      setError(null);
      await billService.markBillAsPaid(id, true);
      setBills(prev => prev.map(bill => 
        bill.id === id ? { 
          ...bill, 
          isPaid: true, 
          lastPaidDate: new Date().toISOString() 
        } : bill
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark bill as paid');
      throw err;
    }
  };

  const markAsUnpaid = async (id: string) => {
    try {
      setError(null);
      await billService.markBillAsPaid(id, false);
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, isPaid: false } : bill
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark bill as unpaid');
      throw err;
    }
  };

  return {
    bills,
    loading,
    error,
    addBill,
    updateBill,
    deleteBill,
    markAsPaid,
    markAsUnpaid,
    refetch: loadBills
  };
};