package com.chaopraya.backend.controller;

import com.chaopraya.backend.dto.LoginRequest;
import com.chaopraya.backend.dto.RegisterRequest;
import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.UserRepository;
import com.chaopraya.backend.service.CustomUserDetailsService; 
import com.chaopraya.backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
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
 * Integration Test for AuthController using @WebMvcTest
 * ⚠️ IMPORTANT: Use "/auth" path (not "/api/auth") to match the actual controller mapping
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) 
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    @Test
    void registerUser_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("securepass");

        // Mock: UserRepository returns empty (username doesn't exist)
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.empty());
        
        // Mock: Password encoding
        when(passwordEncoder.encode(any(String.class))).thenReturn("hashed_pass");

        mockMvc.perform(post("/auth/register")  // ✅ Changed from /api/auth to /auth
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

        // Mock: UserRepository returns existing user
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(new User()));

        mockMvc.perform(post("/auth/register")  // ✅ Changed from /api/auth to /auth
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

        // 1. Create Mock Objects
        UserDetails mockUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser").password("hashed_pass").authorities("ROLE_USER").build();
        Authentication mockAuthentication = org.mockito.Mockito.mock(Authentication.class);
        String mockJwt = "mock-jwt-token-12345";
        
        // 2. Mock Behavior
        when(mockAuthentication.getPrincipal()).thenReturn(mockUserDetails);
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(mockAuthentication);
        when(jwtUtil.generateToken("testuser")).thenReturn(mockJwt);

        // 3. Perform Test
        mockMvc.perform(post("/auth/login")  // ✅ Changed from /api/auth to /auth
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(mockJwt));  // ✅ Changed from $.jwt to $.token (matches AuthenticationResponse)
    }

    @Test
    void authenticateUser_InvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpass");

        // Mock: AuthenticationManager throws BadCredentialsException
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid username or password"));

        mockMvc.perform(post("/auth/login")  // ✅ Changed from /api/auth to /auth
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid username or password"));
    }
}