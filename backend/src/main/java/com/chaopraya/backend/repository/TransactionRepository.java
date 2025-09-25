package com.chaopraya.backend.repository;

import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // เพิ่มเมธอดนี้
    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndDateTimeBetween(User user, LocalDateTime start, LocalDateTime end);
    
    Optional<Transaction> findByIdAndUser(Long id, User user);
    
    // เพิ่มเมธอดนี้
    void deleteByIdAndUser(Long id, User user);
}