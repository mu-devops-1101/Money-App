// การทดสอบนี้มุ่งเน้นที่ Web Layer (AuthController) โดยใช้ MockMvc
package com.chaopraya.backend.controller;

import com.chaopraya.backend.dto.RegisterRequest;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.UserRepository;
import com.chaopraya.backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

/**
 * Integration Test for AuthController.
 * ใช้ @WebMvcTest เพื่อโหลดเฉพาะ AuthController และ Mock dependency อื่นๆ
 */
@WebMvcTest(AuthController.class)
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AuthenticationManager authenticationManager; // Mock for /login

    @MockBean
    private JwtUtil jwtUtil; // Mock for /login

    // ต้องมี MockBean สำหรับ UserDetailsService ด้วยหาก Spring Security Config อ้างอิงถึง
    @MockBean
    private UserDetailsService userDetailsService;
    
    private final String AUTH_API_PATH = "/api/auth";

    /**
     * ทดสอบการลงทะเบียนผู้ใช้ใหม่ (POST /api/auth/register)
     */
    @Test
    void testRegisterUser_Success() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("newuser", "secure123");
        
        // 1. Mock: ตรวจสอบว่า Username ยังไม่ถูกใช้
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        
        // 2. Mock: จำลองการเข้ารหัสผ่าน
        when(passwordEncoder.encode("secure123")).thenReturn("hashedPassword");
        
        // Note: We don't need to mock userRepository.save(user) explicitly here as we check response status/content.

        mockMvc.perform(post(AUTH_API_PATH + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(registerRequest)))
                .andExpect(status().isOk()) // คาดหวัง HTTP 200 OK
                .andExpect(content().string("User registered successfully!"));
    }

    /**
     * ทดสอบการลงทะเบียนเมื่อ Username ซ้ำ
     */
    @Test
    void testRegisterUser_UsernameTaken() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("existinguser", "secure123");
        User existingUser = new User(); // จำลอง User ที่มีอยู่แล้ว

        // 1. Mock: ตรวจสอบว่า Username ถูกใช้แล้ว
        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(existingUser));

        mockMvc.perform(post(AUTH_API_PATH + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest()) // คาดหวัง HTTP 400 Bad Request
                .andExpect(content().string("Username is already taken!"));
    }
    
    // NOTE: การทดสอบ /login ต้องมีการ Mock การทำงานของ AuthenticationManager และ JwtUtil ซึ่งซับซ้อนกว่า
    // เราจะเน้นไปที่ Full-Stack Test ในไฟล์ถัดไปเพื่อทดสอบ flow จริงแทน
}
