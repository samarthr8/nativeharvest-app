FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# COPY STATIC IMAGES EXPLICITLY
COPY public/images /usr/share/nginx/html/images

# Create non-root user and adjust permissions
RUN addgroup -g 1001 -S nginx-app && adduser -S nginx-app -u 1001 && \
    chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx-app:nginx-app /var/run/nginx.pid

USER nginx-app

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
