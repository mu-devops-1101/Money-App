package com.chaopraya.backend.repository;

import com.chaopraya.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByUserIdAndDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
}