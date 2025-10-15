import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import axios from 'axios';
import { StravaTokenResponse } from '../types';
import prisma from './database';

const STRAVA_AUTHORIZATION_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_ATHLETE_URL = 'https://www.strava.com/api/v3/athlete';

passport.use(
  'strava',
  new OAuth2Strategy(
    {
      authorizationURL: STRAVA_AUTHORIZATION_URL,
      tokenURL: STRAVA_TOKEN_URL,
      clientID: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      callbackURL: process.env.STRAVA_CALLBACK_URL!,
      scope: ['read', 'activity:read_all', 'profile:read_all'],
    },
    async (accessToken: string, refreshToken: string, params: any, profile: any, done: any) => {
      try {
        // Parse token response
        const tokenData = params as StravaTokenResponse;
        const athlete = tokenData.athlete;

        // Create or update user in database
        const user = await prisma.user.upsert({
          where: { stravaId: athlete.id.toString() },
          update: {
            accessToken,
            refreshToken,
            tokenExpiresAt: new Date(tokenData.expires_at * 1000),
            firstName: athlete.firstname,
            lastName: athlete.lastname,
            username: athlete.username,
            city: athlete.city,
            country: athlete.country,
            profilePicture: athlete.profile || athlete.profile_medium,
            updatedAt: new Date(),
          },
          create: {
            stravaId: athlete.id.toString(),
            accessToken,
            refreshToken,
            tokenExpiresAt: new Date(tokenData.expires_at * 1000),
            firstName: athlete.firstname,
            lastName: athlete.lastname,
            username: athlete.username,
            city: athlete.city,
            country: athlete.country,
            profilePicture: athlete.profile || athlete.profile_medium,
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
