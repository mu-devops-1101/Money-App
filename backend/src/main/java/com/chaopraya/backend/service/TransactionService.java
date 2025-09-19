package com.chaopraya.backend.service;

import com.chaopraya.backend.exception.ResourceNotFoundException;
import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.model.TransactionType;
import com.chaopraya.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getMonthlyTransactions(String userId, int year, int month) {
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        return transactionRepository.findByUserIdAndDateBetween(userId, startOfMonth, endOfMonth);
    }

    public Optional<Transaction> getTransactionByIdAndUserId(String transactionId, String userId) {
        return transactionRepository.findByIdAndUserId(transactionId, userId);
    }

    public List<Transaction> getAllTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction updateTransaction(Transaction updatedTransaction, String userId) {
        return transactionRepository.findByIdAndUserId(updatedTransaction.getId(), userId)
                .map(existingTransaction -> transactionRepository.save(updatedTransaction))
                .orElseThrow(
                        () -> new ResourceNotFoundException("Transaction not found or does not belong to the user."));
    }

    public void deleteTransactionByIdAndUserId(String transactionId, String userId) {
        if (transactionRepository.findByIdAndUserId(transactionId, userId).isPresent()) {
            transactionRepository.deleteById(transactionId);
        } else {
            throw new ResourceNotFoundException("Transaction not found or does not belong to the user.");
        }
    }
    
    @Transactional
    public Map<String, Object> getMonthlySummary(String userId, int year, int month) {
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId, startOfMonth,
                endOfMonth);

        double totalIncome = 0.0;
        double totalExpense = 0.0;
        Map<String, Double> categorySummary = new HashMap<>();
        Map<String, Double> paymentMethodSummary = new HashMap<>();

        for (Transaction transaction : transactions) {
            if (transaction.getType() == TransactionType.INCOME) {
                totalIncome += transaction.getAmount();
            } else {
                totalExpense += transaction.getAmount();
            }

            // สรุปยอดตามหมวดหมู่ (ถ้ามี)
            if (transaction.getCategory() != null) {
                String categoryName = transaction.getCategory().getName();
                categorySummary.put(categoryName,
                        categorySummary.getOrDefault(categoryName, 0.0) + transaction.getAmount());
            }

            // สรุปยอดตามวิธีการชำระเงิน (ถ้ามี)
            if (transaction.getPaymentMethod() != null) {
                String paymentMethodName = transaction.getPaymentMethod().getName();
                paymentMethodSummary.put(paymentMethodName,
                        paymentMethodSummary.getOrDefault(paymentMethodName, 0.0) + transaction.getAmount());
            }
        }

        double balance = totalIncome - totalExpense;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("balance", balance);
        summary.put("categorySummary", categorySummary);
        summary.put("paymentMethodSummary", paymentMethodSummary);

        return summary;
    }
}