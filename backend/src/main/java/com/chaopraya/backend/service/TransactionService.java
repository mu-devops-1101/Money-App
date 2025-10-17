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

    private final TransactionRepository transactionRepository;

    // เปลี่ยนจาก @Autowired เป็น Constructor Injection (ตามรูปแบบเดิม)
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    
    // ✅ เปลี่ยนชื่อเมธอด: ให้สอดคล้องกับ TransactionController
    public List<Transaction> findByUser(User user) {
        return transactionRepository.findByUser(user);
    }

    // ✅ เปลี่ยนชื่อเมธอด: ให้สอดคล้องกับ TransactionController
    public Optional<Transaction> findByIdAndUser(Long id, User user) {
        return transactionRepository.findByIdAndUser(id, user);
    }
    
    @Transactional
    public void deleteByIdAndUser(Long id, User user) {
        transactionRepository.deleteByIdAndUser(id, user);
    }
    
    public List<Transaction> getMonthlyTransactions(User user, int year, int month) {
        // ตรวจสอบ Type ใน Transaction model ของคุณว่าใช้ "date" หรือ "dateTime"
        // ในโค้ดนี้ใช้ date/time field ที่เหมาะสมที่สุดในการค้นหาช่วงเวลา
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);
        // 🐞 แก้ไข: เปลี่ยน 'findByUserAndDateBetween' เป็น 'findByUserAndDateTimeBetween' เพื่อให้ตรงกับ Repository
        return transactionRepository.findByUserAndDateTimeBetween(user, start, end); 
    }

    public Map<String, Object> getMonthlySummary(User user, int year, int month) {
        List<Transaction> transactions = getMonthlyTransactions(user, year, month);

        // NOTE: ใน E2E test ใช้ 'INCOME'/'EXPENSE' เป็นตัวพิมพ์ใหญ่ ดังนั้นเราจะเทียบแบบไม่สนใจตัวพิมพ์ใหญ่
        BigDecimal totalIncome = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
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
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome.doubleValue());
        // ✅ แก้ไขคีย์: เปลี่ยนจาก "totalExpenses" เป็น "totalExpense" เพื่อให้ E2E Test ผ่าน
        summary.put("totalExpense", totalExpenses.doubleValue());
        summary.put("balance", balance.doubleValue());
        summary.put("categorySummary", categorySummary);
        summary.put("paymentMethodSummary", paymentMethodSummary);
        
        return summary;
    }
}
