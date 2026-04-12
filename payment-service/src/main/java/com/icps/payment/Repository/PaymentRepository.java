package com.icps.payment.Repository;

import com.icps.payment.Model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByClaimId(String claimId);
}
