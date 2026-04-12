package com.icps.auth.Service;

import com.icps.auth.Config.JwtUtil;
import com.icps.auth.Model.PolicyHolder;
import com.icps.auth.Repository.PolicyHolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private PolicyHolderRepository policyHolderRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public PolicyHolder register(PolicyHolder policyHolder) {
        if (policyHolderRepository.findByEmail(policyHolder.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        policyHolder.setPassword(passwordEncoder.encode(policyHolder.getPassword()));
        if (policyHolder.getRole() == null || policyHolder.getRole().isEmpty()) {
            policyHolder.setRole("POLICYHOLDER");
        }
        return policyHolderRepository.save(policyHolder);
    }

    public Map<String, String> login(String email, String password) {
        PolicyHolder policyHolder = policyHolderRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, policyHolder.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(policyHolder.getPolicyHolderId(), policyHolder.getRole());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("policyHolderId", policyHolder.getPolicyHolderId());
        response.put("name", policyHolder.getName());
        response.put("role", policyHolder.getRole());
        return response;
    }
}
