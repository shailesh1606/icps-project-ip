package com.icps.policyclaim.Service;

import com.icps.policyclaim.Model.Claim;
import com.icps.policyclaim.Repository.ClaimRepository;
import com.icps.policyclaim.Repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${payment.service.url}")
    private String paymentServiceUrl;

    public Claim submitClaim(Claim claim, String policyHolderId) {
        policyRepository.findById(claim.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        claim.setPolicyHolderId(policyHolderId);
        claim.setClaimNumber("CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        claim.setClaimDate(LocalDate.now().toString());
        claim.setClaimStatus("PENDING");
        return claimRepository.save(claim);
    }

    public List<Claim> getClaimsByHolder(String policyHolderId) {
        return claimRepository.findByPolicyHolderId(policyHolderId);
    }

    public List<Claim> getPendingClaims() {
        return claimRepository.findByClaimStatus("PENDING");
    }

    public Claim updateClaimStatus(String claimId, String status) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + claimId));

        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            throw new RuntimeException("Invalid status: must be APPROVED or REJECTED");
        }

        claim.setClaimStatus(status);
        Claim updated = claimRepository.save(claim);

        if (status.equals("APPROVED")) {
            triggerPayment(updated);
        }

        return updated;
    }

    private void triggerPayment(Claim claim) {
        Map<String, Object> paymentRequest = new HashMap<>();
        paymentRequest.put("claimId", claim.getClaimId());
        paymentRequest.put("paymentAmount", claim.getClaimAmount());
        paymentRequest.put("paymentMode", "BANK_TRANSFER");

        try {
            restTemplate.postForObject(paymentServiceUrl, paymentRequest, Map.class);
        } catch (Exception e) {
            System.err.println("Payment service call failed: " + e.getMessage());
        }
    }
}
