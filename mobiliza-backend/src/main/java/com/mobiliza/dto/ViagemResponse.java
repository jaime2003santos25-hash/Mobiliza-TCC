package com.mobiliza.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ViagemResponse {
    private Long id;
    private LocalDateTime dataHora;
    private Double valor;
}
