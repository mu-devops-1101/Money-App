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
import java.util.Optional;

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

        @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        User currentUser = SecurityUtils.getCurrentUser(userService);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // ตรวจสอบข้อมูลที่ต้องการอัปเดต
        if (updatedCategory.getName() == null || updatedCategory.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Category> existingCategoryOpt = categoryService.findById(id);

        if (existingCategoryOpt.isPresent()) {
            Category existingCategory = existingCategoryOpt.get();

            // ตรวจสอบว่า Category นี้เป็นของผู้ใช้ปัจจุบันหรือไม่
            if (!existingCategory.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build(); // Forbidden
            }

            existingCategory.setName(updatedCategory.getName());
            // ในทางปฏิบัติ, เราไม่อนุญาตให้เปลี่ยนผู้ใช้
            
            Category savedCategory = categoryService.save(existingCategory);
            return ResponseEntity.ok(savedCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
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