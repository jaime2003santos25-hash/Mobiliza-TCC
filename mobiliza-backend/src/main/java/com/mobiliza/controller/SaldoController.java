package com.mobiliza.controller;

import com.mobiliza.dto.RecargaRequest;
import com.mobiliza.dto.SaldoResponse;
import com.mobiliza.model.Usuario;
import com.mobiliza.service.SaldoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saldos")
public class SaldoController {

    private final SaldoService saldoService;

    public SaldoController(SaldoService saldoService) {
        this.saldoService = saldoService;
    }

    @GetMapping("/meu-saldo")
    public ResponseEntity<SaldoResponse> meuSaldo(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(saldoService.buscarSaldoPorUsuario(usuario.getId()));
    }

    @PostMapping("/recarregar")
    public ResponseEntity<SaldoResponse> recarregar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody RecargaRequest request
    ) {
        return ResponseEntity.ok(saldoService.recarregar(usuario.getId(), request));
    }
}
