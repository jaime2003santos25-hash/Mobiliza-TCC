package com.mobiliza.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViagemResponse {
    private Long id;
    private LocalDateTime dataHora;
    private Double valor;
}