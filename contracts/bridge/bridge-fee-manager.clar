;; Bridge Fee Manager Contract

(define-constant CONTRACT-OWNER tx-sender)
(define-data-var bridge-fee-percentage uint u100) ;; 1%
(define-map collected-fees principal uint)

(define-public (set-fee-percentage (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) (err u100))
    (asserts! (<= new-fee u1000) (err u101)) ;; Max 10%
    (var-set bridge-fee-percentage new-fee)
    (ok true)
  )
)

(define-read-only (calculate-fee (amount uint))
  (ok (/ (* amount (var-get bridge-fee-percentage)) u10000))
)

(define-read-only (get-fee-percentage)
  (ok (var-get bridge-fee-percentage))
)
