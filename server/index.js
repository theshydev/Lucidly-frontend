import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import journalRoutes from './routes/journal.js';
import moodRoutes from './routes/moods.js';
import checkinRoutes from './routes/checkins.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/checkins', checkinRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const distPath = join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')));
}

app.listen(PORT, '0.0.0.0', () => console.log(`API server running on port ${PORT}`));
