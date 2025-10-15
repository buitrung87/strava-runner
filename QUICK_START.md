# Quick Start Guide

Get Strava Runner up and running in 5 minutes!

## TL;DR

```bash
# 1. Clone and navigate
git clone https://github.com/yourusername/strava-runner.git
cd strava-runner

# 2. Set up environment
cp .env.example .env
# Edit .env with your Strava credentials

# 3. Start with Docker
docker-compose up -d

# 4. Open browser
# http://localhost:5173
```

## Detailed Steps

### 1. Get Strava API Keys

Visit: https://www.strava.com/settings/api
- Create an app
- Note your Client ID and Client Secret
- Set callback domain to: `localhost`

### 2. Configure Application

```bash
cp .env.example .env
```

Edit `.env` and add:
```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
JWT_SECRET=any_random_string_here
```

### 3. Launch

```bash
docker-compose up -d
```

Wait 30 seconds for services to start.

### 4. Access

Open: http://localhost:5173

Click "Connect with Strava" and authorize!

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build
```

## Troubleshooting

**Can't connect to Strava?**
- Check your credentials in `.env`
- Verify callback domain is `localhost` in Strava settings

**Port in use?**
- Change ports in `docker-compose.yml`

**Database errors?**
```bash
docker-compose restart postgres
```

That's it! 🎉
