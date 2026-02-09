;; Stacking Pool Contract
(define-map pool-members principal uint)
(define-data-var total-pooled uint u0)

(define-public (join-pool (amount uint))
  (begin
    (map-set pool-members tx-sender amount)
    (var-set total-pooled (+ (var-get total-pooled) amount))
    (ok true)
  )
)
