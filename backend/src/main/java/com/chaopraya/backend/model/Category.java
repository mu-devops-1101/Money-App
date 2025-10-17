package com.chaopraya.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    // ✅ แก้ไข: เปลี่ยนจาก @JsonBackReference เป็น @JsonIgnoreProperties เพื่อป้องกัน recursion
    @JsonIgnoreProperties({"categories", "paymentMethods", "transactions", "hibernateLazyInitializer", "handler"})
    private User user;

    // ✅ ป้องกัน recursion เมื่อ Category ถูกเรียกโดยตรง
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"category", "hibernateLazyInitializer", "handler"})
    private List<Transaction> transactions;

    // Constructors
    public Category() {
    }
    
    // เพิ่ม getter และ setter สำหรับ id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getters and Setters ที่มีอยู่แล้ว
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
