package com.icps.policyclaim.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "policies")
public class Policy {

    @Id
    private String policyId;

    private String policyNumber;
    private double coverageAmount;
    private double premiumAmount;
    private String startDate;
    private String endDate;
    private String policyHolderId;
}
