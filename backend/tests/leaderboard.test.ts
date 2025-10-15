import request from 'supertest';
import express from 'express';
import leaderboardRoutes from '../src/routes/leaderboardRoutes';

const app = express();
app.use(express.json());
app.use('/api/leaderboard', leaderboardRoutes);

describe('Leaderboard Routes', () => {
  describe('GET /api/leaderboard', () => {
    it('should return leaderboard data', async () => {
      const response = await request(app).get('/api/leaderboard');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('period');
      expect(response.body).toHaveProperty('leaderboard');
      expect(response.body).toHaveProperty('totalAthletes');
      expect(Array.isArray(response.body.leaderboard)).toBe(true);
    });

    it('should accept period query parameter', async () => {
      const response = await request(app)
        .get('/api/leaderboard')
        .query({ period: 'week' });
      
      expect(response.status).toBe(200);
      expect(response.body.period).toBe('week');
    });

    it('should default to month period', async () => {
      const response = await request(app).get('/api/leaderboard');
      
      expect(response.status).toBe(200);
      expect(response.body.period).toBe('month');
    });
  });
});
