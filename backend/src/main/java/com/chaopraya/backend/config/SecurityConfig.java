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

// --- Imports ที่ต้องเพิ่ม ---
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import static org.springframework.security.config.Customizer.withDefaults;
// --- สิ้นสุด Imports ที่ต้องเพิ่ม ---

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtRequestFilter jwtRequestFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ 1. เพิ่มการตั้งค่า CORS ที่นี่
                .cors(withDefaults()) // (จะไปเรียกใช้ Bean 'corsConfigurationSource' ข้างล่าง)

                // 2. ปิด CSRF (เหมือนเดิม)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. กำหนดสิทธิ์การเข้าถึง (เหมือนเดิม)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                // 4. ตั้งค่า Session (เหมือนเดิม)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 5. เพิ่ม Filter (เหมือนเดิม)
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ 6. เพิ่ม Bean นี้เพื่อกำหนดค่า CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // อนุญาต Origin จาก Frontend (React Native) ของคุณ
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8081"));
        // อนุญาต Methods ที่ต้องการ
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // อนุญาต Headers ทั้งหมด
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // อนุญาตการส่ง credentials (เช่น cookies)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // ใช้การตั้งค่านี้กับทุก path ภายใต้ "/api/"
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}