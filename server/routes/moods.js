import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, date, mood, value, created_at FROM mood_logs WHERE user_id = $1 ORDER BY date DESC LIMIT 30',
      [req.userId]
    );
    res.json({ logs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { date, mood, value } = req.body;
  if (!date || !mood || value === undefined) return res.status(400).json({ error: 'date, mood, and value are required' });
  try {
    const result = await pool.query(
      `INSERT INTO mood_logs (user_id, date, mood, value)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, date) DO UPDATE SET mood = $3, value = $4
       RETURNING *`,
      [req.userId, date, mood, value]
    );
    res.json({ log: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
