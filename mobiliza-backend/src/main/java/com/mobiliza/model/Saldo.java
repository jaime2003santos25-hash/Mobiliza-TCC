package com.mobiliza.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "saldos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Saldo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Double valor;
    
    @OneToOne
    @JoinColumn(name = "cartao_id")
    private Cartao cartao;
}
