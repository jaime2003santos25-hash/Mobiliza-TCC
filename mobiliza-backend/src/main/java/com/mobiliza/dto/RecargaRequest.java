package com.mobiliza.dto;

import lombok.Data;

@Data
public class RecargaRequest {
    private Double valor;
    private String formaPagamento; // PIX, CARTAO_CREDITO, CARTAO_DEBITO
}