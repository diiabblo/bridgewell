;; Bridge Vault Contract
;; Secure custody of bridged assets

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INSUFFICIENT-FUNDS (err u101))

(define-map vault-balances principal uint)

(define-public (deposit (amount uint))
  (let ((current-balance (default-to u0 (map-get? vault-balances tx-sender))))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set vault-balances tx-sender (+ current-balance amount))
    (ok true)
  )
)

(define-public (withdraw (amount uint))
  (let ((current-balance (default-to u0 (map-get? vault-balances tx-sender))))
    (asserts! (>= current-balance amount) ERR-INSUFFICIENT-FUNDS)
    (try! (as-contract (stx-transfer? amount tx-sender CONTRACT-OWNER)))
    (map-set vault-balances tx-sender (- current-balance amount))
    (ok true)
  )
)

(define-read-only (get-balance (account principal))
  (ok (default-to u0 (map-get? vault-balances account)))
)
