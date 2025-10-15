// การทดสอบนี้จำลองการทำงาน E2E ของ Authentication Flow ทั้งระบบ (Full-Stack)
package com.chaopraya.backend;

import com.chaopraya.backend.dto.LoginRequest;
import com.chaopraya.backend.dto.RegisterRequest;
import com.chaopraya.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * E2E/Full-Stack Component Test: ทดสอบการทำงานร่วมกันของทุก Layer ใน Authentication Flow.
 * ใช้ @SpringBootTest เพื่อโหลด Spring Context ทั้งหมด.
 */
@SpringBootTest
@AutoConfigureMockMvc
// ใช้ WebEnvironment.RANDOM_PORT ในกรณีที่คุณต้องการใช้ TestRestTemplate
// แต่ MockMvc เร็วกว่าสำหรับ Backend-only testing
public class AuthFullStackComponentTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final String AUTH_API_PATH = "/api/auth";
    
    /**
     * ล้างข้อมูลใน Repository หลังจากการทดสอบแต่ละครั้ง
     */
    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    /**
     * ทดสอบ End-to-End Flow: ลงทะเบียนผู้ใช้ -> ล็อกอินด้วยข้อมูลที่ลงทะเบียน
     */
    @Test
    void testRegisterAndLoginFlow_Success() throws Exception {
        String username = "e2e_user";
        String password = "e2ePassword";

        // 1. ลงทะเบียน (Controller -> Service -> Repository: บันทึกข้อมูลใน DB จริง)
        RegisterRequest registerRequest = new RegisterRequest(username, password);
        
        mockMvc.perform(post(AUTH_API_PATH + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk()); // ยืนยันว่าลงทะเบียนสำเร็จ (200 OK)

        // 2. ล็อกอิน (Controller -> AuthenticationManager -> JwtUtil: สร้าง Token)
        LoginRequest loginRequest = new LoginRequest(username, password);

        mockMvc.perform(post(AUTH_API_PATH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk()) // ยืนยันว่าล็อกอินสำเร็จ (200 OK)
                .andExpect(jsonPath("$.jwt").isNotEmpty()); // ตรวจสอบว่าได้รับ JWT token กลับมา
    }

    /**
     * ทดสอบ Flow: พยายามล็อกอินด้วยรหัสผ่านผิด
     */
    @Test
    void testRegisterAndLoginFlow_WrongPassword() throws Exception {
        String username = "wrong_pass_user";
        String correctPassword = "correctPassword";
        String wrongPassword = "wrongPassword";

        // 1. ลงทะเบียนผู้ใช้ที่ถูกต้อง
        RegisterRequest registerRequest = new RegisterRequest(username, correctPassword);
        mockMvc.perform(post(AUTH_API_PATH + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // 2. พยายามล็อกอินด้วยรหัสผ่านผิด
        LoginRequest loginRequest = new LoginRequest(username, wrongPassword);

        mockMvc.perform(post(AUTH_API_PATH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest()); // คาดหวัง 400 Bad Request
    }
}
