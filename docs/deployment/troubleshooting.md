# Troubleshooting Guide

Common issues and solutions for BridgeWell deployment.

## Table of Contents

- [Contract Deployment Issues](#contract-deployment-issues)
- [Frontend Issues](#frontend-issues)
- [Backend Issues](#backend-issues)
- [Database Issues](#database-issues)
- [Network Issues](#network-issues)
- [Performance Issues](#performance-issues)

## Contract Deployment Issues

### Issue: Contract Deployment Fails

**Symptoms:**
```
Error: Transaction failed with status: abort
```

**Possible Causes & Solutions:**

1. **Insufficient STX Balance**
   ```bash
   # Check balance
   stacks balance YOUR_ADDRESS --network testnet
   
   # Get testnet STX from faucet
   # Visit: https://explorer.stacks.co/sandbox/faucet?chain=testnet
   ```

2. **Invalid Clarity Syntax**
   ```bash
   # Run syntax check
   clarinet check
   
   # Review error output and fix syntax errors
   ```

3. **Gas Limit Too Low**
   ```bash
   # Increase gas limit in deployment config
   # Edit: deployments/default.testnet-plan.yaml
   cost: 10000  # Increase this value
   ```

### Issue: Contract Already Exists

**Symptoms:**
```
Error: Contract already exists
```

**Solution:**
```bash
# Deploy with different name
clarinet deploy contracts/bridge-core.clar --name bridge-core-v2

# Or deploy from different address
export STACKS_PRIVATE_KEY="different_key"
```

### Issue: Contract Call Fails

**Symptoms:**
```
Error: Runtime error while interpreting
```

**Debug Steps:**
```bash
# Test in Clarinet console
clarinet console

# In console, test function:
(contract-call? .bridge-core your-function-name)

# Check function requirements and parameters
```

## Frontend Issues

### Issue: Wallet Connection Fails

**Symptoms:**
- Wallet popup doesn't appear
- Connection timeout

**Solutions:**

1. **Clear Browser Cache**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Check Wallet Extension**
   - Ensure wallet is installed and unlocked
   - Verify correct network (testnet/mainnet)
   - Try different wallet (Leather vs Xverse)

3. **CORS Issues**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       cors: true,
       proxy: {
         '/api': {
           target: 'http://localhost:3001',
           changeOrigin: true,
         },
       },
     },
   });
   ```

### Issue: Build Fails

**Symptoms:**
```
Error: Module not found
```

**Solutions:**

1. **Clean Install**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node Version**
   ```bash
   node --version  # Should be 18.x or higher
   nvm use 18
   ```

3. **Environment Variables**
   ```bash
   # Ensure all required env vars are set
   cat .env.production
   
   # Verify VITE_ prefix
   VITE_API_URL=...  # Correct
   API_URL=...       # Won't work in Vite
   ```

### Issue: Page Loads Blank

**Symptoms:**
- White screen after deployment
- No errors in production

**Debug:**

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network tab for failed requests

2. **Check Base Path**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/',  // or '/app/' if deployed in subdirectory
   });
   ```

3. **Verify Build Output**
   ```bash
   # Check dist folder
   ls -la dist/
   
   # Verify index.html exists
   cat dist/index.html
   ```

## Backend Issues

### Issue: Cannot Connect to Database

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Check PostgreSQL Service**
   ```bash
   # Check if running
   sudo systemctl status postgresql
   
   # Start if stopped
   sudo systemctl start postgresql
   
   # Check if accepting connections
   psql -U postgres -c "SELECT 1"
   ```

2. **Verify Connection String**
   ```bash
   # Check DATABASE_URL format
   postgresql://username:password@host:port/database
   
   # Test connection
   psql "postgresql://user:pass@localhost:5432/bridgewell"
   ```

3. **Check Firewall**
   ```bash
   # Allow PostgreSQL port
   sudo ufw allow 5432/tcp
   
   # Check if port is open
   nc -zv localhost 5432
   ```

### Issue: High Memory Usage

**Symptoms:**
- Server becomes unresponsive
- Out of memory errors

**Solutions:**

1. **Check Memory Usage**
   ```bash
   # Monitor processes
   top
   
   # Check Node.js process
   ps aux | grep node
   ```

2. **Increase Memory Limit**
   ```bash
   # Set Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" node dist/index.js
   ```

3. **Optimize Queries**
   ```typescript
   // Use pagination
   const results = await db.query(
     'SELECT * FROM transactions LIMIT $1 OFFSET $2',
     [limit, offset]
   );
   
   // Use connection pooling
   const pool = new Pool({
     max: 20,
     idleTimeoutMillis: 30000,
   });
   ```

### Issue: API Requests Timeout

**Symptoms:**
```
Error: Request timeout after 30000ms
```

**Solutions:**

1. **Increase Timeout**
   ```typescript
   // Express timeout
   app.use((req, res, next) => {
     req.setTimeout(60000); // 60 seconds
     next();
   });
   ```

2. **Add Request Queuing**
   ```typescript
   import Queue from 'bull';
   
   const requestQueue = new Queue('api-requests', {
     redis: { host: 'localhost', port: 6379 }
   });
   
   // Process requests asynchronously
   requestQueue.process(async (job) => {
     return await processRequest(job.data);
   });
   ```

## Database Issues

### Issue: Migration Fails

**Symptoms:**
```
Error: relation "users" already exists
```

**Solutions:**

1. **Check Migration Status**
   ```bash
   npm run migrate:status
   ```

2. **Rollback and Retry**
   ```bash
   npm run migrate:down
   npm run migrate:up
   ```

3. **Manual Fix**
   ```sql
   -- Connect to database
   psql -U postgres bridgewell
   
   -- Check existing tables
   \dt
   
   -- Drop problematic table if needed
   DROP TABLE users;
   
   -- Re-run migration
   ```

### Issue: Slow Queries

**Symptoms:**
- API responses take > 1 second
- Database CPU usage high

**Solutions:**

1. **Add Indexes**
   ```sql
   -- Check slow queries
   SELECT query, mean_exec_time 
   FROM pg_stat_statements 
   ORDER BY mean_exec_time DESC 
   LIMIT 10;
   
   -- Add indexes
   CREATE INDEX idx_transactions_user_id ON transactions(user_id);
   CREATE INDEX idx_transactions_created_at ON transactions(created_at);
   ```

2. **Analyze Query Plans**
   ```sql
   EXPLAIN ANALYZE 
   SELECT * FROM transactions WHERE user_id = '123';
   ```

3. **Optimize Queries**
   ```sql
   -- Use specific columns instead of SELECT *
   SELECT id, amount, status FROM transactions;
   
   -- Add limits
   SELECT * FROM transactions LIMIT 100;
   ```

## Network Issues

### Issue: SSL Certificate Errors

**Symptoms:**
```
Error: certificate has expired
```

**Solutions:**

1. **Renew Certificate**
   ```bash
   # Let's Encrypt renewal
   sudo certbot renew
   
   # Force renewal
   sudo certbot renew --force-renewal
   
   # Restart nginx
   sudo systemctl restart nginx
   ```

2. **Verify Certificate**
   ```bash
   # Check expiration
   echo | openssl s_client -servername bridgewell.io -connect bridgewell.io:443 2>/dev/null | openssl x509 -noout -dates
   ```

### Issue: CORS Errors

**Symptoms:**
```
Access to fetch at 'https://api.bridgewell.io' has been blocked by CORS policy
```

**Solutions:**

1. **Configure CORS Properly**
   ```typescript
   app.use(cors({
     origin: ['https://bridgewell.io', 'https://www.bridgewell.io'],
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     credentials: true,
   }));
   ```

2. **Nginx Configuration**
   ```nginx
   add_header 'Access-Control-Allow-Origin' '$http_origin' always;
   add_header 'Access-Control-Allow-Credentials' 'true' always;
   add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
   add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
   ```

## Performance Issues

### Issue: Slow Page Load

**Symptoms:**
- First contentful paint > 3s
- Time to interactive > 5s

**Solutions:**

1. **Code Splitting**
   ```typescript
   // Lazy load routes
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const Profile = lazy(() => import('./pages/Profile'));
   
   <Suspense fallback={<Loading />}>
     <Routes>
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/profile" element={<Profile />} />
     </Routes>
   </Suspense>
   ```

2. **Optimize Images**
   ```bash
   # Use imagemin
   npm install imagemin imagemin-webp
   
   # Convert to WebP
   imagemin images/* --out-dir=images/optimized --plugin=webp
   ```

3. **Enable Caching**
   ```typescript
   // Service Worker caching
   // public/sw.js
   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request).then((response) => {
         return response || fetch(event.request);
       })
     );
   });
   ```

## Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm start

# Frontend
VITE_DEBUG=true npm run dev

# Database
# postgresql.conf
log_statement = 'all'
log_duration = on
```

## Getting Help

If issues persist:

1. Check logs:
   ```bash
   # Application logs
   tail -f logs/app.log
   
   # Nginx logs
   tail -f /var/log/nginx/error.log
   
   # System logs
   journalctl -u bridgewell-api -f
   ```

2. Create issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

3. Join Discord for community support
