package com.chaopraya.backend.util;

import com.chaopraya.backend.model.User;
import com.chaopraya.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class SecurityUtils {

    /**
     * ดึงข้อมูล User ปัจจุบันจาก Security Context
     * @param userService Service สำหรับจัดการ User
     * @return User object ที่ล็อกอินอยู่ หรือ null ถ้าไม่พบ
     */
    public static User getCurrentUser(UserService userService) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        } else if (principal instanceof String) {
            String username = (String) principal;
            return userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        }

        return null;
    }
}