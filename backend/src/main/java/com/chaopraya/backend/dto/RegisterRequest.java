package com.chaopraya.backend.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private String role;

    public RegisterRequest() {
    }
    
    // **เพิ่ม Constructor ใหม่สำหรับ Test**
    public RegisterRequest(String username, String password) {
        this.username = username;
        this.password = password;
        this.role = "ROLE_USER"; // กำหนดค่า default role ได้ที่นี่
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
