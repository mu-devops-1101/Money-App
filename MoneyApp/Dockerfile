# ========================
# Stage: Expo Web Dev Server
# ========================
FROM node:18-alpine

# ตั้ง working directory
WORKDIR /app

# ติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้ามา
COPY . .

# Expo Web ใช้ port 8081
EXPOSE 8081

# รันเว็บโหมด
CMD ["npm", "run", "web"]
