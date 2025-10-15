// หมายเหตุ: ไฟล์นี้ต้องอยู่ใน src/test/java/com/chaopraya/backend/service/
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
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.any;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    // 1. Mock Objects สำหรับ Dependency ที่ UserService ต้องการ
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    // 2. Class ที่ต้องการทดสอบ (โดย Mockito จะ Inject Mock Objects ข้างบนเข้าไปใน Constructor)
    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("hashedPassword");
        // สมมติว่ามี setter สำหรับอีเมล
        // testUser.setEmail("test@example.com"); 
    }

    @Test
    void testFindByUsername_UserExists() {
        // กำหนดพฤติกรรมของ Mock: เมื่อมีการเรียก findByUsername ให้คืนค่า Optional ที่มี testUser
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // เรียกเมธอดที่ต้องการทดสอบ
        Optional<User> result = userService.findByUsername("testuser");

        // ยืนยันผลลัพธ์
        assertTrue(result.isPresent(), "User should be found");
        assertEquals("testuser", result.get().getUsername(), "Username should match");

        // ตรวจสอบว่าเมธอดของ Repository ถูกเรียกใช้จริงหรือไม่
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void testFindByUsername_UserNotFound() {
        // กำหนดพฤติกรรมของ Mock: เมื่อมีการเรียก findByUsername ให้คืนค่า Optional.empty()
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        // เรียกเมธอดที่ต้องการทดสอบ
        Optional<User> result = userService.findByUsername("unknown");

        // ยืนยันผลลัพธ์
        assertTrue(result.isEmpty(), "User should not be found");

        // ตรวจสอบว่าเมธอดของ Repository ถูกเรียกใช้จริงหรือไม่
        verify(userRepository).findByUsername("unknown");
    }

    @Test
    void testSaveUser() {
        // กำหนดพฤติกรรมของ Mock: เมื่อมีการเรียก save ด้วย object ใดๆ ให้คืนค่า object นั้นกลับมา
        // ถ้ามีการเข้ารหัสรหัสผ่านใน save() ควรทดสอบการเรียก passwordEncoder ด้วย
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // เรียกเมธอดที่ต้องการทดสอบ
        User savedUser = userService.save(new User());

        // ยืนยันผลลัพธ์
        assertEquals(1L, savedUser.getId(), "Saved user should have an ID assigned by repository");

        // ตรวจสอบว่าเมธอดของ Repository ถูกเรียกใช้จริงหรือไม่
        verify(userRepository).save(any(User.class));
    }
}
