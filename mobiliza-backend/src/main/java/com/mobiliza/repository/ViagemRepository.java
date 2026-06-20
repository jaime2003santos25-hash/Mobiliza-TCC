package com.mobiliza.repository;

import com.mobiliza.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {

    List<Viagem> findByCartaoIdOrderByDataHoraDesc(Long cartaoId);
}