package com.chaopraya.backend.service;

import com.chaopraya.backend.model.User;
import com.chaopraya.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit Test สำหรับ UserService
 * ใช้ Mockito เพื่อจำลองการทำงานของ UserRepository และ PasswordEncoder
 * ทำให้สามารถทดสอบ Logic ภายใน UserService ได้โดยไม่ต้องพึ่งพา Spring Context หรือ Database จริงๆ
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    // @Mock: สร้างวัตถุจำลอง (Mock Object) สำหรับ Dependency
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    // @InjectMocks: สร้าง Instance ของ Class ที่ต้องการทดสอบ (UserService)
    // และฉีด Mock Object ข้างบนเข้าสู่ Constructor โดยอัตโนมัติ (Constructor Injection)
    @InjectMocks
    private UserService userService;

    private User testUser;

    /**
     * ตั้งค่าก่อนการทดสอบแต่ละครั้ง (Initialization)
     */
    @BeforeEach
    void setUp() {
        // สร้าง Object User จำลองไว้ใช้ในการทดสอบ
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }

    /**
     * ทดสอบเมธอด findByUsername() เมื่อพบผู้ใช้
     */
    @Test
    void testFindByUsername_UserFound() {
        // 1. การกำหนดพฤติกรรม (Stubbing):
        // เมื่อ userService เรียก userRepository.findByUsername("testuser")
        // ให้คืนค่า Optional ที่มี testUser อยู่
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // 2. การเรียกใช้เมธอดจริง
        Optional<User> result = userService.findByUsername("testuser");

        // 3. การตรวจสอบ (Verification/Assertion):
        // ตรวจสอบว่าผลลัพธ์ที่ได้ต้องเป็น Optional ที่มีค่าอยู่
        assertTrue(result.isPresent(), "ควรพบผู้ใช้");
        // ตรวจสอบว่าชื่อผู้ใช้ที่ได้ตรงกับที่คาดหวัง
        assertEquals("testuser", result.get().getUsername(), "ชื่อผู้ใช้ควรตรงกัน");
        
        // ตรวจสอบว่าเมธอดของ Dependency ถูกเรียกใช้จริงหรือไม่
        verify(userRepository).findByUsername("testuser");
    }

    /**
     * ทดสอบเมธอด findByUsername() เมื่อไม่พบผู้ใช้
     */
    @Test
    void testFindByUsername_UserNotFound() {
        // 1. การกำหนดพฤติกรรม (Stubbing):
        // เมื่อเรียก userRepository.findByUsername("nonexistent") ให้คืนค่า Optional.empty()
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // 2. การเรียกใช้เมธอดจริง
        Optional<User> result = userService.findByUsername("nonexistent");

        // 3. การตรวจสอบ (Assertion):
        // ตรวจสอบว่าผลลัพธ์ที่ได้ต้องเป็น Optional ที่ไม่มีค่า (empty)
        assertTrue(result.isEmpty(), "ไม่ควรพบผู้ใช้");
        
        // ตรวจสอบว่าเมธอดของ Dependency ถูกเรียกใช้จริงหรือไม่
        verify(userRepository).findByUsername("nonexistent");
    }

    /**
     * ทดสอบเมธอด save()
     */
    @Test
    void testSaveUser() {
        // 1. การกำหนดพฤติกรรม (Stubbing):
        // เมื่อเรียก userRepository.save(any(User.class)) ให้คืนค่า Object user ตัวเดิมกลับมา
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 2. การเรียกใช้เมธอดจริง
        User savedUser = userService.save(testUser);

        // 3. การตรวจสอบ (Assertion):
        // ตรวจสอบว่า User ที่บันทึกไปแล้วตรงกับที่คาดหวัง (มีการคืนค่ากลับมา)
        assertEquals(1L, savedUser.getId(), "ID ของผู้ใช้ที่บันทึกควรเป็น 1L");

        // ตรวจสอบว่าเมธอด userRepository.save() ถูกเรียกใช้ 1 ครั้งด้วย Object User
        verify(userRepository).save(testUser);
    }
}