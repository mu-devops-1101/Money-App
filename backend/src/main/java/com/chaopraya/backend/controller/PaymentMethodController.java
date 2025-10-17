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
import java.util.Optional;

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

        @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> updatePaymentMethod(@PathVariable Long id, @RequestBody PaymentMethod updatedPaymentMethod) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // ตรวจสอบข้อมูลที่ต้องการอัปเดต
        if (updatedPaymentMethod.getName() == null || updatedPaymentMethod.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<PaymentMethod> existingPaymentMethodOpt = paymentMethodService.findById(id);

        if (existingPaymentMethodOpt.isPresent()) {
            PaymentMethod existingPaymentMethod = existingPaymentMethodOpt.get();

            // ตรวจสอบว่า PaymentMethod นี้เป็นของผู้ใช้ปัจจุบันหรือไม่
            if (!existingPaymentMethod.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build(); // Forbidden
            }

            existingPaymentMethod.setName(updatedPaymentMethod.getName());
            
            PaymentMethod savedPaymentMethod = paymentMethodService.save(existingPaymentMethod);
            return ResponseEntity.ok(savedPaymentMethod);
        } else {
            return ResponseEntity.notFound().build();
        }
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