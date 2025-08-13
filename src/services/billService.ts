import { Bill } from '@/types/bill';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class BillService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getAllBills(): Promise<Bill[]> {
    return this.request<Bill[]>('/bills');
  }

  async createBill(bill: Omit<Bill, 'id' | 'createdAt'>): Promise<Bill> {
    return this.request<Bill>('/bills', {
      method: 'POST',
      body: JSON.stringify(bill),
    });
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
    return this.request<Bill>(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bill),
    });
  }

  async deleteBill(id: string): Promise<void> {
    await this.request<void>(`/bills/${id}`, {
      method: 'DELETE',
    });
  }

  async markBillAsPaid(id: string, isPaid: boolean): Promise<void> {
    await this.request<void>(`/bills/${id}/paid`, {
      method: 'PATCH',
      body: JSON.stringify({ isPaid }),
    });
  }
}

export const billService = new BillService();