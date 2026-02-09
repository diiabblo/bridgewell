# Deployment Quick Reference

Quick reference guide for common deployment commands and configurations.

## Environment Setup

```bash
# Clone repository
git clone https://github.com/diiabblo/bridgewell.git
cd bridgewell

# Install all dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

## Contract Deployment

### Testnet

```bash
# Deploy to testnet
cd contracts
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Mainnet

```bash
# Deploy to mainnet
cd contracts
clarinet deployments generate --mainnet
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

## Frontend Deployment

### Development

```bash
cd frontend
npm run dev
# Opens at http://localhost:3000
```

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

### Deploy to Vercel

```bash
cd frontend
vercel --prod
```

### Deploy to Netlify

```bash
cd frontend
netlify deploy --prod
```

## Backend Deployment

### Development

```bash
cd backend
npm run dev
```

### Production

```bash
cd backend
npm run build
npm start
```

### Docker

```bash
# Build image
docker build -t bridgewell-backend ./backend

# Run container
docker run -d -p 3001:3001 bridgewell-backend
```

### PM2

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs
```

## Database Commands

### Setup

```bash
# Create database
createdb bridgewell

# Run migrations
cd backend
npm run migrate:up
```

### Backup

```bash
# Backup database
pg_dump bridgewell > backup.sql

# Restore
psql bridgewell < backup.sql
```

## Common Environment Variables

### Frontend (.env)

```bash
VITE_NETWORK=testnet
VITE_STACKS_API_URL=https://api.testnet.hiro.so
VITE_BRIDGE_CONTRACT_ADDRESS=ST1XXX.bridge-core
VITE_BACKEND_API_URL=http://localhost:3001
```

### Backend (.env)

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/bridgewell
REDIS_URL=redis://localhost:6379
STACKS_NETWORK=testnet
JWT_SECRET=your_secret_here
```

## Monitoring Commands

### Check Status

```bash
# Backend API
curl http://localhost:3001/health

# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping
```

### View Logs

```bash
# Application logs
tail -f logs/app.log

# Nginx
tail -f /var/log/nginx/access.log

# Docker
docker logs -f bridgewell-api

# PM2
pm2 logs bridgewell-api
```

## Troubleshooting

### Clear Cache

```bash
# npm
npm cache clean --force

# Docker
docker system prune -a

# Redis
redis-cli FLUSHALL
```

### Restart Services

```bash
# Nginx
sudo systemctl restart nginx

# PostgreSQL
sudo systemctl restart postgresql

# Docker containers
docker-compose restart

# PM2
pm2 restart all
```

## SSL/TLS

### Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d bridgewell.io -d www.bridgewell.io

# Renew
sudo certbot renew
```

## Performance

### Build Optimization

```bash
# Analyze bundle
cd frontend
npm run build
npm run analyze
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_user_id ON transactions(user_id);

-- Vacuum
VACUUM ANALYZE;
```

## Security

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update
npm update

# Security audit
npm audit
npm audit fix
```

### Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

## Useful Commands Reference

| Task | Command |
|------|---------|
| Check Node version | `node --version` |
| Check npm version | `npm --version` |
| Install Clarinet | `curl -L https://www.hiro.so/clarinet/install \| bash` |
| Check Clarinet | `clarinet --version` |
| Test contracts | `clarinet test` |
| Check contracts | `clarinet check` |
| Docker ps | `docker ps -a` |
| Docker logs | `docker logs -f <container>` |
| PM2 status | `pm2 status` |
| PM2 restart | `pm2 restart <app>` |
| Nginx test | `sudo nginx -t` |
| Nginx reload | `sudo systemctl reload nginx` |
| PostgreSQL status | `sudo systemctl status postgresql` |
| Redis status | `sudo systemctl status redis` |
| Check disk space | `df -h` |
| Check memory | `free -m` |
| Check CPU | `top` |

## Network Endpoints

### Testnet

- Stacks API: `https://api.testnet.hiro.so`
- Stacks Explorer: `https://explorer.stacks.co/?chain=testnet`
- Faucet: `https://explorer.stacks.co/sandbox/faucet?chain=testnet`

### Mainnet

- Stacks API: `https://api.hiro.so`
- Stacks Explorer: `https://explorer.stacks.co`

## Contract Addresses (Testnet)

Update these with your deployed contracts:

```typescript
export const CONTRACTS = {
  bridgeCore: 'ST1XXX.bridge-core',
  bridgeToken: 'ST1XXX.bridge-token',
  bridgeVault: 'ST1XXX.bridge-vault',
  bridgeRegistry: 'ST1XXX.bridge-registry',
};
```

## CI/CD Pipeline Trigger

```bash
# Push to trigger deployment
git add .
git commit -m "Deploy to production"
git push origin main
```

## Emergency Procedures

### Rollback Deployment

```bash
# Vercel
vercel rollback

# Docker
docker-compose down
docker-compose up -d --build <old_version>

# PM2
pm2 reload ecosystem.config.js
```

### Database Restore

```bash
# Stop application
pm2 stop all

# Restore from backup
psql bridgewell < backup_20230101.sql

# Restart application
pm2 restart all
```

This quick reference provides immediate access to the most commonly used commands and configurations.
