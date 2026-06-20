package com.mobiliza.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaldoResponse {
    private Double saldo;
    private String numeroCartao;
}