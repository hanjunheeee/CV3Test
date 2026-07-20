import express from 'express';
import cors from 'cors';
import rankingRoutes from './routes/ranking.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/rankings', rankingRoutes);
app.use(errorHandler);

export default app;
