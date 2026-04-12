package com.icps.policyclaim.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "claims")
public class Claim {

    @Id
    private String claimId;

    private String claimNumber;
    private String claimDate;
    private double claimAmount;
    private String claimStatus;
    private String policyId;
    private String policyHolderId;
    private String description;
}
