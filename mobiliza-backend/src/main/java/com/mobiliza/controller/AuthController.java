package com.mobiliza.controller;

import com.mobiliza.dto.ForgotPasswordRequest;
import com.mobiliza.dto.LoginRequest;
import com.mobiliza.dto.RegisterRequest;
import com.mobiliza.dto.ResetPasswordRequest;
import com.mobiliza.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {
        return ResponseEntity.ok(authService.esqueciSenha(request.getEmail()));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        return ResponseEntity.ok(
                authService.redefinirSenha(
                        request.getEmail(),
                        request.getCodigo(),
                        request.getNovaSenha()
                )
        );
    }
}