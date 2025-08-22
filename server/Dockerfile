# ---- Build stage ----
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# ---- Production stage ----
FROM node:22-slim AS prod

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

# Generate Prisma client for prod
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

