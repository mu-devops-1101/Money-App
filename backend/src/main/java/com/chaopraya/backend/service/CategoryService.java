package com.chaopraya.backend.service;

import com.chaopraya.backend.model.Category;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category save(Category category) {
        return categoryRepository.save(category);
    }
    
    public Optional<Category> findById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public List<Category> findByUser(User user) {
        return categoryRepository.findByUser(user);
    }
    
    // เพิ่มเมธอดนี้
    public Optional<Category> findByIdAndUser(Long id, User user) {
        return categoryRepository.findByIdAndUser(id, user);
    }

    @Transactional
    public void deleteByIdAndUser(Long categoryId, User user) {
        categoryRepository.deleteByIdAndUser(categoryId, user);
    }
}