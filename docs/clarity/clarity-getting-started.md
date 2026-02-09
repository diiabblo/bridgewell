# Getting Started with Clarity

This guide will help you set up your Clarity development environment and write your first smart contract.

## Environment Setup

### Install Clarinet

Clarinet is the primary tool for Clarity development.

```bash
# macOS and Linux
curl -L https://www.hiro.so/clarinet/install | bash

# Verify installation
clarinet --version
```

### Create Your First Project

```bash
# Create new project
clarinet new hello-world
cd hello-world

# Project structure created:
# ├── Clarinet.toml
# ├── contracts/
# ├── settings/
# ├── tests/
# └── .gitignore
```

## Your First Contract

### Create a Contract

```bash
clarinet contract new hello-contract
```

This creates `contracts/hello-contract.clar`:

```clarity
;; hello-contract
;; A simple greeting contract

(define-data-var greeting (string-utf8 100) u"Hello, World!")

(define-read-only (get-greeting)
  (ok (var-get greeting))
)

(define-public (set-greeting (new-greeting (string-utf8 100)))
  (begin
    (var-set greeting new-greeting)
    (ok true)
  )
)
```

### Check Your Contract

```bash
# Syntax check
clarinet check

# Should output: ✔ 1 contract checked
```

## Testing Your Contract

Create `tests/hello-contract_test.ts`:

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can get default greeting",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('hello-contract', 'get-greeting', [], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk().expectUtf8('Hello, World!');
  },
});

Clarinet.test({
  name: "Can set new greeting",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const newGreeting = "Hello, Clarity!";
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'hello-contract',
        'set-greeting',
        [types.utf8(newGreeting)],
        deployer.address
      ),
      Tx.contractCall('hello-contract', 'get-greeting', [], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectUtf8(newGreeting);
  },
});
```

### Run Tests

```bash
clarinet test

# Output:
# running 2 tests
# test hello-contract::can_get_default_greeting ... ok
# test hello-contract::can_set_new_greeting ... ok
```

## Interactive Development

### Clarinet Console

```bash
clarinet console

# Interactive REPL opens
```

Try these commands:

```clarity
;; Get the greeting
(contract-call? .hello-contract get-greeting)
;; Returns: (ok u"Hello, World!")

;; Set a new greeting
(contract-call? .hello-contract set-greeting u"Hi there!")
;; Returns: (ok true)

;; Verify the change
(contract-call? .hello-contract get-greeting)
;; Returns: (ok u"Hi there!")
```

## Understanding the Code

### Data Variables

```clarity
(define-data-var greeting (string-utf8 100) u"Hello, World!")
```

- `define-data-var` - Creates a mutable variable
- `greeting` - Variable name
- `(string-utf8 100)` - Type (UTF-8 string, max 100 chars)
- `u"Hello, World!"` - Initial value

### Read-Only Functions

```clarity
(define-read-only (get-greeting)
  (ok (var-get greeting))
)
```

- `define-read-only` - Creates a read-only function
- `get-greeting` - Function name
- `var-get` - Gets the value of a variable
- `ok` - Returns success response

### Public Functions

```clarity
(define-public (set-greeting (new-greeting (string-utf8 100)))
  (begin
    (var-set greeting new-greeting)
    (ok true)
  )
)
```

- `define-public` - Creates a public function (can modify state)
- Parameters: `(new-greeting (string-utf8 100))`
- `var-set` - Sets a new value
- `begin` - Executes multiple expressions

## Deployment

### Deploy to Testnet

1. Update `settings/Devnet.toml`:

```toml
[accounts.deployer]
mnemonic = "your mnemonic here"
```

2. Generate deployment plan:

```bash
clarinet deployments generate --testnet
```

3. Deploy:

```bash
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

## Next Steps

Now that you have your first contract running:

1. Learn about [Clarity Basics](./clarity-basics.md)
2. Explore [Advanced Concepts](./clarity-advanced.md)
3. Review [Best Practices](./clarity-best-practices.md)

## Common Issues

### Contract Check Fails

```bash
# Error: Expression not recognized
```

**Solution**: Check syntax, ensure proper parentheses matching

### Test Fails

```bash
# Error: Contract not found
```

**Solution**: Ensure contract name matches in Clarinet.toml

### Deployment Fails

```bash
# Error: Insufficient balance
```

**Solution**: Get testnet STX from faucet

## Quick Reference

```clarity
;; Comments start with semicolon

;; Define constant
(define-constant MAX_SUPPLY u1000000)

;; Define variable
(define-data-var counter uint u0)

;; Define map
(define-map balances principal uint)

;; Read-only function
(define-read-only (get-counter)
  (var-get counter)
)

;; Public function
(define-public (increment)
  (ok (var-set counter (+ (var-get counter) u1)))
)

;; Private function
(define-private (is-owner)
  (is-eq tx-sender contract-owner)
)
```

Continue to the next section to dive deeper into Clarity!
