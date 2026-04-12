package com.icps.policyclaim.Controller;

import com.icps.policyclaim.Model.Policy;
import com.icps.policyclaim.Service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @GetMapping("/my")
    public List<Policy> getMyPolicies(Authentication authentication) {
        String policyHolderId = (String) authentication.getPrincipal();
        return policyService.getPoliciesByHolder(policyHolderId);
    }

    @PostMapping("/add")
    public Policy addPolicy(@RequestBody Policy policy, Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new RuntimeException("Unauthorized: Admin access required");
        }
        return policyService.addPolicy(policy);
    }
}
