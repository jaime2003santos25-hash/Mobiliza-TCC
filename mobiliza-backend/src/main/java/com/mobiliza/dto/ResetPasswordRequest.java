package com.mobiliza.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String codigo;
    private String novaSenha;
}