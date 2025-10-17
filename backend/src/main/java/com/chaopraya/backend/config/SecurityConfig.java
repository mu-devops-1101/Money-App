package com.chaopraya.backend.config;

import com.chaopraya.backend.filter.JwtRequestFilter;
import com.chaopraya.backend.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    // การทำ Constructor Injection สำหรับ Service และ Filter
    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtRequestFilter jwtRequestFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. ปิด CSRF เนื่องจากเป็น Stateless REST API
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                // 2. อนุญาตให้เข้าถึง /api/auth/ (register, login) ได้โดยไม่ต้องตรวจสอบสิทธิ์
                .requestMatchers("/api/auth/**").permitAll()
                // 3. กำหนดให้ Endpoint อื่นๆ ทั้งหมดต้องมีการตรวจสอบสิทธิ์
                .anyRequest().authenticated()
            )
            // 4. ตั้งค่า Session Management เป็น Stateless (ไม่เก็บสถานะ session)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 5. เพิ่ม JwtRequestFilter เข้าไปก่อน UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 6. สร้าง Bean สำหรับ AuthenticationManager เพื่อให้สามารถ Inject ใน AuthController ได้
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider authenticationProvider) {
        // ใช้ ProviderManager เพื่อรวม AuthenticationProvider เข้าด้วยกัน
        return new ProviderManager(authenticationProvider);
    }
    
    // 7. สร้าง Bean สำหรับ PasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
