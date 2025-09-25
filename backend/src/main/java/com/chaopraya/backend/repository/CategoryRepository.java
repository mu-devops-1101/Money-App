package com.chaopraya.backend.repository;

import com.chaopraya.backend.model.Category;
import com.chaopraya.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);

    // เพิ่มเมธอดนี้
    Optional<Category> findByIdAndUser(Long id, User user);
    
    void deleteByIdAndUser(Long id, User user);
}