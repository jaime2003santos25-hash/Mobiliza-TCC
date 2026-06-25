package com.mobiliza.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "viagens")
public class Viagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime dataHora;
    private Double valor;
    
    @ManyToOne
    @JoinColumn(name = "cartao_id")
    private Cartao cartao;

    public Viagem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public Cartao getCartao() { return cartao; }
    public void setCartao(Cartao cartao) { this.cartao = cartao; }
}
