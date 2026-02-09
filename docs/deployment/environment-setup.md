# Environment Setup

This guide covers setting up the development and production environments for BridgeWell.

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Network Configuration
VITE_NETWORK=testnet  # or 'mainnet'
VITE_STACKS_API_URL=https://api.testnet.hiro.so

# Contract Addresses (Testnet)
VITE_BRIDGE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bridge-core
VITE_TOKEN_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bridge-token

# API Configuration
VITE_BACKEND_API_URL=http://localhost:3001
VITE_INDEXER_API_URL=http://localhost:3002

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn

# Optional: IPFS
VITE_PINATA_API_KEY=your_pinata_key
VITE_PINATA_SECRET_KEY=your_pinata_secret
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development  # or 'production'

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/bridgewell
REDIS_URL=redis://localhost:6379

# Stacks Configuration
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bridge-core

# Bitcoin Configuration
BITCOIN_NETWORK=testnet
BITCOIN_RPC_URL=http://localhost:18332
BITCOIN_RPC_USER=your_rpc_user
BITCOIN_RPC_PASSWORD=your_rpc_password

# Security
JWT_SECRET=your_secure_jwt_secret_here
API_KEY=your_api_key_here

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info  # debug, info, warn, error
```

### Smart Contract Environment

Create `Clarinet.toml` configuration:

```toml
[project]
name = "bridgewell"
description = "BridgeWell smart contracts"
authors = ["BridgeWell Team"]
telemetry = true
cache_dir = ".clarinet/cache"
requirements = []

[contracts.bridge-core]
path = "contracts/bridge-core.clar"
clarity_version = 2

[contracts.bridge-token]
path = "contracts/bridge-token.clar"
clarity_version = 2

[repl.analysis]
passes = ["check_checker"]

[repl.analysis.check_checker]
strict = false
trusted_sender = false
trusted_caller = false
callee_filter = false
```

## Network Configurations

### Testnet Configuration

```typescript
// config/networks.ts
export const TESTNET_CONFIG = {
  network: 'testnet',
  stacksApi: 'https://api.testnet.hiro.so',
  stacksExplorer: 'https://explorer.stacks.co',
  bitcoinNetwork: 'testnet',
  chainId: 2147483648,
  contracts: {
    bridgeCore: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bridge-core',
    bridgeToken: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bridge-token',
  },
};
```

### Mainnet Configuration

```typescript
export const MAINNET_CONFIG = {
  network: 'mainnet',
  stacksApi: 'https://api.hiro.so',
  stacksExplorer: 'https://explorer.stacks.co',
  bitcoinNetwork: 'mainnet',
  chainId: 1,
  contracts: {
    bridgeCore: 'SP000000000000000000002Q6VF78.bridge-core',
    bridgeToken: 'SP000000000000000000002Q6VF78.bridge-token',
  },
};
```

## Database Setup

### PostgreSQL Setup

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Create Database**
   ```bash
   # Create database
   createdb bridgewell
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE bridgewell;
   CREATE USER bridgewell_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE bridgewell TO bridgewell_user;
   ```

3. **Run Migrations**
   ```bash
   cd backend
   npm run migrate
   ```

### Redis Setup

1. **Install Redis**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server
   
   # macOS
   brew install redis
   ```

2. **Start Redis**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start redis
   
   # macOS
   brew services start redis
   ```

3. **Verify Redis**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

## Docker Setup (Recommended)

### Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: bridgewell
      POSTGRES_USER: bridgewell_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://bridgewell_user:your_password@postgres:5432/bridgewell
      - REDIS_URL=redis://redis:6379
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

### Start Services

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Local Development Setup

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install contract dependencies
cd ../contracts
npm install
```

### Start Development Servers

```bash
# Terminal 1: Start Clarinet console
cd contracts
clarinet console

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start frontend
cd frontend
npm run dev
```

## Environment Validation

Create a validation script `scripts/validate-env.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredEnvVars = {
  frontend: [
    'VITE_NETWORK',
    'VITE_STACKS_API_URL',
    'VITE_BRIDGE_CONTRACT_ADDRESS',
  ],
  backend: [
    'PORT',
    'DATABASE_URL',
    'STACKS_NETWORK',
    'JWT_SECRET',
  ],
};

function validateEnv(dir, vars) {
  const envPath = path.join(process.cwd(), dir, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error(`❌ Missing .env file in ${dir}`);
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = vars.filter(v => !envContent.includes(v));
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing variables in ${dir}/.env:`, missingVars);
    return false;
  }
  
  console.log(`✅ ${dir} environment validated`);
  return true;
}

const frontendValid = validateEnv('frontend', requiredEnvVars.frontend);
const backendValid = validateEnv('backend', requiredEnvVars.backend);

if (frontendValid && backendValid) {
  console.log('\n✅ All environments configured correctly!');
  process.exit(0);
} else {
  console.log('\n❌ Environment validation failed');
  process.exit(1);
}
```

Run validation:

```bash
node scripts/validate-env.js
```

## Next Steps

After setting up your environment, proceed to:
- [Smart Contract Deployment](./contract-deployment.md)
- [Frontend Deployment](./frontend-deployment.md)
