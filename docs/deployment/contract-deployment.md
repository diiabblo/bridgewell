# Smart Contract Deployment

This guide covers deploying BridgeWell smart contracts to Stacks blockchain.

## Contract Overview

BridgeWell consists of the following smart contracts:

1. **bridge-core.clar** - Main bridge functionality
2. **bridge-token.clar** - Token management
3. **bridge-vault.clar** - Asset custody
4. **bridge-registry.clar** - Transaction registry

## Pre-Deployment Checklist

- [ ] All contracts pass `clarinet check`
- [ ] All tests pass `clarinet test`
- [ ] Security audit completed (for mainnet)
- [ ] Deployment wallet has sufficient STX
- [ ] Network configuration verified
- [ ] Backup deployment keys secured

## Testnet Deployment

### Method 1: Using Clarinet CLI (Recommended)

1. **Initialize Deployment Configuration**

```bash
cd contracts

# Generate deployment plan
clarinet deployments generate --testnet

# This creates: deployments/default.testnet-plan.yaml
```

2. **Configure Deployment Plan**

Edit `deployments/default.testnet-plan.yaml`:

```yaml
---
id: 0
name: BridgeWell Testnet Deployment
network: testnet
stacks-node: "https://api.testnet.hiro.so"
bitcoin-node: "http://blockstack:blockstacksystem@bitcoin.testnet.hiro.so:18332"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: bridge-token
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 5000
            path: contracts/bridge-token.clar
            clarity-version: 2
        - contract-publish:
            contract-name: bridge-core
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 10000
            path: contracts/bridge-core.clar
            clarity-version: 2
```

3. **Apply Deployment**

```bash
# Set up your deployment wallet
export STACKS_PRIVATE_KEY="your_testnet_private_key"

# Apply the deployment
clarinet deployments apply -p deployments/default.testnet-plan.yaml --testnet

# Monitor deployment
clarinet deployments status
```

### Method 2: Using Hiro Platform

