# Clarity Testing Guide

## Test Structure

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet/index.ts';

Clarinet.test({
  name: "Test description",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    // Test logic here
  },
});
```

## Common Test Patterns

### Testing Public Functions

```typescript
Clarinet.test({
  name: "Can transfer tokens",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'token',
        'transfer',
        [
          types.uint(100),
          types.principal(wallet1.address),
          types.principal(wallet2.address)
        ],
        wallet1.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
  },
});
```

## Assertions

```typescript
// Response assertions
receipt.result.expectOk();
receipt.result.expectErr();

// Type assertions
receipt.result.expectBool(true);
receipt.result.expectUint(100);
receipt.result.expectPrincipal(address);

// Event assertions
receipt.events.expectFungibleTokenTransferEvent();
```
