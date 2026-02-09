# Clarity Basics

## Data Types

### Primitive Types

```clarity
;; Integers (unsigned)
(define-constant MAX-VALUE u1000)

;; Integers (signed)
(define-constant OFFSET 42)

;; Booleans
(define-constant IS-ACTIVE true)

;; Principals (addresses)
(define-constant ADMIN 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Strings (ASCII)
(define-constant NAME "BridgeWell")

;; Strings (UTF-8)
(define-data-var greeting (string-utf8 50) u"Hello")
```

### Complex Types

```clarity
;; Tuples
(define-constant USER {
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM,
  balance: u1000,
  active: true
})

;; Lists
(define-constant ADMINS 
  (list
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
    'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
  )
)

;; Optional
(define-read-only (get-value (key uint))
  (map-get? storage key)
)

;; Response
(define-public (transfer (amount uint))
  (ok true) ;; or (err u1)
)
```

## Functions

### Read-Only Functions

```clarity
(define-read-only (get-balance (account principal))
  (default-to u0 (map-get? balances account))
)
```

### Public Functions

```clarity
(define-public (transfer (to principal) (amount uint))
  (let ((sender-balance (get-balance tx-sender)))
    (asserts! (>= sender-balance amount) (err u1))
    (map-set balances tx-sender (- sender-balance amount))
    (map-set balances to (+ (get-balance to) amount))
    (ok true)
  )
)
```

### Private Functions

```clarity
(define-private (is-admin (caller principal))
  (is-some (index-of ADMINS caller))
)
```

## Control Flow

```clarity
;; if statement
(if (> amount u100)
  (ok "Large amount")
  (ok "Small amount")
)

;; asserts
(asserts! (is-admin tx-sender) (err u403))

;; match for optionals
(match (map-get? users user-id)
  user (ok user)
  (err u404)
)

;; try for responses
(try! (transfer recipient amount))
```
