;; Delegation Manager
(define-map delegations {delegator: principal, delegate: principal} uint)

(define-public (delegate-stack (delegate principal) (amount uint))
  (begin
    (map-set delegations {delegator: tx-sender, delegate: delegate} amount)
    (ok true)
  )
)
