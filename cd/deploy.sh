#!/bin/bash
set -e

IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
  echo "Image tag not provided"
  exit 1
fi

echo "Deploying NativeHarvest with image tag: $IMAGE_TAG"

cd /opt/nativeharvest

# Save current tag for rollback
PREV_TAG=""
if [ -f .last_deployed_tag ]; then
  PREV_TAG=$(cat .last_deployed_tag)
fi

export IMAGE_TAG=$IMAGE_TAG

echo "Stopping existing containers..."
docker compose down || true

echo "Pulling latest images..."
docker compose pull

echo "Starting containers..."
docker compose up -d

# Health check with retries
echo "Verifying deployment health..."
MAX_RETRIES=10
RETRY_INTERVAL=6
HEALTHY=false

for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
    HEALTHY=true
    echo "Health check passed (attempt $i/$MAX_RETRIES)"
    break
  fi
  echo "Waiting for backend to be healthy... ($i/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

if [ "$HEALTHY" = false ]; then
  echo "Deployment health check failed! Rolling back..."

  if [ -n "$PREV_TAG" ]; then
    export IMAGE_TAG=$PREV_TAG
    docker compose down || true
    docker compose pull
    docker compose up -d
    echo "Rolled back to previous tag: $PREV_TAG"
  else
    echo "No previous tag available for rollback"
  fi

  exit 1
fi

# Save successful tag for future rollback
echo "$IMAGE_TAG" > .last_deployed_tag

echo "Cleaning unused Docker resources..."
docker image prune -f || true
docker container prune -f || true
docker builder prune -af || true

echo "Deployment completed successfully"
