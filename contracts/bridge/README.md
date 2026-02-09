# Bridge Smart Contracts

## Overview

This directory contains the core smart contracts for the BridgeWell cross-chain bridge.

## Contracts

1. **bridge-core.clar** - Main bridge functionality
2. **bridge-token.clar** - SIP-010 token implementation
3. **bridge-vault.clar** - Asset custody and management
4. **bridge-registry.clar** - Transaction tracking
5. **bridge-oracle.clar** - Cross-chain data verification
6. **bridge-fee-manager.clar** - Fee calculation and management
7. **bridge-governance.clar** - Decentralized governance

## Deployment

```bash
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

## Testing

```bash
clarinet test
```
