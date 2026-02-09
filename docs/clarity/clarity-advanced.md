# Advanced Clarity Concepts

## Cross-Contract Calls

```clarity
(define-public (call-external-contract)
  (contract-call? .other-contract function-name param1 param2)
)
```

## Traits

```clarity
(define-trait token-trait
  (
    (transfer (principal principal uint) (response bool uint))
    (get-balance (principal) (response uint uint))
  )
)
```

## Bitcoin Integration

```clarity
(define-read-only (get-btc-block-hash (height uint))
  (get-block-info? header-hash height)
)
```
