# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Baked into the built bundle at compile time.
ARG VITE_API_BASE_URL=https://api.its-akki.com/api/
ARG VITE_API_TOKEN=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_API_TOKEN=$VITE_API_TOKEN
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
