;; Dual Stacking Contract
;; Allows stacking both STX and BTC simultaneously

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-AMOUNT (err u101))
(define-constant ERR-ALREADY-STACKED (err u102))

(define-data-var min-stacking-amount uint u100000000) ;; 100 STX

(define-map stacked-amounts principal {stx-amount: uint, btc-amount: uint, cycle: uint})

(define-public (stack-dual (stx-amount uint) (btc-amount uint) (pox-addr (tuple (version (buff 1)) (hashbytes (buff 32)))))
  (begin
    (asserts! (>= stx-amount (var-get min-stacking-amount)) ERR-INVALID-AMOUNT)
    (asserts! (is-none (map-get? stacked-amounts tx-sender)) ERR-ALREADY-STACKED)
    (map-set stacked-amounts tx-sender {stx-amount: stx-amount, btc-amount: btc-amount, cycle: block-height})
    (ok true)
  )
)

(define-read-only (get-stacked-amount (stacker principal))
  (map-get? stacked-amounts stacker)
)
