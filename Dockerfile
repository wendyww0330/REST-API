# ---------------------------------------------------------------------------
# Multi-stage build. Stage 1 compiles TypeScript; stage 2 ships only what's
# needed to run. Interview talking point: smaller final image, no dev deps or
# source in production.
# ---------------------------------------------------------------------------

# --- Stage 1: build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Stage 2: runtime ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
