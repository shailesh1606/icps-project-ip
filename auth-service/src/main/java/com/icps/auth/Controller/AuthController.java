package com.icps.auth.Controller;

import com.icps.auth.Model.PolicyHolder;
import com.icps.auth.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public PolicyHolder register(@RequestBody PolicyHolder policyHolder) {
        return authService.register(policyHolder);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return authService.login(email, password);
    }
}
