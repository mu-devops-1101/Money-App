package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.Category;
import com.chaopraya.backend.model.PaymentMethod;
import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.service.CategoryService;
import com.chaopraya.backend.service.PaymentMethodService;
import com.chaopraya.backend.service.TransactionService;
import com.chaopraya.backend.service.UserService;
import com.chaopraya.backend.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<Transaction> transactions = transactionService.getAllTransactionsByUserId(currentUser);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        transaction.setUser(currentUser);

        // ตรวจสอบ Category และ PaymentMethod ว่าเป็นของผู้ใช้ปัจจุบัน
        if (transaction.getCategory() != null) {
            Optional<Category> existingCategory = categoryService.findByIdAndUser(transaction.getCategory().getId(), currentUser);
            if (existingCategory.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            transaction.setCategory(existingCategory.get());
        }

        if (transaction.getPaymentMethod() != null) {
            Optional<PaymentMethod> existingPaymentMethod = paymentMethodService.findByIdAndUser(transaction.getPaymentMethod().getId(), currentUser);
            if (existingPaymentMethod.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            transaction.setPaymentMethod(existingPaymentMethod.get());
        }

        Transaction savedTransaction = transactionService.saveTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transactionDetails) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Transaction> transactionOptional = transactionService.getTransactionByIdAndUser(id, currentUser);

        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();
            transaction.setDateTime(transactionDetails.getDateTime());
            transaction.setAmount(transactionDetails.getAmount());
            transaction.setNote(transactionDetails.getNote());
            transaction.setType(transactionDetails.getType());
            transaction.setLocation(transactionDetails.getLocation());

            // ตรวจสอบและอัปเดต Category และ PaymentMethod
            if (transactionDetails.getCategory() != null) {
                Optional<Category> existingCategory = categoryService.findByIdAndUser(transactionDetails.getCategory().getId(), currentUser);
                existingCategory.ifPresent(transaction::setCategory);
            }

            if (transactionDetails.getPaymentMethod() != null) {
                Optional<PaymentMethod> existingPaymentMethod = paymentMethodService.findByIdAndUser(transactionDetails.getPaymentMethod().getId(), currentUser);
                existingPaymentMethod.ifPresent(transaction::setPaymentMethod);
            }

            Transaction updatedTransaction = transactionService.saveTransaction(transaction);
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        transactionService.deleteByIdAndUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/monthly-summary/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(@PathVariable int year, @PathVariable int month) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        Map<String, Object> summary = transactionService.getMonthlySummary(currentUser, year, month);
        return ResponseEntity.ok(summary);
    }
}