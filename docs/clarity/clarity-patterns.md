# Common Clarity Patterns

## Access Control Pattern

```clarity
(define-constant CONTRACT-OWNER tx-sender)

(define-private (is-authorized)
  (is-eq tx-sender CONTRACT-OWNER)
)

(define-public (admin-function)
  (begin
    (asserts! (is-authorized) (err u403))
    (ok true)
  )
)
```

## Token Pattern (SIP-010)

```clarity
(define-fungible-token my-token)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u401))
    (try! (ft-transfer? my-token amount sender recipient))
    (ok true)
  )
)
```

## Registry Pattern

```clarity
(define-map registry uint {owner: principal, data: (string-ascii 256)})
(define-data-var next-id uint u1)

(define-public (register (data (string-ascii 256)))
  (let ((id (var-get next-id)))
    (map-set registry id {owner: tx-sender, data: data})
    (var-set next-id (+ id u1))
    (ok id)
  )
)
```
