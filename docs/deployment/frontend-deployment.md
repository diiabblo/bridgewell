# Frontend Deployment

This guide covers deploying the BridgeWell frontend application.

## Build Configuration

### Production Build

1. **Update Environment Variables**

Create `.env.production`:

```bash
# Network
VITE_NETWORK=mainnet
VITE_STACKS_API_URL=https://api.hiro.so

# Deployed Contract Addresses
VITE_BRIDGE_CORE_CONTRACT=SP000000000000000000002Q6VF78.bridge-core
VITE_BRIDGE_TOKEN_CONTRACT=SP000000000000000000002Q6VF78.bridge-token
VITE_BRIDGE_VAULT_CONTRACT=SP000000000000000000002Q6VF78.bridge-vault

# API Endpoints
VITE_BACKEND_API_URL=https://api.bridgewell.io
VITE_INDEXER_API_URL=https://indexer.bridgewell.io

# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Feature Flags
VITE_ENABLE_TESTNET=false
VITE_ENABLE_WALLET_CONNECT=true
```

2. **Build the Application**

```bash
cd frontend

# Install dependencies
npm ci

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# The build output will be in the 'dist' folder
```

3. **Verify Build**

```bash
# Serve locally to test
npm run preview

# Check build size
du -sh dist/

# Verify all assets
ls -lah dist/assets/
```

## Deployment Platforms

### Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Configure Vercel**

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_NETWORK": "mainnet",
    "VITE_STACKS_API_URL": "https://api.hiro.so"
  }
}
```

3. **Deploy**

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_BRIDGE_CORE_CONTRACT production
vercel env add VITE_BACKEND_API_URL production
```

4. **Custom Domain**

```bash
# Add custom domain
vercel domains add bridgewell.io
vercel domains add www.bridgewell.io

# Verify DNS
vercel domains verify bridgewell.io
```

### Netlify

1. **Install Netlify CLI**

```bash
npm install -g netlify-cli
```

2. **Configure Netlify**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"
```

3. **Deploy**

```bash
cd frontend

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_BRIDGE_CORE_CONTRACT "SP000000000000000000002Q6VF78.bridge-core"
```

### AWS S3 + CloudFront

1. **Create S3 Bucket**

```bash
# Create bucket
aws s3 mb s3://bridgewell-frontend

# Enable static website hosting
aws s3 website s3://bridgewell-frontend \
  --index-document index.html \
  --error-document index.html
```

2. **Configure Bucket Policy**

Create `s3-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bridgewell-frontend/*"
    }
  ]
}
```

Apply policy:

```bash
aws s3api put-bucket-policy \
  --bucket bridgewell-frontend \
  --policy file://s3-policy.json
```

3. **Upload Build**

```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://bridgewell-frontend \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

4. **Setup CloudFront**

```bash
# Create distribution
aws cloudfront create-distribution \
  --origin-domain-name bridgewell-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### Docker Deployment

1. **Create Dockerfile**

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **Create Nginx Configuration**

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Build and Run**

```bash
# Build Docker image
docker build -t bridgewell-frontend:latest ./frontend

# Run container
docker run -d \
  -p 80:80 \
  --name bridgewell-frontend \
  bridgewell-frontend:latest

# Or use docker-compose
docker-compose up -d frontend
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run tests
        working-directory: ./frontend
        run: npm test
      
      - name: Build
        working-directory: ./frontend
        env:
          VITE_NETWORK: mainnet
          VITE_BRIDGE_CORE_CONTRACT: ${{ secrets.BRIDGE_CORE_CONTRACT }}
          VITE_BACKEND_API_URL: ${{ secrets.BACKEND_API_URL }}
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:18-alpine
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/dist
    expire_in: 1 hour

test:
  stage: test
  image: node:18-alpine
  script:
    - cd frontend
    - npm ci
    - npm run test
    - npm run lint

deploy:production:
  stage: deploy
  image: node:18-alpine
  only:
    - main
  script:
    - cd frontend
    - npm install -g vercel
    - vercel --prod --token=$VERCEL_TOKEN
  environment:
    name: production
    url: https://bridgewell.io
```

## Performance Optimization

### Build Optimization

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          stacks: ['@stacks/connect', '@stacks/transactions'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### CDN Configuration

```bash
# Use CDN for static assets
VITE_CDN_URL=https://cdn.bridgewell.io

# In vite.config.ts
base: process.env.VITE_CDN_URL || '/',
```

## Post-Deployment Verification

```bash
# Check deployment
curl -I https://bridgewell.io

# Verify assets load
curl https://bridgewell.io/assets/index.js

# Test API connectivity
curl https://bridgewell.io/api/health

# Check SSL certificate
openssl s_client -connect bridgewell.io:443 -servername bridgewell.io
```

## Monitoring

Setup monitoring:

```javascript
// src/monitoring.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_NETWORK,
  tracesSampleRate: 1.0,
});
```

## Next Steps

- [Backend Deployment](./backend-deployment.md)
- [Monitoring Setup](./monitoring.md)
