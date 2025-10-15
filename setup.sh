#!/bin/bash

# Strava Runner - Setup Script for Ubuntu

echo "🏃 Strava Runner Setup Script"
echo "=============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker is already installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose is already installed"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file and add your Strava API credentials:"
    echo "   - STRAVA_CLIENT_ID"
    echo "   - STRAVA_CLIENT_SECRET"
    echo "   - JWT_SECRET (use a strong random string)"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
else
    echo "✅ .env file exists"
fi

# Build Docker images
echo ""
echo "🔨 Building Docker images..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✅ Docker images built successfully"
else
    echo "❌ Failed to build Docker images"
    exit 1
fi

# Start services
echo ""
echo "🚀 Starting services..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Services started successfully"
else
    echo "❌ Failed to start services"
    exit 1
fi

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001"
echo "   Database: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo ""
echo "🎉 Happy running!"
