# Clarity Security Guidelines

## Common Vulnerabilities

### 1. Unchecked Arithmetic

```clarity
;; Bad - can overflow
(define-public (bad-add (a uint) (b uint))
  (ok (+ a b))
)

;; Good - use checked arithmetic
(define-public (safe-add (a uint) (b uint))
  (match (to-uint (+ (to-int a) (to-int b)))
    result (ok result)
    (err u1)
  )
)
```

### 2. Missing Access Control

```clarity
;; Bad - anyone can call
(define-public (withdraw-all)
  (ok (stx-transfer? (stx-get-balance (as-contract tx-sender)) (as-contract tx-sender) tx-sender))
)

;; Good - owner only
(define-public (withdraw-all)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) (err u403))
    (as-contract (stx-transfer? (stx-get-balance tx-sender) tx-sender CONTRACT-OWNER))
  )
)
```

## Security Checklist

- [ ] All public functions have access control
- [ ] Input validation on all parameters
- [ ] No arithmetic overflows
- [ ] Proper error handling
- [ ] No re-entrancy vulnerabilities
- [ ] Post-conditions defined
