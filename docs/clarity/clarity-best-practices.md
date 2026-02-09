# Clarity Best Practices

## Security

1. Always validate inputs
2. Use assertions for access control
3. Prevent re-entrancy with proper ordering
4. Test edge cases thoroughly

## Code Organization

```clarity
;; Constants first
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))

;; Data variables
(define-data-var counter uint u0)

;; Data maps
(define-map balances principal uint)

;; Private functions
(define-private (is-owner)
  (is-eq tx-sender CONTRACT-OWNER)
)

;; Public functions
(define-public (increment)
  (begin
    (asserts! (is-owner) ERR-NOT-AUTHORIZED)
    (ok (var-set counter (+ (var-get counter) u1)))
  )
)

;; Read-only functions
(define-read-only (get-counter)
  (ok (var-get counter))
)
```

## Gas Optimization

- Minimize storage operations
- Use let bindings efficiently
- Avoid unnecessary computations
