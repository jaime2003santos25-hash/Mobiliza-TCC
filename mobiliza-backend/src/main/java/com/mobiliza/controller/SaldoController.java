package com.mobiliza.controller;

import com.mobiliza.dto.SaldoResponse;
import com.mobiliza.model.Usuario;
import com.mobiliza.service.SaldoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saldos")
@RequiredArgsConstructor
public class SaldoController {

    private final SaldoService saldoService;

    @GetMapping("/meu-saldo")
    public ResponseEntity<SaldoResponse> meuSaldo(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(saldoService.buscarSaldoPorUsuario(usuario.getId()));
    }
}