1. **Access Hiro Platform**
   - Visit [platform.hiro.so](https://platform.hiro.so)
   - Connect your Stacks wallet
   - Switch to testnet

2. **Deploy Contracts**
   - Click "Deploy Contract"
   - Upload contract file or paste code
   - Set contract name
   - Review gas costs
   - Confirm deployment

3. **Verify Deployment**
   - Check transaction in [Stacks Explorer](https://explorer.stacks.co/?chain=testnet)
   - Note contract address

### Method 3: Using Stacks CLI

```bash
# Install Stacks CLI
npm install -g @stacks/cli

# Deploy contract
stacks deploy contract \
  --name bridge-core \
  --contract-file contracts/bridge-core.clar \
  --network testnet \
  --private-key your_private_key

# Verify
stacks get-contract-info \
  --address ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM \
  --contract bridge-core \
  --network testnet
```

## Mainnet Deployment

### Security Pre-Deployment

1. **Code Freeze**
   ```bash
   # Create deployment tag
   git tag -a v1.0.0-mainnet -m "Mainnet deployment v1.0.0"
   git push origin v1.0.0-mainnet
   ```

2. **Final Security Audit**
   - Complete professional security audit
   - Address all findings
   - Get audit report signed off

3. **Dry Run on Testnet**
   ```bash
   # Deploy to testnet first
   clarinet deployments apply -p deployments/default.testnet-plan.yaml
   
   # Test all functionality
   npm run test:integration
   ```

### Mainnet Deployment Steps

1. **Prepare Mainnet Configuration**

```bash
# Generate mainnet deployment plan
clarinet deployments generate --mainnet

# Edit deployments/default.mainnet-plan.yaml
```

2. **Fund Deployment Wallet**

Calculate required STX:
- Contract deployment: ~0.5-2 STX per contract
- Buffer for gas: 10 STX
- Total recommended: 20 STX

```bash
# Check wallet balance
stacks balance ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

3. **Execute Mainnet Deployment**

```bash
# CRITICAL: Verify you're on mainnet
export STACKS_NETWORK=mainnet
export STACKS_PRIVATE_KEY="your_mainnet_private_key"

# Final check
clarinet check

# Deploy
clarinet deployments apply -p deployments/default.mainnet-plan.yaml --mainnet

# Monitor
watch -n 5 'stacks get-contract-info --address YOUR_ADDRESS --contract bridge-core'
```

4. **Post-Deployment Verification**

```bash
# Verify all contracts deployed
./scripts/verify-deployment.sh mainnet

# Test contract calls
npm run test:mainnet:smoke
```

## Contract Initialization

After deployment, initialize contracts:

```bash
# Initialize bridge core
stacks call-contract \
  --contract-address SP000000000000000000002Q6VF78 \
  --contract-name bridge-core \
  --function-name initialize \
  --function-args '0x01' \
  --network mainnet \
  --private-key your_key

# Set admin
stacks call-contract \
  --contract-address SP000000000000000000002Q6VF78 \
  --contract-name bridge-core \
  --function-name set-admin \
  --function-args 'SP2ADMIN_ADDRESS_HERE' \
  --network mainnet \
  --private-key your_key
```

## Upgradeability

BridgeWell contracts are upgradeable through a proxy pattern.

### Deploy New Version

```bash
# Deploy new implementation
clarinet deploy contracts/bridge-core-v2.clar --name bridge-core-v2

# Update proxy to point to new implementation
stacks call-contract \
  --contract-address SP000000000000000000002Q6VF78 \
  --contract-name bridge-proxy \
  --function-name upgrade-to \
  --function-args 'SP000000000000000000002Q6VF78.bridge-core-v2' \
  --network mainnet \
  --private-key your_admin_key
```

## Deployment Verification Script

Create `scripts/verify-deployment.sh`:

```bash
#!/bin/bash

NETWORK=$1
CONTRACT_ADDRESS=$2

echo "Verifying deployment on $NETWORK..."

# Check each contract
contracts=("bridge-core" "bridge-token" "bridge-vault" "bridge-registry")

for contract in "${contracts[@]}"; do
    echo "Checking $contract..."
    
    result=$(stacks get-contract-info \
        --address $CONTRACT_ADDRESS \
        --contract $contract \
        --network $NETWORK 2>&1)
    
    if [[ $result == *"error"* ]]; then
        echo "❌ $contract not found"
        exit 1
    else
        echo "✅ $contract deployed successfully"
    fi
done

echo "✅ All contracts verified!"
```

Run verification:

```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh testnet ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

## Cost Estimation

| Contract | Estimated Cost (STX) | Gas Limit |
|----------|---------------------|-----------|
| bridge-core | 1.5 - 2.0 | 500,000 |
| bridge-token | 0.5 - 1.0 | 200,000 |
| bridge-vault | 1.0 - 1.5 | 300,000 |
| bridge-registry | 0.5 - 1.0 | 200,000 |
| **Total** | **3.5 - 5.5** | **1,200,000** |

## Troubleshooting

### Contract Deployment Failed

```bash
# Check wallet balance
stacks balance YOUR_ADDRESS --network testnet

# Verify contract compiles
clarinet check

# Check network status
curl https://api.testnet.hiro.so/v2/info
```

### Transaction Stuck

```bash
# Check transaction status
curl https://api.testnet.hiro.so/extended/v1/tx/YOUR_TX_ID

# If stuck, try broadcasting again with higher fee
stacks broadcast \
  --tx-file deployment-tx.json \
  --fee-rate 2.0 \
  --network testnet
```

### Wrong Contract Deployed

```bash
# Contracts are immutable - deploy a new version
clarinet deploy contracts/bridge-core.clar --name bridge-core-v2

# Update proxy to point to new version
```

## Next Steps

After deploying contracts:
- [Frontend Deployment](./frontend-deployment.md)
- [Backend Services](./backend-deployment.md)
- [Monitoring Setup](./monitoring.md)
