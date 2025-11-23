# Stage 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm install

# Copy entire frontend source
COPY . .

# Build React project
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy React build into NGINX html folder
COPY --from=build /app/build /usr/share/nginx/html

# Add custom NGINX config for API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
