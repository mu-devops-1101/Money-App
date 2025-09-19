package com.chaopraya.backend.service;

import com.chaopraya.backend.model.PaymentMethod;
import com.chaopraya.backend.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public PaymentMethod save(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    public Optional<PaymentMethod> findById(String paymentMethodId) {
        return paymentMethodRepository.findById(paymentMethodId);
    }

    public List<PaymentMethod> findByUserId(String userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    public void deleteById(String paymentMethodId) {
        paymentMethodRepository.deleteById(paymentMethodId);
    }
}