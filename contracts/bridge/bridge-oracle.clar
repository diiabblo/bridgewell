;; Bridge Oracle Contract

(define-constant CONTRACT-OWNER tx-sender)
(define-map oracle-data (buff 32) {value: uint, timestamp: uint, verified: bool})

(define-public (submit-oracle-data (key (buff 32)) (value uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) (err u100))
    (map-set oracle-data key {value: value, timestamp: block-height, verified: true})
    (ok true)
  )
)

(define-read-only (get-oracle-data (key (buff 32)))
  (map-get? oracle-data key)
)
