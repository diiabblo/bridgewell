;; Bridge Core Contract
;; Main bridge functionality for cross-chain transfers

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-AMOUNT (err u101))
(define-constant ERR-TRANSFER-FAILED (err u102))

(define-data-var bridge-active bool true)
(define-data-var min-bridge-amount uint u1000)

(define-map pending-transfers 
  uint 
  {
    sender: principal,
    recipient: (buff 20),
    amount: uint,
    status: (string-ascii 20)
  }
)

(define-data-var transfer-nonce uint u0)

(define-public (initiate-bridge-transfer (amount uint) (recipient (buff 20)))
  (let ((nonce (var-get transfer-nonce)))
    (asserts! (var-get bridge-active) ERR-NOT-AUTHORIZED)
    (asserts! (>= amount (var-get min-bridge-amount)) ERR-INVALID-AMOUNT)
    (map-set pending-transfers nonce {
      sender: tx-sender,
      recipient: recipient,
      amount: amount,
      status: "pending"
    })
    (var-set transfer-nonce (+ nonce u1))
    (ok nonce)
  )
)

(define-read-only (get-transfer (id uint))
  (map-get? pending-transfers id)
)
