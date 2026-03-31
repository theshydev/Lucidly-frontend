import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at, updated_at FROM journal_entries WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [req.userId]
    );
    res.json({ entry: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { content } = req.body;
  if (content === undefined) return res.status(400).json({ error: 'Content is required' });
  try {
    const existing = await pool.query(
      'SELECT id FROM journal_entries WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [req.userId]
    );
    let result;
    if (existing.rows[0]) {
      result = await pool.query(
        'UPDATE journal_entries SET content = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
        [content, existing.rows[0].id, req.userId]
      );
    } else {
      result = await pool.query(
        'INSERT INTO journal_entries (user_id, content) VALUES ($1, $2) RETURNING *',
        [req.userId, content]
      );
    }
    res.json({ entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
