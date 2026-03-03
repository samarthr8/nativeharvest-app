# Change your base image to the stable Node 22 Alpine version (Alpine keeps the image lightweight)
FROM node:22-alpine 

# The rest of your Dockerfile stays exactly the same!
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]