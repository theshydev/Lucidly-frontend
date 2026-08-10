import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at, updated_at FROM journal_entries WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 100',
      [req.userId]
    );
    res.json({ entries: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { content } = req.body;
  if (typeof content !== 'string' || !content.trim()) return res.status(400).json({ error: 'Content is required' });
  if (content.length > 12000) return res.status(400).json({ error: 'Entry is too long' });

  try {
    const result = await pool.query(
      'INSERT INTO journal_entries (user_id, content) VALUES ($1, $2) RETURNING id, content, created_at, updated_at',
      [req.userId, content.trim()]
    );
    res.status(201).json({ entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
