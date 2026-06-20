package com.mobiliza.service;

import com.mobiliza.dto.SaldoResponse;
import com.mobiliza.model.Cartao;
import com.mobiliza.model.Saldo;
import com.mobiliza.repository.CartaoRepository;
import com.mobiliza.repository.SaldoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SaldoService {

    private final CartaoRepository cartaoRepository;
    private final SaldoRepository saldoRepository;

    public SaldoResponse buscarSaldoPorUsuario(Long usuarioId) {
        Cartao cartao = cartaoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Cartão não encontrado para este usuário"));

        Saldo saldo = saldoRepository.findByCartaoId(cartao.getId())
                .orElseThrow(() -> new RuntimeException("Saldo não encontrado para este cartão"));

        return new SaldoResponse(saldo.getValor(), cartao.getNumero());
    }
}