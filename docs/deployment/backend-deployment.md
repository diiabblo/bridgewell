# Backend Services Deployment

This guide covers deploying BridgeWell backend services including API servers and indexers.

## Architecture Overview

BridgeWell backend consists of:

1. **API Server** - REST API for frontend
2. **Indexer Service** - Blockchain event indexing
3. **Worker Service** - Background job processing
4. **WebSocket Server** - Real-time updates

## Production Build

```bash
cd backend

# Install production dependencies only
npm ci --production

# Build TypeScript
npm run build

# The compiled output will be in 'dist' folder
```

## Environment Configuration

Create `.env.production`:

```bash
# Server
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@postgres.bridgewell.io:5432/bridgewell
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_SSL=true

# Redis
REDIS_URL=redis://redis.bridgewell.io:6379
REDIS_PASSWORD=your_redis_password
REDIS_TLS=true

# Stacks Blockchain
STACKS_NETWORK=mainnet
STACKS_API_URL=https://api.hiro.so
CONTRACT_ADDRESSES=SP000000000000000000002Q6VF78.bridge-core,SP000000000000000000002Q6VF78.bridge-token

# Bitcoin
BITCOIN_NETWORK=mainnet
BITCOIN_RPC_URL=https://bitcoin-rpc.bridgewell.io
BITCOIN_RPC_USER=rpcuser
BITCOIN_RPC_PASSWORD=rpcpassword

# Security
JWT_SECRET=your_very_secure_jwt_secret_min_32_chars
API_KEY_SALT=your_api_key_salt_min_32_chars
CORS_ORIGINS=https://bridgewell.io,https://www.bridgewell.io

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
LOG_LEVEL=info
ENABLE_METRICS=true
METRICS_PORT=9090

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment Methods

### Method 1: Docker Deployment (Recommended)

1. **Create Dockerfile**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

2. **Build Image**

```bash
# Build
docker build -t bridgewell-backend:latest ./backend

# Tag for registry
docker tag bridgewell-backend:latest registry.bridgewell.io/backend:latest

# Push to registry
docker push registry.bridgewell.io/backend:latest
```

3. **Deploy with Docker Compose**

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    image: registry.bridgewell.io/backend:latest
    container_name: bridgewell-api
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  indexer:
    image: registry.bridgewell.io/backend:latest
    container_name: bridgewell-indexer
    restart: unless-stopped
    command: ["node", "dist/indexer.js"]
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  worker:
    image: registry.bridgewell.io/backend:latest
    container_name: bridgewell-worker
    restart: unless-stopped
    command: ["node", "dist/worker.js"]
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14-alpine
    container_name: bridgewell-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: bridgewell
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    container_name: bridgewell-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    container_name: bridgewell-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

4. **Deploy**

```bash
# Load environment variables
source .env.production

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

### Method 2: Kubernetes Deployment

1. **Create Deployment**

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bridgewell-api
  namespace: bridgewell
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bridgewell-api
  template:
    metadata:
      labels:
        app: bridgewell-api
    spec:
      containers:
      - name: api
        image: registry.bridgewell.io/backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: bridgewell-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: bridgewell-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

2. **Create Service**

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: bridgewell-api
  namespace: bridgewell
spec:
  selector:
    app: bridgewell-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: LoadBalancer
```

3. **Create Secrets**

```bash
# Create namespace
kubectl create namespace bridgewell

# Create secrets
kubectl create secret generic bridgewell-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=redis-url='redis://...' \
  --from-literal=jwt-secret='your-secret' \
  -n bridgewell
```

4. **Deploy**

```bash
# Apply configurations
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check deployment
kubectl get pods -n bridgewell
kubectl get services -n bridgewell

# View logs
kubectl logs -f deployment/bridgewell-api -n bridgewell

# Scale
kubectl scale deployment bridgewell-api --replicas=5 -n bridgewell
```

### Method 3: PM2 Deployment

1. **Install PM2**

```bash
npm install -g pm2
```

2. **Create Ecosystem File**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'bridgewell-api',
      script: 'dist/index.js',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'bridgewell-indexer',
      script: 'dist/indexer.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'bridgewell-worker',
      script: 'dist/worker.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

3. **Deploy**

```bash
# Start services
pm2 start ecosystem.config.js

# Save configuration
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 monit

# Logs
pm2 logs

# Restart
pm2 restart all

# Stop
pm2 stop all
```

## Database Migrations

```bash
# Run migrations
npm run migrate:up

# Rollback if needed
npm run migrate:down

# Check migration status
npm run migrate:status
```

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/bridgewell-api
upstream api_backend {
    least_conn;
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    server_name api.bridgewell.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.bridgewell.io;

    ssl_certificate /etc/ssl/certs/bridgewell.crt;
    ssl_certificate_key /etc/ssl/private/bridgewell.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        access_log off;
        proxy_pass http://api_backend;
    }
}
```

## SSL/TLS Setup

```bash
# Using Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d api.bridgewell.io

# Auto-renewal
sudo certbot renew --dry-run

# Add to cron
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## Monitoring & Health Checks

```typescript
// src/health.ts
import express from 'express';

const healthRouter = express.Router();

healthRouter.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  res.status(200).json(health);
});

healthRouter.get('/ready', async (req, res) => {
  try {
    // Check database
    await db.query('SELECT 1');
    
    // Check Redis
    await redis.ping();
    
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

export default healthRouter;
```

## Next Steps

- [Monitoring & Logging](./monitoring.md)
- [Security Best Practices](./security.md)
