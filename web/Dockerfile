# ---- Stage 1: Build frontend ----
FROM oven/bun:1 AS builder
WORKDIR /app

# Install ALL dependencies (including devDeps for vite/tsc)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build the React SPA → dist/
RUN bun run build

# ---- Stage 2: Production runtime ----
FROM oven/bun:1-slim
WORKDIR /app

# Install production dependencies only
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy server source (Bun runs TypeScript directly)
COPY server ./server

# Copy static content
COPY content ./content

ENV NODE_ENV=production

# Railway injects PORT at runtime; default to 3001
EXPOSE 3001

CMD ["bun", "run", "server/index.ts"]
