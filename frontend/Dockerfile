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

# ✅ COPY STATIC IMAGES EXPLICITLY
COPY public/images /usr/share/nginx/html/images

