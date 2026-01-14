# Health Counters Dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S counters -u 1001 && \
    apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY --chown=counters:nodejs . .

# Environment variables with defaults
ENV NODE_ENV=production
ENV PORT=8011
ENV PERSON_NAME="John Doe"
ENV HEALTHY_START_DATE="2024-01-01"
ENV DOCTOR_START_DATE="2024-01-15"
ENV TRUST_PROXY=false

# Expose port
EXPOSE 8011

# Switch to non-root user
USER counters

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8011/health || exit 1

# Start the application
CMD ["npm", "start"]