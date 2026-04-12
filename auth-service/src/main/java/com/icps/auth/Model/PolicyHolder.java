package com.icps.auth.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "policyholders")
public class PolicyHolder {

    @Id
    private String policyHolderId;

    private String name;
    private String email;
    private String password;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String aadhaarNo;
    private String dob;
    private String gender;
    private String role;
}
