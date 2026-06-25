package com.mobiliza.service;

import com.mobiliza.dto.ViagemResponse;
import com.mobiliza.model.Cartao;
import com.mobiliza.repository.CartaoRepository;
import com.mobiliza.repository.ViagemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViagemService {

    private final CartaoRepository cartaoRepository;
    private final ViagemRepository viagemRepository;

    public ViagemService(CartaoRepository cartaoRepository, ViagemRepository viagemRepository) {
        this.cartaoRepository = cartaoRepository;
        this.viagemRepository = viagemRepository;
    }

    public List<ViagemResponse> listarHistoricoPorUsuario(Long usuarioId) {
        Cartao cartao = cartaoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Cartão não encontrado para este usuário"));

        return viagemRepository.findByCartaoIdOrderByDataHoraDesc(cartao.getId())
                .stream()
                .map(viagem -> new ViagemResponse(
                        viagem.getId(),
                        viagem.getDataHora(),
                        viagem.getValor()
                ))
                .collect(Collectors.toList());
    }
}