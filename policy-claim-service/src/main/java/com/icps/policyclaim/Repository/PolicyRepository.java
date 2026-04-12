package com.icps.policyclaim.Repository;

import com.icps.policyclaim.Model.Policy;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PolicyRepository extends MongoRepository<Policy, String> {
    List<Policy> findByPolicyHolderId(String policyHolderId);
}
