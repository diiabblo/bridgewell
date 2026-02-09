;; Trigger Registry
(define-map triggers uint principal)
(define-data-var trigger-count uint u0)

(define-public (register-trigger (contract-principal principal))
  (let ((id (var-get trigger-count)))
    (map-set triggers id contract-principal)
    (var-set trigger-count (+ id u1))
    (ok id)
  )
)
