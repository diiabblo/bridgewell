;; Stacking Configuration
(define-data-var min-cycles uint u1)
(define-data-var max-cycles uint u12)
(define-constant MIN-AMOUNT u100000000)

(define-read-only (get-min-cycles) (ok (var-get min-cycles)))
(define-read-only (get-max-cycles) (ok (var-get max-cycles)))
