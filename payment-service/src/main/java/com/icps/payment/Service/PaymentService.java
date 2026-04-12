package com.icps.payment.Service;

import com.icps.payment.Model.Payment;
import com.icps.payment.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(Map<String, Object> request) {
        Payment payment = new Payment();
        payment.setClaimId((String) request.get("claimId"));
        payment.setPaymentAmount(Double.parseDouble(request.get("paymentAmount").toString()));
        payment.setPaymentMode(request.getOrDefault("paymentMode", "BANK_TRANSFER").toString());
        payment.setPaymentDate(LocalDate.now().toString());
        payment.setTransactionRefNo("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByClaimId(String claimId) {
        return paymentRepository.findByClaimId(claimId)
                .orElseThrow(() -> new RuntimeException("Payment not found for claimId: " + claimId));
    }
}
