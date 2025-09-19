package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.Transaction;
import com.chaopraya.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {
        Transaction newTransaction = transactionService.saveTransaction(transaction);
        return ResponseEntity.ok(newTransaction);
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<Transaction>> getMonthlySummary(
            @RequestParam String userId,
            @RequestParam int year,
            @RequestParam int month) {
        List<Transaction> transactions = transactionService.getMonthlyTransactions(userId, year, month);
        return ResponseEntity.ok(transactions);
    }

   

    // Other endpoints: GET all, PUT, DELETE...
}