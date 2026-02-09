;; Bridge Governance Contract

(define-constant CONTRACT-OWNER tx-sender)
(define-map proposals uint {proposer: principal, description: (string-ascii 256), votes-for: uint, votes-against: uint, executed: bool})
(define-map votes {proposal-id: uint, voter: principal} bool)
(define-data-var proposal-count uint u0)

(define-public (create-proposal (description (string-ascii 256)))
  (let ((id (var-get proposal-count)))
    (map-set proposals id {proposer: tx-sender, description: description, votes-for: u0, votes-against: u0, executed: false})
    (var-set proposal-count (+ id u1))
    (ok id)
  )
)

(define-public (vote (proposal-id uint) (support bool))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) (err u404))))
    (asserts! (is-none (map-get? votes {proposal-id: proposal-id, voter: tx-sender})) (err u400))
    (map-set votes {proposal-id: proposal-id, voter: tx-sender} true)
    (if support
      (map-set proposals proposal-id (merge proposal {votes-for: (+ (get votes-for proposal) u1)}))
      (map-set proposals proposal-id (merge proposal {votes-against: (+ (get votes-against proposal) u1)}))
    )
    (ok true)
  )
)
