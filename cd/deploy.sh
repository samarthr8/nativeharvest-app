#!/bin/bash
set -e

IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
  echo "Usage: ./deploy.sh <image-tag>"
  exit 1
fi

export IMAGE_TAG=$IMAGE_TAG

echo "Deploying NativeHarvest with image tag: $IMAGE_TAG"

docker compose pull
docker compose up -d

docker image prune -f
