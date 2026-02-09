;; Block Monitor
(define-data-var last-btc-block uint u0)

(define-public (update-last-block (height uint))
  (begin
    (var-set last-btc-block height)
    (ok true)
  )
)

(define-read-only (get-last-block)
  (ok (var-get last-btc-block))
)
