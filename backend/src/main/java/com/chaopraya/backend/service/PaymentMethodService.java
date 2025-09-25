package com.chaopraya.backend.service;

import com.chaopraya.backend.model.PaymentMethod;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public PaymentMethod save(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }
    
    public Optional<PaymentMethod> findById(Long paymentMethodId) {
        return paymentMethodRepository.findById(paymentMethodId);
    }

    public List<PaymentMethod> findByUser(User user) {
        return paymentMethodRepository.findByUser(user);
    }
    
    // เพิ่มเมธอดนี้
    public Optional<PaymentMethod> findByIdAndUser(Long id, User user) {
        return paymentMethodRepository.findByIdAndUser(id, user);
    }

    @Transactional
    public void deleteByIdAndUser(Long paymentMethodId, User user) {
        paymentMethodRepository.deleteByIdAndUser(paymentMethodId, user);
    }
}