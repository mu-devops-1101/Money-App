package com.chaopraya.backend.service;

import com.chaopraya.backend.model.Category;
import com.chaopraya.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> findById(String categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public List<Category> findByUserId(String userId) {
        return categoryRepository.findByUserId(userId);
    }

    public void deleteById(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}