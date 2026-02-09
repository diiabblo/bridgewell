;; Bridge Token Contract
;; SIP-010 Fungible Token for Bridge

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token bridge-token)

(define-constant CONTRACT-OWNER tx-sender)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u1))
    (try! (ft-transfer? bridge-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok "Bridge Token")
)

(define-read-only (get-symbol)
  (ok "BRDG")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance bridge-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply bridge-token))
)

(define-read-only (get-token-uri)
  (ok (some u"https://bridgewell.io/token-metadata.json"))
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) (err u100))
    (ft-mint? bridge-token amount recipient)
  )
)
