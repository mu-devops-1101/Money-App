package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.PaymentMethod;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.service.PaymentMethodService;
import com.chaopraya.backend.service.UserService;
import com.chaopraya.backend.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<PaymentMethod> paymentMethods = paymentMethodService.findByUser(currentUser);
        return ResponseEntity.ok(paymentMethods);
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        paymentMethod.setUser(currentUser);
        PaymentMethod newPaymentMethod = paymentMethodService.save(paymentMethod);
        return ResponseEntity.ok(newPaymentMethod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        paymentMethodService.deleteByIdAndUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}