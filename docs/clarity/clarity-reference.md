# Clarity Quick Reference

## Keywords

- `define-constant` - Define constant
- `define-data-var` - Define mutable variable
- `define-map` - Define key-value storage
- `define-fungible-token` - Define fungible token
- `define-non-fungible-token` - Define NFT
- `define-public` - Define public function
- `define-private` - Define private function
- `define-read-only` - Define read-only function
- `define-trait` - Define trait interface

## Built-in Functions

### Arithmetic
- `+`, `-`, `*`, `/` - Basic math
- `pow` - Power
- `sqrti` - Square root
- `mod` - Modulo

### Comparison
- `>`, `<`, `>=`, `<=` - Comparison
- `is-eq` - Equality check
- `is-some` - Optional check
- `is-ok` - Response check

### Data
- `var-get`, `var-set` - Variable operations
- `map-get?`, `map-set`, `map-delete`, `map-insert` - Map operations
- `ft-transfer?` - Transfer fungible tokens
- `nft-mint?`, `nft-transfer?` - NFT operations

### Control Flow
- `if` - Conditional
- `begin` - Sequential execution
- `let` - Local bindings
- `match` - Pattern matching
- `asserts!` - Assertion
- `try!` - Early return on error
- `unwrap!` - Unwrap optional/response
