package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.service.TransactionService;
import com.chaopraya.backend.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {
        String userId = SecurityUtils.getCurrentUserId();
        // **ต้องตั้งค่า user ใน transaction object ก่อน save**
        // transaction.setUser(new User(userId, null, null)); // ตัวอย่างการเซ็ต userId
        Transaction newTransaction = transactionService.saveTransaction(transaction);
        return ResponseEntity.ok(newTransaction);
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {
        String userId = SecurityUtils.getCurrentUserId();
        Map<String, Object> summary = transactionService.getMonthlySummary(userId, year, month);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        String userId = SecurityUtils.getCurrentUserId();
        List<Transaction> transactions = transactionService.getAllTransactionsByUserId(userId);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable String id,
            @RequestBody Transaction transactionDetails) {
        String userId = SecurityUtils.getCurrentUserId();
        transactionDetails.setId(id);
        Transaction updatedTransaction = transactionService.updateTransaction(transactionDetails, userId);
        return ResponseEntity.ok(updatedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        transactionService.deleteTransactionByIdAndUserId(id, userId);
        return ResponseEntity.noContent().build();
    }
}