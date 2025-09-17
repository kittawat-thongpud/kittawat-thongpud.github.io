# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine
# คัดลอกไฟล์ build ไปที่ nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# ปรับ nginx.conf เล็กน้อยถ้าต้องการ SPA fallback
# ตัวอย่างค่าเริ่มต้นก็ใช้ได้ แต่ถ้าต้องการ fallback:
# RUN sed -i 's|try_files $uri $uri/ =404;|try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
