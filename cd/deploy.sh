#!/bin/bash
set -e

IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
  echo "❌ Image tag not provided"
  exit 1
fi

echo "🚀 Deploying NativeHarvest with image tag: $IMAGE_TAG"

export IMAGE_TAG=$IMAGE_TAG

cd /opt/nativeharvest

echo "🛑 Stopping existing containers (if any)..."
docker compose down || true

echo "📥 Pulling latest images..."
docker compose pull

echo "▶️ Starting containers..."
docker compose up -d

echo "Cleaning unused Docker resources..."

echo "🧹 Pruning unused Docker images..."
# Remove unused images
docker image prune -f || true

echo "🧹 Pruning unused Docker containers..."
# Remove stopped containers
docker container prune -f || true

echo "🧹 Pruning unused Docker volumes..."
# Remove unused volumes
docker volume prune -f || true

echo "🧹 Pruning unused Docker build cache..."
# Remove build cache
docker builder prune -af || true

echo "Cleanup complete."

echo "✅ Deployment completed successfully"