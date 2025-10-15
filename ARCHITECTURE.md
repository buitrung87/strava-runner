# Strava Runner - System Architecture

## Overview

Strava Runner is a full-stack web application built with a modern microservices architecture using Docker containers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Frontend Container                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React + TypeScript                       │  │
│  │  - Vite (Build Tool)                                 │  │
│  │  - TailwindCSS (Styling)                             │  │
│  │  - React Router (Navigation)                         │  │
│  │  - Axios (HTTP Client)                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Port: 5173                                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend Container                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express.js + TypeScript                     │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │         Authentication Layer                 │    │  │
│  │  │  - Passport.js (OAuth2)                     │    │  │
│  │  │  - JWT Tokens                               │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │            API Routes                        │    │  │
│  │  │  - /auth/* (Authentication)                 │    │  │
│  │  │  - /api/activities (User Activities)        │    │  │
│  │  │  - /api/leaderboard (Rankings)              │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │         Background Jobs                      │    │  │
│  │  │  - node-cron (Scheduler)                    │    │  │
│  │  │  - Auto-sync every 6 hours                  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │      Strava Service Integration              │    │  │
│  │  │  - OAuth2 Flow                              │    │  │
│  │  │  - Activity Sync                            │    │  │
│  │  │  - Token Refresh                            │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Port: 3001                                                  │
└────────────┬───────────────────────┬────────────────────────┘
             │                       │
             │                       │ HTTPS
             │                       │
             │                  ┌────▼──────────────────┐
             │                  │   Strava API          │
             │                  │  - OAuth2             │
             │                  │  - Activities         │
             │                  │  - Athlete Profile    │
             │                  └───────────────────────┘
             │
             │ Prisma ORM
             │
┌────────────▼─────────────────────────────────────────────────┐
│                   PostgreSQL Container                        │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Database Schema                       │  │
│  │                                                         │  │
│  │  ┌──────────────┐         ┌──────────────┐           │  │
│  │  │    users     │         │  activities   │           │  │
│  │  ├──────────────┤         ├──────────────┤           │  │
│  │  │ id           │◄────────┤ userId       │           │  │
│  │  │ stravaId     │         │ name         │           │  │
│  │  │ accessToken  │         │ distance     │           │  │
│  │  │ refreshToken │         │ movingTime   │           │  │
│  │  │ firstName    │         │ startDate    │           │  │
│  │  │ lastName     │         │ type         │           │  │
│  │  │ ...          │         │ ...          │           │  │
│  │  └──────────────┘         └──────────────┘           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  Port: 5432                                                   │
└───────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React + Vite)

**Responsibility**: User interface and client-side logic

**Key Features**:
- Single Page Application (SPA)
- Responsive design with TailwindCSS
- Context API for state management
- Protected routes for authenticated users

**Main Components**:
- `AuthContext`: Global authentication state
- `Layout`: Navigation and page structure
- `Dashboard`: User's personal statistics
- `Leaderboard`: Global rankings
- `ActivityCard`: Individual activity display

**Data Flow**:
1. User interacts with UI
2. React component triggers API call via Axios
3. Request sent to backend with JWT token in header
4. Response updates component state
5. UI re-renders with new data

### Backend (Express.js + TypeScript)

**Responsibility**: Business logic, data processing, external API integration

**Key Features**:
- RESTful API design
- Passport.js OAuth2 authentication
- JWT token-based session management
- Background job scheduling
- Prisma ORM for database operations

**API Endpoints**:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/strava` | GET | No | Initiate OAuth |
| `/auth/strava/callback` | GET | No | OAuth callback |
| `/auth/profile` | GET | Yes | Get user profile |
| `/api/activities` | GET | Yes | Get activities |
| `/api/activities/sync` | POST | Yes | Sync from Strava |
| `/api/leaderboard` | GET | No | Get rankings |

**Background Jobs**:
- **Activity Sync**: Runs every 6 hours
- Fetches latest activities for all users
- Updates database with new data
- Uses Strava API with token refresh

### Database (PostgreSQL)

**Responsibility**: Persistent data storage

**Schema**:

**users** table:
- Primary user data from Strava
- OAuth tokens (encrypted)
- Profile information
- Last sync timestamp

**activities** table:
- Running activity details
- Performance metrics (pace, heart rate)
- Relationships to users (foreign key)
- Indexes on userId, startDate, type for fast queries

**Key Relationships**:
- One user → Many activities (1:N)

## Data Flow

### User Authentication Flow

```
1. User clicks "Sign in with Strava"
   └→ Frontend redirects to /auth/strava

2. Backend redirects to Strava OAuth
   └→ User authorizes app on Strava

3. Strava redirects to /auth/strava/callback
   └→ Backend receives authorization code

4. Backend exchanges code for access token
   └→ Stores tokens and user data in database

5. Backend generates JWT token
   └→ Redirects to frontend with JWT

6. Frontend stores JWT in localStorage
   └→ Uses JWT for subsequent API calls
```

### Activity Sync Flow

```
1. User clicks "Sync from Strava" or cron job triggers
   └→ POST /api/activities/sync

2. Backend checks if access token is expired
   └→ If expired, refreshes using refresh token

3. Backend calls Strava API to fetch activities
   └→ Pagination: 100 activities per request

4. Backend filters for running activities only
   └→ Types: Run, TrailRun, VirtualRun

5. Backend upserts activities to database
   └→ Prisma handles insert/update logic

6. Backend updates user's lastSyncAt timestamp
   └→ Returns success response
```

### Leaderboard Calculation Flow

```
1. Frontend requests leaderboard for period
   └→ GET /api/leaderboard?period=month

2. Backend calculates start date for period
   └→ day: today at 00:00
   └→ week: start of current week
   └→ month: first day of current month

3. Backend queries all users with activities in period
   └→ Uses Prisma include for efficient query

4. Backend aggregates statistics per user
   └→ Sum distance, count activities, sum time

5. Backend sorts by total distance descending
   └→ Assigns ranks (1, 2, 3, ...)

6. Backend returns ranked leaderboard
   └→ Frontend displays with visual ranking
```

## Security Architecture

### Authentication & Authorization

**OAuth2 Flow**:
1. User authenticates with Strava (third-party)
2. Backend receives authorization code
3. Backend exchanges for access/refresh tokens
4. Tokens stored securely in database
5. JWT issued to client for session management

**Token Management**:
- **Access Token**: Stored in database, used for Strava API
- **Refresh Token**: Stored in database, used to get new access token
- **JWT Token**: Stored in client localStorage, expires in 7 days
- **Token Refresh**: Automatic when Strava token expires

**API Security**:
- JWT validation on protected routes
- CORS enabled for specific frontend origin
- Environment variables for sensitive data
- No hardcoded credentials

### Data Protection

- Passwords not stored (OAuth only)
- Tokens stored in database (should be encrypted in production)
- JWT secret in environment variables
- HTTPS recommended for production

## Scalability Considerations

### Current Architecture

- **Single instance** of each service
- **Vertical scaling** by increasing container resources
- **PostgreSQL** handles up to ~10,000 users efficiently

### Scaling Strategies

**Frontend**:
- Deploy to CDN (Netlify, Vercel)
- Static files cached globally
- Minimal backend load

**Backend**:
- **Horizontal scaling**: Run multiple backend instances
- **Load balancer**: Nginx or cloud load balancer
- **Stateless design**: JWT tokens enable multi-instance
- **Background jobs**: Separate worker service

**Database**:
- **Read replicas**: For leaderboard queries
- **Connection pooling**: Prisma built-in
- **Indexes**: On frequently queried fields
- **Partitioning**: Activities table by date

### Performance Optimizations

1. **Caching**:
   - Redis for leaderboard data
   - Cache invalidation on activity sync

2. **Database**:
   - Indexes on userId, startDate, type
   - Aggregate queries instead of N+1

3. **API**:
   - Pagination for large result sets
   - Rate limiting to prevent abuse

4. **Background Jobs**:
   - Queue system (Bull/BullMQ)
   - Retry logic for failed syncs

## Monitoring & Logging

### Current Logging

- Docker Compose logs
- Console logging in both frontend/backend
- Prisma query logs (development only)

### Production Recommendations

- **Application logs**: Winston or Pino
- **Error tracking**: Sentry
- **Performance monitoring**: New Relic or DataDog
- **Database monitoring**: pgAdmin or cloud provider tools

## Deployment Architecture

### Development (Docker Compose)

- All services on one machine
- Shared Docker network
- Volume mounts for live reload

### Production Recommendations

**Option 1: Single VPS**
- Docker Compose on Ubuntu server
- Nginx reverse proxy
- Let's Encrypt SSL
- Automated backups

**Option 2: Cloud Platform**
- Frontend: Vercel/Netlify
- Backend: Heroku/Railway/Fly.io
- Database: Managed PostgreSQL (AWS RDS, Digital Ocean)

**Option 3: Kubernetes**
- Frontend/Backend pods
- PostgreSQL StatefulSet
- Horizontal pod autoscaling
- Ingress for load balancing

## Technology Choices

### Why React?
- Large ecosystem and community
- Component reusability
- Virtual DOM for performance
- TypeScript support

### Why Express.js?
- Minimalist and flexible
- Large middleware ecosystem
- Easy to understand and maintain
- Excellent TypeScript support

### Why PostgreSQL?
- Robust relational database
- ACID compliance
- Excellent performance for aggregations
- JSON support for flexibility

### Why Prisma?
- Type-safe database access
- Automatic migrations
- Intuitive query API
- Great developer experience

### Why Docker?
- Consistent environments
- Easy deployment
- Service isolation
- Portable across platforms

## Future Architecture Enhancements

1. **Microservices**:
   - Separate sync service
   - Separate notification service
   - Event-driven architecture

2. **Real-time Features**:
   - WebSocket for live updates
   - Real-time leaderboard changes
   - Activity notifications

3. **Advanced Analytics**:
   - Data warehouse for historical analysis
   - Machine learning for predictions
   - Advanced visualization

4. **Mobile Apps**:
   - React Native applications
   - Shared API backend
   - Push notifications

5. **Multi-tenant**:
   - Support multiple clubs
   - Club-specific leaderboards
   - Admin dashboard
