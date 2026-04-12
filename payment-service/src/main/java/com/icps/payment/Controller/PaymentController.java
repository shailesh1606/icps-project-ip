package com.icps.payment.Controller;

import com.icps.payment.Model.Payment;
import com.icps.payment.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public Payment createPayment(@RequestBody Map<String, Object> request) {
        return paymentService.createPayment(request);
    }

    @GetMapping("/claim/{claimId}")
    public Payment getPaymentByClaimId(@PathVariable String claimId) {
        return paymentService.getPaymentByClaimId(claimId);
    }
}
