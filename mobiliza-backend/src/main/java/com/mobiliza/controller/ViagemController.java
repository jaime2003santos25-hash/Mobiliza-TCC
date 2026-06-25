package com.mobiliza.controller;

import com.mobiliza.dto.ViagemResponse;
import com.mobiliza.model.Usuario;
import com.mobiliza.service.ViagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @GetMapping("/historico")
    public ResponseEntity<List<ViagemResponse>> meuHistorico(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(viagemService.listarHistoricoPorUsuario(usuario.getId()));
    }
}
