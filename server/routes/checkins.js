import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, feeling, energy, stressors, score, keywords, explanation, created_at FROM ai_checkins WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [req.userId]
    );
    res.json({ checkins: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { feeling, energy, stressors, score, keywords, explanation } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ai_checkins (user_id, feeling, energy, stressors, score, keywords, explanation) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.userId, feeling, energy, stressors, score, keywords, explanation]
    );
    res.json({ checkin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
