package com.chaopraya.backend.repository;

import com.chaopraya.backend.model.PaymentMethod;
import com.chaopraya.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByUser(User user);
    
    // เพิ่มเมธอดนี้
    Optional<PaymentMethod> findByIdAndUser(Long id, User user);
    
    void deleteByIdAndUser(Long id, User user);
}