;; ============================================
;; Campaign Milestones (NEW)
;; ============================================

;; Map to store milestone updates per campaign
(define-map campaign-milestones
  { campaign-id: uint, milestone-id: uint }
  { message: (string-ascii 128), timestamp: uint }
)

;; Add a milestone update
(define-public (add-milestone (campaign-id uint) (message (string-ascii 128)))
  (let ((campaign (unwrap! (map-get? campaigns { id: campaign-id }) ERR_CAMPAIGN_NOT_FOUND)))
    ;; Only owner can add
    (asserts! (is-eq tx-sender (get owner campaign)) ERR_NOT_OWNER)
    
    ;; Determine next milestone id
    (let ((next-id (+ 1 (len (filter-map (lambda (m) (is-eq (get campaign-id m) campaign-id)) campaign-milestones)))))
      (map-set campaign-milestones { campaign-id: campaign-id, milestone-id: next-id }
        { message: message, timestamp: stacks-block-height })
      (print { event: "milestone-added", campaign-id: campaign-id, milestone-id: next-id, message: message })
      (ok next-id)
    )
  )
)

;; Read-only: get all milestones for a campaign
(define-read-only (get-milestones (campaign-id uint))
  (filter-map
    (lambda (k-v) 
      (is-eq (get campaign-id (get key k-v)) campaign-id))
    campaign-milestones
  )
)
