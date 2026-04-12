package com.icps.policyclaim.Service;

import com.icps.policyclaim.Model.Policy;
import com.icps.policyclaim.Repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    public List<Policy> getPoliciesByHolder(String policyHolderId) {
        return policyRepository.findByPolicyHolderId(policyHolderId);
    }

    public Policy addPolicy(Policy policy) {
        if (policy.getPolicyNumber() == null || policy.getPolicyNumber().isEmpty()) {
            policy.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        return policyRepository.save(policy);
    }

    public Policy getPolicyById(String policyId) {
        return policyRepository.findById(policyId)
                .orElseThrow(() -> new RuntimeException("Policy not found: " + policyId));
    }
}
