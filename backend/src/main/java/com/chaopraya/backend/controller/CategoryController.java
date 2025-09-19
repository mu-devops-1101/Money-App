package com.chaopraya.backend.controller;

import com.chaopraya.backend.model.Category;
import com.chaopraya.backend.service.CategoryService;
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

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        String userId = SecurityUtils.getCurrentUserId();
        List<Category> categories = categoryService.findByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        // **ต้องตั้งค่า user ใน category object ก่อน save**
        String userId = SecurityUtils.getCurrentUserId();
        // category.setUser(new User(userId, null, null)); // ตัวอย่างการเซ็ต userId
        Category newCategory = categoryService.save(category);
        return ResponseEntity.ok(newCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        // คุณอาจจะต้องเพิ่มเมธอด deleteByCategoryAndUserId ใน service
        // เพื่อให้แน่ใจว่าผู้ใช้ลบได้เฉพาะของตัวเอง
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}