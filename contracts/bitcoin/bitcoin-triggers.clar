;; Bitcoin Block Triggers
(define-map bitcoin-blocks uint {hash: (buff 32), height: uint, timestamp: uint})

(define-public (register-bitcoin-block (height uint) (hash (buff 32)))
  (begin
    (map-set bitcoin-blocks height {hash: hash, height: height, timestamp: block-height})
    (ok true)
  )
)
