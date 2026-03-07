FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["npm", "start"]
