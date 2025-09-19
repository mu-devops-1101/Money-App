package com.chaopraya.backend.repository;

import com.chaopraya.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByUserIdAndDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByUserId(String userId);

    // เพิ่มเมธอดนี้เข้ามา
    Optional<Transaction> findByIdAndUserId(String id, String userId);
}