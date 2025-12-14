FROM node:18-alpine AS builder

WORKDIR /app

COPY backend/fitservice/package*.json ./
RUN npm ci --only=production

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY backend/fitservice/src ./src
COPY backend/fitservice/public ./public

EXPOSE 8087

USER node

CMD ["node", "src/server.js"]

