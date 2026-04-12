package com.icps.policyclaim.Repository;

import com.icps.policyclaim.Model.Claim;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClaimRepository extends MongoRepository<Claim, String> {
    List<Claim> findByPolicyHolderId(String policyHolderId);
    List<Claim> findByClaimStatus(String claimStatus);
}
