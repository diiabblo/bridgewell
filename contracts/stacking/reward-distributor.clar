;; Reward Distributor Contract
(define-map rewards principal uint)

(define-public (distribute-rewards (recipient principal) (amount uint))
  (begin
    (map-set rewards recipient amount)
    (ok true)
  )
)

(define-read-only (get-rewards (stacker principal))
  (default-to u0 (map-get? rewards stacker))
)
