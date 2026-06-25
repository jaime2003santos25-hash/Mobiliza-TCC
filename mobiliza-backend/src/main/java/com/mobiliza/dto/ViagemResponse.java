package com.mobiliza.dto;

import java.time.LocalDateTime;

public class ViagemResponse {
    private Long id;
    private LocalDateTime dataHora;
    private Double valor;

    public ViagemResponse() {}

    public ViagemResponse(Long id, LocalDateTime dataHora, Double valor) {
        this.id = id;
        this.dataHora = dataHora;
        this.valor = valor;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
}
