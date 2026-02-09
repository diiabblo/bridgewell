;; Bridge Registry Contract

(define-map transactions uint {from: principal, to: (buff 20), amount: uint, timestamp: uint})
(define-data-var tx-id uint u0)

(define-public (register-transaction (from principal) (to (buff 20)) (amount uint))
  (let ((id (var-get tx-id)))
    (map-set transactions id {from: from, to: to, amount: amount, timestamp: block-height})
    (var-set tx-id (+ id u1))
    (ok id)
  )
)

(define-read-only (get-transaction (id uint))
  (map-get? transactions id)
)
