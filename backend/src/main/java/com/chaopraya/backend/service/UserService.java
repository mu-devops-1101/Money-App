package com.chaopraya.backend.service;

import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) { // เพิ่มเมธอดนี้
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}