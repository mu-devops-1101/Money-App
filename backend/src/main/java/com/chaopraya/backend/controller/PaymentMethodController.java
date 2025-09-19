package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.PaymentMethod;
import com.chaopraya.backend.service.PaymentMethodService;
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

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        String userId = SecurityUtils.getCurrentUserId();
        List<PaymentMethod> paymentMethods = paymentMethodService.findByUserId(userId);
        return ResponseEntity.ok(paymentMethods);
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        // **ต้องตั้งค่า user ใน paymentMethod object ก่อน save**
        String userId = SecurityUtils.getCurrentUserId();
        // paymentMethod.setUser(new User(userId, null, null)); // ตัวอย่างการเซ็ต userId
        PaymentMethod newPaymentMethod = paymentMethodService.save(paymentMethod);
        return ResponseEntity.ok(newPaymentMethod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable String id) {
        // คุณอาจจะต้องเพิ่มเมธอด deleteByPaymentMethodAndUserId ใน service
        // เพื่อให้แน่ใจว่าผู้ใช้ลบได้เฉพาะของตัวเอง
        paymentMethodService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}