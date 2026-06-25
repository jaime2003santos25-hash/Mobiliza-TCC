package com.mobiliza.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigo(String email, String codigo) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(email);
        mensagem.setSubject("Recuperação de Senha - Mobiliza");

        mensagem.setText(
                "Seu código de recuperação é: "
                        + codigo
                        + "\n\nEste código expira em 15 minutos."
        );

        mailSender.send(mensagem);
    }
}
