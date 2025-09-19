package com.chaopraya.backend.repository;

import com.chaopraya.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    
    // เพิ่มเมธอดนี้เข้ามา
    Optional<User> findById(String id);
}