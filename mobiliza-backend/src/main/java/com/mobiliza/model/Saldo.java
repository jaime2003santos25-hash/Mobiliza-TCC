package com.mobiliza.model;

import jakarta.persistence.*;

@Entity
@Table(name = "saldos")
public class Saldo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Double valor;
    
    @OneToOne
    @JoinColumn(name = "cartao_id")
    private Cartao cartao;

    public Saldo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public Cartao getCartao() { return cartao; }
    public void setCartao(Cartao cartao) { this.cartao = cartao; }
}
