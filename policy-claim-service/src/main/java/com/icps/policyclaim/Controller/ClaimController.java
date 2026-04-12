package com.icps.policyclaim.Controller;

import com.icps.policyclaim.Model.Claim;
import com.icps.policyclaim.Service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/claims")
@CrossOrigin(origins = "*")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @PostMapping("/submit")
    public Claim submitClaim(@RequestBody Claim claim, Authentication authentication) {
        String policyHolderId = (String) authentication.getPrincipal();
        return claimService.submitClaim(claim, policyHolderId);
    }

    @GetMapping("/my")
    public List<Claim> getMyClaims(Authentication authentication) {
        String policyHolderId = (String) authentication.getPrincipal();
        return claimService.getClaimsByHolder(policyHolderId);
    }

    @GetMapping("/pending")
    public List<Claim> getPendingClaims(Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new RuntimeException("Unauthorized: Admin access required");
        }
        return claimService.getPendingClaims();
    }

    @PatchMapping("/{claimId}/status")
    public Claim updateClaimStatus(@PathVariable String claimId,
                                   @RequestBody Map<String, String> body,
                                   Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            throw new RuntimeException("Unauthorized: Admin access required");
        }
        String status = body.get("claimStatus");
        return claimService.updateClaimStatus(claimId, status);
    }
}
