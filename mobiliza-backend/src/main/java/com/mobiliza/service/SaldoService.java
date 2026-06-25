package com.mobiliza.service;

import com.mobiliza.dto.RecargaRequest;
import com.mobiliza.dto.SaldoResponse;
import com.mobiliza.model.Cartao;
import com.mobiliza.model.Saldo;
import com.mobiliza.repository.CartaoRepository;
import com.mobiliza.repository.SaldoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SaldoService {

    private static final List<String> FORMAS_PAGAMENTO_VALIDAS =
            List.of("PIX", "CARTAO_CREDITO", "CARTAO_DEBITO");

    private final CartaoRepository cartaoRepository;
    private final SaldoRepository saldoRepository;

    public SaldoService(CartaoRepository cartaoRepository, SaldoRepository saldoRepository) {
        this.cartaoRepository = cartaoRepository;
        this.saldoRepository = saldoRepository;
    }

    public SaldoResponse buscarSaldoPorUsuario(Long usuarioId) {
        Cartao cartao = buscarCartaoDoUsuario(usuarioId);
        Saldo saldo = buscarSaldoDoCartao(cartao.getId());
        return new SaldoResponse(saldo.getValor(), cartao.getNumero());
    }

    @Transactional
    public SaldoResponse recarregar(Long usuarioId, RecargaRequest request) {
        if (request.getValor() == null || request.getValor() <= 0) {
            throw new RuntimeException("O valor da recarga deve ser maior que zero.");
        }

        if (request.getFormaPagamento() == null
                || !FORMAS_PAGAMENTO_VALIDAS.contains(request.getFormaPagamento())) {
            throw new RuntimeException("Forma de pagamento inválida.");
        }

        Cartao cartao = buscarCartaoDoUsuario(usuarioId);
        Saldo saldo = buscarSaldoDoCartao(cartao.getId());

        // Aqui entraria a integração real com um gateway de pagamento.
        // Por enquanto, simulamos a aprovação e creditamos direto.
        saldo.setValor(saldo.getValor() + request.getValor());
        saldoRepository.save(saldo);

        return new SaldoResponse(saldo.getValor(), cartao.getNumero());
    }

    private Cartao buscarCartaoDoUsuario(Long usuarioId) {
        return cartaoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Cartão não encontrado para este usuário"));
    }

    private Saldo buscarSaldoDoCartao(Long cartaoId) {
        return saldoRepository.findByCartaoId(cartaoId)
                .orElseThrow(() -> new RuntimeException("Saldo não encontrado para este cartão"));
    }
}