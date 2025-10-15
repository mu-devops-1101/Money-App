package com.chaopraya.backend.controller;

import com.chaopraya.backend.dto.LoginRequest;
import com.chaopraya.backend.dto.RegisterRequest;
import com.chaopraya.backend.dto.AuthenticationResponse;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.UserRepository;
import com.chaopraya.backend.service.CustomUserDetailsService; 
import com.chaopraya.backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // <-- ADDED: For filter configuration
import org.springframework.boot.test.mock.mockito.MockBean; // <-- ยังต้องใช้ในกรณีนี้
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * Integration Test สำหรับ AuthController โดยใช้ @WebMvcTest
 * ต้องใช้ @MockBean เพื่อจำลอง Dependencies ที่จำเป็นสำหรับ Controller และ Spring Security
 * (โดยเฉพาะ CustomUserDetailsService และ JwtUtil)
 */
@WebMvcTest(AuthController.class)
// FIX: Add this annotation to disable Spring Security filters (which cause 403 Forbidden) 
// when testing public endpoints like /register and /login within the @WebMvcTest context.
@AutoConfigureMockMvc(addFilters = false) 
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --------------------------------------------------------------------------------------
    // FIX: MockDependencies ทั้งหมดที่ AuthController หรือ Security Filter Chain ต้องการ
    // การใช้ @MockBean ที่นี่เป็นการแก้ปัญหา UnsatisfiedDependencyException 
    // แม้จะมี Deprecation Warning แต่เป็นวิธีที่จำเป็นสำหรับ @WebMvcTest 
    // --------------------------------------------------------------------------------------
    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService; 
    // --------------------------------------------------------------------------------------

    @Test
    void registerUser_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("securepass");

        // Mock: UserRepository ตรวจสอบแล้วไม่พบ Username นี้
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.empty());
        
        // Mock: จำลองการเข้ารหัสผ่าน
        when(passwordEncoder.encode(any(String.class))).thenReturn("hashed_pass");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    @Test
    void registerUser_UsernameTaken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setPassword("securepass");

        // Mock: UserRepository ตรวจสอบแล้วพบ Username นี้
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(new User()));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username is already taken!"));
    }

    @Test
    void authenticateUser_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("correctpass");

        // 1. เตรียม Mock Objects
        UserDetails mockUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser").password("hashed_pass").authorities("ROLE_USER").build();
        Authentication mockAuthentication = org.mockito.Mockito.mock(Authentication.class);
        String mockJwt = "mock-jwt-token-12345";
        
        // 2. Mock Behavior
        when(mockAuthentication.getPrincipal()).thenReturn(mockUserDetails);
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(mockAuthentication);
        when(jwtUtil.generateToken("testuser")).thenReturn(mockJwt);

        // 3. Perform Test
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value(mockJwt)); 
    }

    @Test
    void authenticateUser_InvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpass");

        // Mock: AuthenticationManager โยน BadCredentialsException เมื่อรหัสผิด
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid username or password"));
    }
}