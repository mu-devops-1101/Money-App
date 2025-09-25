package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.Category;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.service.CategoryService;
import com.chaopraya.backend.service.UserService;
import com.chaopraya.backend.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<Category> categories = categoryService.findByUser(currentUser);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        category.setUser(currentUser);
        Category newCategory = categoryService.save(category);
        return ResponseEntity.ok(newCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        categoryService.deleteByIdAndUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}