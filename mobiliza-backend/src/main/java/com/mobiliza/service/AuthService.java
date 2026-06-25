package com.mobiliza.service;

import com.mobiliza.dto.LoginRequest;
import com.mobiliza.dto.RegisterRequest;
import com.mobiliza.model.Cartao;
import com.mobiliza.model.Saldo;
import com.mobiliza.model.Usuario;
import com.mobiliza.repository.CartaoRepository;
import com.mobiliza.repository.SaldoRepository;
import com.mobiliza.repository.UsuarioRepository;
import com.mobiliza.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import java.time.LocalDateTime;
import java.util.Random;
@Service
public class AuthService {

    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private final CartaoRepository cartaoRepository;
    private final SaldoRepository saldoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(EmailService emailService, UsuarioRepository usuarioRepository, 
                       CartaoRepository cartaoRepository, SaldoRepository saldoRepository, 
                       PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, 
                       AuthenticationManager authenticationManager) {
        this.emailService = emailService;
        this.usuarioRepository = usuarioRepository;
        this.cartaoRepository = cartaoRepository;
        this.saldoRepository = saldoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public Map<String, String> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", request.getEmail());
        return response;
    }

    @Transactional
    public Map<String, String> register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuarioRepository.save(usuario);

        // Cria automaticamente o cartão Bilhete Único do novo usuário
        Cartao cartao = new Cartao();
        cartao.setNumero(gerarNumeroCartao());
        cartao.setUsuario(usuario);
        cartaoRepository.save(cartao);

        // Cria o saldo inicial vinculado ao cartão
        Saldo saldo = new Saldo();
        saldo.setValor(0.0);
        saldo.setCartao(cartao);
        saldoRepository.save(saldo);

        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Usuário cadastrado com sucesso!");
        response.put("email", request.getEmail());
        return response;
    }


    public Map<String, String> esqueciSenha(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String codigo = gerarCodigo();

        usuario.setCodigoRecuperacao(codigo);
        usuario.setExpiracaoCodigo(LocalDateTime.now().plusMinutes(15));

        usuarioRepository.save(usuario);

        emailService.enviarCodigo(email, codigo);

        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Código enviado para o e-mail.");

        return response;
    }

    public Map<String, String> redefinirSenha(
            String email,
            String codigo,
            String novaSenha
    ) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getCodigoRecuperacao() == null ||
                !usuario.getCodigoRecuperacao().equals(codigo)) {

            throw new RuntimeException("Código inválido");
        }

        if (usuario.getExpiracaoCodigo().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado");
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuario.setCodigoRecuperacao(null);
        usuario.setExpiracaoCodigo(null);

        usuarioRepository.save(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Senha redefinida com sucesso!");

        return response;
    }

    private String gerarCodigo() {
        return String.format("%06d", new Random().nextInt(999999));
    }
    private String gerarNumeroCartao() {
        long numero = (long) (Math.random() * 9000000000000000L) + 1000000000000000L;
        return String.valueOf(numero);
    }
}