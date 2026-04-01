# ---- Stage 1: Build frontend ----
FROM oven/bun:latest AS builder
WORKDIR /app

# Install ALL dependencies (including devDeps for vite/tsc)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build the server + React SPA → dist-server/ + dist/
RUN bun run build

# ---- Stage 2: Production runtime ----
FROM oven/bun:latest
WORKDIR /app

# Install production dependencies only
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy compiled server output
COPY --from=builder /app/dist-server ./dist-server

ENV NODE_ENV=production

# Railway injects PORT at runtime; default to 3001
EXPOSE 3001

CMD ["bun", "dist-server/index.js"]
