package com.mobiliza.dto;

public class RecargaRequest {
    private Double valor;
    private String formaPagamento;

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }
}
