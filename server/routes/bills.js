import express from 'express';
import pool from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all bills
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM bills ORDER BY created_at DESC');
    
    // Transform database rows to match frontend Bill interface
    const bills = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      monthlyAmount: parseFloat(row.monthly_amount),
      dueDate: row.due_date,
      paymentMethod: row.payment_method,
      isPaid: Boolean(row.is_paid),
      lastPaidDate: row.last_paid_date ? row.last_paid_date.toISOString() : undefined,
      notes: row.notes,
      createdAt: row.created_at.toISOString()
    }));

    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Create a new bill
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      monthlyAmount,
      dueDate,
      paymentMethod,
      isPaid,
      notes
    } = req.body;

    const id = uuidv4();
    const createdAt = new Date();
    const lastPaidDate = isPaid ? createdAt : null;

    await pool.execute(
      `INSERT INTO bills (id, name, category, monthly_amount, due_date, payment_method, is_paid, last_paid_date, notes, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, category, monthlyAmount, dueDate, paymentMethod, isPaid, lastPaidDate, notes, createdAt]
    );

    const newBill = {
      id,
      name,
      category,
      monthlyAmount,
      dueDate,
      paymentMethod,
      isPaid,
      lastPaidDate: lastPaidDate ? lastPaidDate.toISOString() : undefined,
      notes,
      createdAt: createdAt.toISOString()
    };

    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

// Update a bill
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      monthlyAmount,
      dueDate,
      paymentMethod,
      isPaid,
      notes
    } = req.body;

    // Check if bill exists
    const [existing] = await pool.execute('SELECT * FROM bills WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const lastPaidDate = isPaid && !existing[0].is_paid ? new Date() : existing[0].last_paid_date;

    await pool.execute(
      `UPDATE bills SET 
       name = ?, category = ?, monthly_amount = ?, due_date = ?, 
       payment_method = ?, is_paid = ?, last_paid_date = ?, notes = ?
       WHERE id = ?`,
      [name, category, monthlyAmount, dueDate, paymentMethod, isPaid, lastPaidDate, notes, id]
    );

    const updatedBill = {
      id,
      name,
      category,
      monthlyAmount,
      dueDate,
      paymentMethod,
      isPaid,
      lastPaidDate: lastPaidDate ? lastPaidDate.toISOString() : undefined,
      notes,
      createdAt: existing[0].created_at.toISOString()
    };

    res.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Failed to update bill' });
  }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM bills WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});

// Mark bill as paid
router.patch('/:id/paid', async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;

    const lastPaidDate = isPaid ? new Date() : null;

    const [result] = await pool.execute(
      'UPDATE bills SET is_paid = ?, last_paid_date = ? WHERE id = ?',
      [isPaid, lastPaidDate, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ 
      message: isPaid ? 'Bill marked as paid' : 'Bill marked as unpaid',
      lastPaidDate: lastPaidDate ? lastPaidDate.toISOString() : null
    });
  } catch (error) {
    console.error('Error updating bill payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

export default router;