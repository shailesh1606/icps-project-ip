package com.icps.auth.Repository;

import com.icps.auth.Model.PolicyHolder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PolicyHolderRepository extends MongoRepository<PolicyHolder, String> {
    Optional<PolicyHolder> findByEmail(String email);
}
