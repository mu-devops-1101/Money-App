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
        List<Transaction> transactions = transactionService.findByUser(currentUser);
        return ResponseEntity.ok(transactions);
    }
    
    // ✅ NEW: Endpoint to get a single transaction by ID and User
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        Optional<Transaction> transactionOptional = transactionService.findByIdAndUser(id, currentUser);
        
        return transactionOptional
                .map(ResponseEntity::ok) // Found and owned -> 200 OK
                .orElse(ResponseEntity.notFound().build()); // Not found or not owned -> 404 Not Found
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // Set user to current user
        transaction.setUser(currentUser);

        // Fetch and validate Category/PaymentMethod ownership before saving
        if (transaction.getCategory() != null && transaction.getCategory().getId() != null) {
            Optional<Category> existingCategory = categoryService.findByIdAndUser(transaction.getCategory().getId(), currentUser);
            // Only set if category exists AND belongs to the user
            existingCategory.ifPresent(transaction::setCategory);
        }

        if (transaction.getPaymentMethod() != null && transaction.getPaymentMethod().getId() != null) {
            Optional<PaymentMethod> existingPaymentMethod = paymentMethodService.findByIdAndUser(transaction.getPaymentMethod().getId(), currentUser);
            // Only set if payment method exists AND belongs to the user
            existingPaymentMethod.ifPresent(transaction::setPaymentMethod);
        }

        // Set date if not provided (default to now)
        if (transaction.getDateTime() == null) {
            transaction.setDateTime(LocalDateTime.now());
        }

        Transaction newTransaction = transactionService.saveTransaction(transaction);
        return ResponseEntity.ok(newTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transactionDetails) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // 1. Find the existing transaction by ID and user (ownership check)
        Optional<Transaction> transactionOptional = transactionService.findByIdAndUser(id, currentUser);
        
        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();

            // 2. Apply updates
            // Only update fields that are provided in the request body
            if (transactionDetails.getAmount() != null) {
                transaction.setAmount(transactionDetails.getAmount());
            }
            if (transactionDetails.getNote() != null) {
                transaction.setNote(transactionDetails.getNote());
            }
            if (transactionDetails.getType() != null) {
                transaction.setType(transactionDetails.getType());
            }
            if (transactionDetails.getLocation() != null) {
                transaction.setLocation(transactionDetails.getLocation());
            }
            if (transactionDetails.getDateTime() != null) {
                transaction.setDateTime(transactionDetails.getDateTime());
            }

            // Update associated entities only if IDs are provided and owned by the current user
            if (transactionDetails.getCategory() != null && transactionDetails.getCategory().getId() != null) {
                Optional<Category> existingCategory = categoryService.findByIdAndUser(transactionDetails.getCategory().getId(), currentUser);
                existingCategory.ifPresent(transaction::setCategory);
            }

            if (transactionDetails.getPaymentMethod() != null && transactionDetails.getPaymentMethod().getId() != null) {
                Optional<PaymentMethod> existingPaymentMethod = paymentMethodService.findByIdAndUser(transactionDetails.getPaymentMethod().getId(), currentUser);
                existingPaymentMethod.ifPresent(transaction::setPaymentMethod);
            }

            Transaction updatedTransaction = transactionService.saveTransaction(transaction);
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
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
