# Security Best Practices

Security guidelines for deploying and maintaining BridgeWell.

## General Security Principles

### 1. Secure Environment Variables

```bash
# Never commit secrets to git
echo ".env*" >> .gitignore

# Use secret management services
# AWS Secrets Manager, HashiCorp Vault, etc.

# Encrypt sensitive files
gpg --encrypt .env.production
```

### 2. HTTPS/TLS Configuration

```nginx
# Force HTTPS
server {
    listen 80;
    server_name bridgewell.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bridgewell.io;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/bridgewell.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bridgewell.io/privkey.pem;
    
    # Strong SSL protocols
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### 3. API Security

```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);

// CORS configuration
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Helmet for security headers
import helmet from 'helmet';
app.use(helmet());
```

## Smart Contract Security

### Audit Checklist

- [ ] Re-entrancy protection
- [ ] Integer overflow/underflow checks
- [ ] Access control implemented
- [ ] Input validation
- [ ] Emergency pause mechanism
- [ ] Upgrade mechanism tested

### Example: Access Control

```clarity
;; Define admin
(define-data-var contract-owner principal tx-sender)

;; Admin-only modifier
(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Protected function
(define-public (admin-function)
  (begin
    (asserts! (is-contract-owner) (err u403))
    ;; Function logic
    (ok true)
  )
)
```

## Database Security

### PostgreSQL Hardening

```sql
-- Use strong passwords
ALTER USER bridgewell_user WITH PASSWORD 'very_strong_password_123!@#';

-- Limit privileges
REVOKE ALL ON DATABASE bridgewell FROM PUBLIC;
GRANT CONNECT ON DATABASE bridgewell TO bridgewell_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bridgewell_user;

-- Enable SSL
-- postgresql.conf
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'
```

### SQL Injection Prevention

```typescript
// Always use parameterized queries
import { Pool } from 'pg';

const pool = new Pool();

// Good - parameterized
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Bad - vulnerable to SQL injection
// const result = await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

## Authentication & Authorization

### JWT Implementation

```typescript
import jwt from 'jsonwebtoken';

// Generate token
function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '1h', algorithm: 'HS256' }
  );
}

// Verify token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Secrets Management

### Using HashiCorp Vault

```typescript
import vault from 'node-vault';

const client = vault({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

async function getSecret(path: string) {
  const result = await client.read(path);
  return result.data;
}

// Usage
const dbPassword = await getSecret('secret/database/password');
```

## Container Security

### Docker Security Best Practices

```dockerfile
# Use specific versions
FROM node:18.12.0-alpine

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm ci --only=production

COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose only necessary ports
EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### Scan Images for Vulnerabilities

```bash
# Using Trivy
trivy image bridgewell-backend:latest

# Using Snyk
snyk container test bridgewell-backend:latest
```

## Network Security

### Firewall Configuration (UFW)

```bash
# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow specific IPs for admin access
sudo ufw allow from 203.0.113.0/24 to any port 22

# Enable firewall
sudo ufw enable
```

## Backup & Disaster Recovery

### Database Backups

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/bridgewell_$TIMESTAMP.sql.gz"

# Create backup
pg_dump -h localhost -U bridgewell_user bridgewell | gzip > $BACKUP_FILE

# Encrypt backup
gpg --encrypt --recipient admin@bridgewell.io $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE.gpg s3://bridgewell-backups/

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "*.gz*" -mtime +30 -delete
```

### Automated Backup with Cron

```bash
# Add to crontab
0 2 * * * /usr/local/bin/backup-db.sh
```

## Incident Response Plan

### 1. Detection
- Monitor alerts
- Review logs regularly
- Set up anomaly detection

### 2. Containment
```bash
# Immediately isolate affected services
docker stop bridgewell-api

# Block suspicious IPs
sudo ufw deny from <suspicious_ip>

# Rotate compromised credentials
./scripts/rotate-secrets.sh
```

### 3. Investigation
- Collect logs
- Analyze access patterns
- Identify vulnerability

### 4. Recovery
- Restore from backup
- Patch vulnerabilities
- Redeploy services

### 5. Post-Incident
- Document incident
- Update security measures
- Conduct team review

## Security Checklist

- [ ] All secrets stored securely (not in code)
- [ ] HTTPS/TLS enabled everywhere
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Container images scanned
- [ ] Database backups automated
- [ ] Firewall rules configured
- [ ] Monitoring and alerting active
- [ ] Incident response plan documented
- [ ] Smart contracts audited

## Regular Security Maintenance

```bash
# Update dependencies weekly
npm audit
npm audit fix

# Check for outdated packages
npm outdated

# Update Docker base images
docker pull node:18-alpine

# Review access logs
tail -f /var/log/nginx/access.log | grep -E "40[134]|50[0-9]"
```
