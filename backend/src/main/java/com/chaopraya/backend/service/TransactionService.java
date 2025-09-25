package com.chaopraya.backend.service;

import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    
    // Note: TransactionService ไม่ควรต้องเรียกใช้ UserRepository โดยตรง
    // ควรให้ Controller จัดการดึง User object มาให้ Service

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getAllTransactionsByUserId(User user) {
        return transactionRepository.findByUser(user);
    }

    public Optional<Transaction> getTransactionByIdAndUser(Long id, User user) {
        return transactionRepository.findByIdAndUser(id, user);
    }
    
    @Transactional
    public void deleteByIdAndUser(Long id, User user) {
        transactionRepository.deleteByIdAndUser(id, user);
    }
    
    public List<Transaction> getMonthlyTransactions(User user, int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);
        return transactionRepository.findByUserAndDateTimeBetween(user, start, end);
    }

    public Map<String, Object> getMonthlySummary(User user, int year, int month) {
        List<Transaction> transactions = getMonthlyTransactions(user, year, month);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> "income".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpenses);

        Map<String, Double> categorySummary = transactions.stream()
                .filter(t -> t.getCategory() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getName(),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ));

        Map<String, Double> paymentMethodSummary = transactions.stream()
                .filter(t -> t.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getPaymentMethod().getName(),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ));
        
        // แก้ไขส่วนนี้เพื่อแก้ปัญหา Type Mismatch
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", balance.doubleValue());
        summary.put("categorySummary", categorySummary);
        summary.put("paymentMethodSummary", paymentMethodSummary);
        
        return summary;
    }
}