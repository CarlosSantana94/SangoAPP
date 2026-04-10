# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build for production
COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Serve ────────────────────────────────────────────
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app

# Copy only the built output
COPY --from=builder /app/www .

ENV PORT=3000
EXPOSE 3000

# -s = SPA mode (redirects 404 → index.html for Angular routing)
CMD ["/bin/sh", "-c", "serve -s . -l ${PORT}"]
