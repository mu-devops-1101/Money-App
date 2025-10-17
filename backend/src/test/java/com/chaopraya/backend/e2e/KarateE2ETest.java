package com.chaopraya.backend.e2e;

import com.intuit.karate.junit5.Karate;

// คลาสนี้จะถูกรันโดย Maven Surefire/Failsafe และใช้ Karate Engine ในการรัน Feature Files
class KarateE2ETest {

    /**
     * @return a Karate instance configured to look for feature files 
     * in the classpath under 'com/chaopraya/backend/e2e'.
     */
    @Karate.Test
    Karate testAll() {
        // 'classpath:' จะบอกให้ Karate ไปหาไฟล์ .feature ที่อยู่ใน src/test/resources 
        // ภายใต้ path ที่กำหนด
        // เรากำหนดให้รันไฟล์ทั้งหมดที่อยู่ใน package เดียวกันกับ Runner Class
        return Karate.run().relativeTo(getClass());
    }

    // หากต้องการกำหนดชื่อไฟล์ที่จะรันแบบเจาะจง ให้ใช้ syntax นี้แทน:
    // @Karate.Test
    // Karate testSpecificFeature() {
    //     return Karate.run("transaction_flow").relativeTo(getClass());
    // }
}
