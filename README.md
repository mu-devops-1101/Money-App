# Money Management Application 

นี่คือคู่มือสำหรับการตั้งค่าและรันโปรเจกต์ Money Management ซึ่งประกอบด้วย Front-end (React Native/Expo), Back-end (Spring Boot), และฐานข้อมูล (MySQL) โดยใช้ Docker Compose

1. ติดตั้ง Docker Desktop (ต้องมี Docker Engine และ Docker Compose)
2. โปรเจกต์ถูกจัดโครงสร้างดังนี้:
    * / (Root Directory, มี docker-compose.yml อยู่)
    * /backend (มี Dockerfile และโค้ด Spring Boot)
    * /MoneyApp (มีโค้ด Front-end/Expo)

---

## 1. การตั้งค่าและเตรียมพร้อม

ก่อนรันโปรเจกต์ โปรดตรวจสอบการตั้งค่าหลักในไฟล์ docker-compose.yml:

### 1.1 การตั้งค่าฐานข้อมูล (MySQL)

ตรวจสอบ Environment Variables ใน Service db เพื่อให้แน่ใจว่าการตั้งค่าสำหรับผู้ใช้และฐานข้อมูลถูกต้อง:

* MYSQL_DATABASE: money_management_app
* MYSQL_USER: myuser
* MYSQL_PASSWORD: mypassword

### 1.2 การเชื่อมต่อ Back-end

ตรวจสอบ Environment Variables ใน Service backend เพื่อให้แน่ใจว่าการเชื่อมต่อกับฐานข้อมูลถูกต้อง:

* SPRING_DATASOURCE_URL: ต้องใช้ชื่อ Service ของ DB คือ jdbc:mysql://db:3306/money_management_app
* SPRING_DATASOURCE_USERNAME และ SPRING_DATASOURCE_PASSWORD ต้องตรงกับค่าใน Service db

---

## 2. วิธีรันโปรเจกต์

รันคำสั่งเพียงชุดเดียวจากไดเรกทอรีหลักของโปรเจกต์ (ตำแหน่งเดียวกับไฟล์ docker-compose.yml)

### ขั้นตอนที่ 1: Build และรัน Container ทั้งหมด

คำสั่งนี้จะทำการ Build Image ใหม่สำหรับ Back-end และ Front-end แล้วรัน Services ทั้งหมด (db, backend, frontend) ในโหมดเบื้องหลัง (-d)

docker-compose up --build -d

### ขั้นตอนที่ 2: ตรวจสอบสถานะ

ตรวจสอบว่า Container ทั้งหมดรันและทำงานได้อย่างถูกต้อง:

docker ps

* สถานะที่คาดหวัง: ทั้ง 3 Services ควรแสดงสถานะเป็น **Up**

### ขั้นตอนที่ 3: ตรวจสอบ Log (สำหรับ Debug)

หาก Back-end (money-app-backend-1) ไม่สามารถเริ่มทำงานได้ ให้ตรวจสอบ Log:

docker logs -f money-app-backend-1

---

## 3. การเข้าถึงแอปพลิเคชัน

เมื่อ Container ทั้งหมดทำงานได้ปกติ (Up) คุณสามารถเข้าถึง Services ต่าง ๆ ดังนี้:

* **Front-end (Web):** http://localhost:8081
* **Back-end API:** http://localhost:8080 (สำหรับทดสอบ API โดยตรง)
* **MySQL DB:** localhost:3306 (สำหรับเชื่อมต่อด้วย MySQL Workbench)

## 4. การจัดการ Container

| คำสั่ง | คำอธิบาย |
| :--- | :--- |
| docker-compose stop | หยุดการทำงานของ Container ทั้งหมด โดยไม่ลบข้อมูล |
| docker-compose start | เริ่ม Container ที่หยุดไว้ใหม่ |
| docker-compose down | หยุดและลบ Container, Networks, และ Volumes ที่ไม่ได้ถูกใช้งาน |
| docker-compose down -v | หยุดและลบทุกอย่าง รวมถึงข้อมูลใน Volume ฐานข้อมูล (ระวังข้อมูลหาย) |
