# Money-App/MoneyApp/Dockerfile

# --- STAGE 1: Build the Web Application ---
# ใช้ Node.js เป็นสภาพแวดล้อมในการ build
FROM node:18-alpine AS build

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอก package files เพื่อติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างไฟล์ Static สำหรับเว็บ
# คำสั่งนี้จะสร้างโฟลเดอร์ชื่อ 'web-build' (หรือ 'build')
RUN npm run build


# --- STAGE 2: Serve the App using Nginx ---
FROM nginx:stable-alpine

# คัดลอกไฟล์ที่ build เสร็จแล้วจาก Stage 1 มาที่ Nginx
# ✅ แก้ไขตรงนี้จาก /app/web-build เป็น /app/dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]