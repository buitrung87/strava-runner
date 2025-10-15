# Strava Runner - Complete Setup Guide for Ubuntu

This guide will walk you through setting up the Strava Runner application on Ubuntu using Docker.

## Prerequisites

- Ubuntu 20.04 or later
- Internet connection
- Strava account
- Root or sudo access

## Step 1: Get Strava API Credentials

1. Go to https://www.strava.com/settings/api
2. Click "Create App" or use an existing app
3. Fill in the required information:
   - **Application Name**: Your app name (e.g., "My Running Club")
   - **Category**: Choose an appropriate category
   - **Club**: Optional
   - **Website**: http://localhost:5173
   - **Authorization Callback Domain**: localhost
4. Click "Create"
5. Note down your **Client ID** and **Client Secret**

## Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/strava-runner.git

# Navigate to the project directory
cd strava-runner
```

## Step 3: Install Docker and Docker Compose

### Option A: Use the Setup Script (Recommended)

```bash
# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

The script will:
- Install Docker if not present
- Install Docker Compose if not present
- Create .env file from template
- Build Docker images
- Start all services

### Option B: Manual Installation

#### Install Docker

```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

#### Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## Step 4: Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit the `.env` file:

```bash
nano .env
```

Update the following values:

```env
# Replace with your Strava credentials
STRAVA_CLIENT_ID=your_actual_client_id
STRAVA_CLIENT_SECRET=your_actual_client_secret

# Generate a strong random secret for JWT
JWT_SECRET=your_very_strong_random_secret_here
```

To generate a strong JWT secret, you can use:

```bash
openssl rand -base64 32
```

Save and close the file (Ctrl+X, then Y, then Enter in nano).

## Step 5: Build and Start the Application

```bash
# Build Docker images
docker-compose build

# Start all services in detached mode
docker-compose up -d
```

## Step 6: Verify Services are Running

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

You should see three services running:
- `strava_postgres` - Database
- `strava_backend` - API Server
- `strava_frontend` - Web Interface

## Step 7: Access the Application

Open your web browser and navigate to:

```
http://localhost:5173
```

You should see the Strava Runner home page.

## Step 8: Test the Application

1. Click "Connect with Strava" on the home page
2. You'll be redirected to Strava for authorization
3. Click "Authorize" to grant access
4. You'll be redirected back to the dashboard
5. Click "Sync from Strava" to import your activities
6. Navigate to "Leaderboard" to see rankings

## Common Issues and Solutions

### Issue: Port already in use

**Solution**: Change the ports in `docker-compose.yml`

```yaml
# For frontend
ports:
  - "5174:5173"  # Change 5174 to any available port

# For backend
ports:
  - "3002:3001"  # Change 3002 to any available port
```

Don't forget to update `.env` file accordingly.

### Issue: Can't connect to Strava

**Solution**: 
1. Verify your `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` in `.env`
2. Check that authorization callback domain in Strava settings is `localhost`
3. Make sure `STRAVA_CALLBACK_URL` in `.env` is `http://localhost:3001/auth/strava/callback`

### Issue: Database connection error

**Solution**:
```bash
# Restart PostgreSQL container
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue: Frontend shows "Network Error"

**Solution**:
```bash
# Check if backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

## Managing the Application

### Stop all services

```bash
docker-compose down
```

### Start services

```bash
docker-compose up -d
```

### Restart a specific service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Update the application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Backup database

```bash
# Create backup
docker exec strava_postgres pg_dump -U postgres strava_runner > backup.sql

# Restore backup
docker exec -i strava_postgres psql -U postgres strava_runner < backup.sql
```

## Advanced Configuration

### Running on a Server (with Domain)

1. Update `.env`:
```env
FRONTEND_URL=https://your-domain.com
STRAVA_CALLBACK_URL=https://your-domain.com/api/auth/strava/callback
VITE_API_URL=https://your-domain.com/api
```

2. Update Strava settings:
   - Authorization Callback Domain: `your-domain.com`

3. Set up a reverse proxy (Nginx):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Set up SSL with Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Performance Optimization

### Increase Database Performance

Edit `docker-compose.yml` and add to postgres service:

```yaml
postgres:
  command: postgres -c shared_buffers=256MB -c max_connections=200
```

### Production Build

For production, create optimized builds:

```bash
# Build frontend for production
cd frontend
npm run build

# Serve with a production server like Nginx
```

## Security Recommendations

1. **Change default passwords**: Update PostgreSQL password in production
2. **Use strong JWT secret**: Generate with `openssl rand -base64 32`
3. **Enable HTTPS**: Use SSL certificates in production
4. **Firewall rules**: Only expose necessary ports
5. **Regular updates**: Keep Docker images and dependencies updated
6. **Backup regularly**: Set up automated database backups

## Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all services are running: `docker-compose ps`
4. Review the troubleshooting section in README.md

## Next Steps

- Invite club members to join
- Set up regular activity syncs
- Monitor the leaderboard
- Plan challenges and competitions

Happy running! 🏃‍♂️🏃‍♀️
