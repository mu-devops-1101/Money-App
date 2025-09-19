package com.chaopraya.backend.service;

import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction saveTransaction(Transaction transaction) {
        // Validation logic can be added here
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getMonthlyTransactions(String userId, int year, int month) {
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        return transactionRepository.findByUserIdAndDateBetween(userId, startOfMonth, endOfMonth);
    }

    // Other methods: delete, update, etc.
}