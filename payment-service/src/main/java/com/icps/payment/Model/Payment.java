package com.icps.payment.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "payments")
public class Payment {

    @Id
    private String paymentId;

    private String paymentDate;
    private double paymentAmount;
    private String paymentMode;
    private String transactionRefNo;
    private String claimId;
}
