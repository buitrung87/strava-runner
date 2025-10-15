# Strava Runner - Running Club Dashboard

A full-stack web application that allows running club members to log in using their Strava accounts and view their running statistics, compete on leaderboards, and track their progress.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## 🚀 Features

### Authentication
- **Strava OAuth2 Integration**: Secure login using Strava accounts
- **JWT Token Management**: Session management with JSON Web Tokens
- **User Profile Sync**: Automatic sync of user profile data from Strava

### User Dashboard
- **Personal Statistics**: View your running activities with detailed metrics
- **Activity Filtering**: Filter by day, week, or month
- **Comprehensive Metrics**: 
  - Total distance covered
  - Total running time
  - Number of activities
  - Average distance per run
  - Pace and elevation data

### Leaderboard
- **Global Rankings**: Compete with all club members
- **Time-based Leaderboards**: Daily, weekly, and monthly rankings
- **Detailed Stats**: View distance, activities, and averages for all members

### Data Synchronization
- **Manual Sync**: On-demand sync of activities from Strava
- **Auto Sync**: Background job runs every 6 hours to keep data fresh
- **Activity Storage**: All running activities stored in PostgreSQL database

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Heroicons
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Date Formatting**: date-fns

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: Passport.js with OAuth2 strategy
- **Scheduled Jobs**: node-cron
- **Testing**: Jest + Supertest

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Migration**: Prisma Migrate
- **Environment Management**: dotenv

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Strava API Credentials**: Get them from [Strava Developers](https://www.strava.com/settings/api)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/strava-runner.git
cd strava-runner
```

### 2. Get Strava API Credentials

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Set the authorization callback domain to: `localhost` or your domain
4. Note your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your Strava credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/strava_runner?schema=public"

# Strava OAuth
STRAVA_CLIENT_ID=your_strava_client_id_here
STRAVA_CLIENT_SECRET=your_strava_client_secret_here
STRAVA_CALLBACK_URL=http://localhost:3001/auth/strava/callback

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Backend
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3001
```

### 4. Build and Run with Docker

Build the Docker images:

```bash
docker-compose build
```

Start all services:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **Backend API** on port `3001`
- **Frontend** on port `5173`

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm install
npm test
```

### Run specific test suites:

```bash
# Auth tests
npm test -- auth.test.ts

# Leaderboard tests
npm test -- leaderboard.test.ts
```

## 📁 Project Structure

```
strava-runner/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── Dockerfile
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript type definitions
│   │   └── server.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── tests/               # Jest test files
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🔑 API Endpoints

### Authentication
- `GET /auth/strava` - Initiate Strava OAuth
- `GET /auth/strava/callback` - OAuth callback
- `GET /auth/profile` - Get current user profile (requires auth)
- `POST /auth/logout` - Logout user

### Activities
- `GET /api/activities?period=month` - Get user activities (requires auth)
- `POST /api/activities/sync` - Sync activities from Strava (requires auth)

### Leaderboard
- `GET /api/leaderboard?period=month` - Get global leaderboard

## 🐳 Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild services
```bash
docker-compose up -d --build
```

### Access PostgreSQL
```bash
docker exec -it strava_postgres psql -U postgres -d strava_runner
```

## 🔄 Database Management

### Run Prisma migrations (in backend container)
```bash
docker exec -it strava_backend npx prisma migrate dev
```

### Generate Prisma client
```bash
docker exec -it strava_backend npx prisma generate
```

### View database in Prisma Studio
```bash
cd backend
npx prisma studio
```

## 🌐 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/strava_runner` |
| `STRAVA_CLIENT_ID` | Your Strava application client ID | - |
| `STRAVA_CLIENT_SECRET` | Your Strava application client secret | - |
| `STRAVA_CALLBACK_URL` | OAuth callback URL | `http://localhost:3001/auth/strava/callback` |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `PORT` | Backend server port | `3001` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `VITE_API_URL` | Backend API URL for frontend | `http://localhost:3001` |

## 🚦 Troubleshooting

### Port Already in Use
If you get port conflicts, change the ports in `docker-compose.yml`

### Strava OAuth Not Working
1. Verify your `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET`
2. Ensure the callback URL in Strava settings matches `STRAVA_CALLBACK_URL`
3. Check that the authorization callback domain is set correctly in Strava

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend Can't Connect to Backend
1. Verify `VITE_API_URL` is set correctly in `.env`
2. Ensure backend is running: `docker-compose ps`
3. Check CORS settings in backend

## 🔐 Security Considerations

- **Never commit** `.env` file to version control
- Change `JWT_SECRET` in production to a strong random value
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regularly update dependencies

## 📈 Future Enhancements

- [ ] Add cycling statistics support
- [ ] Personal goal setting and tracking
- [ ] Weekly/monthly email reports
- [ ] Activity comments and social features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and charts
- [ ] Team challenges

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

Built with ❤️ by the Strava Runner team

## 🙏 Acknowledgments

- [Strava API](https://developers.strava.com/)
- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
