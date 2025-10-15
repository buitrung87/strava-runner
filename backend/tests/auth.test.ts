import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/authRoutes';
import passport from '../src/config/passport';

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  describe('GET /auth/strava', () => {
    it('should redirect to Strava OAuth', async () => {
      const response = await request(app).get('/auth/strava');
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('strava.com');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app).post('/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
