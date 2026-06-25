package com.mobiliza.dto;

public class SaldoResponse {
    private Double saldo;
    private String numeroCartao;

    public SaldoResponse() {}

    public SaldoResponse(Double saldo, String numeroCartao) {
        this.saldo = saldo;
        this.numeroCartao = numeroCartao;
    }

    public Double getSaldo() { return saldo; }
    public void setSaldo(Double saldo) { this.saldo = saldo; }
    public String getNumeroCartao() { return numeroCartao; }
    public void setNumeroCartao(String numeroCartao) { this.numeroCartao = numeroCartao; }
}
