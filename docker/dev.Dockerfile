FROM node:20-alpine

WORKDIR /app

# ติดตั้ง dependencies แบบแคชได้
COPY package*.json ./
RUN npm ci

# คัดลอกซอร์ส (ใน dev จะ override ด้วย volume)
COPY . .

# เปิดพอร์ต Vite
EXPOSE 5173

# รัน dev server (host true กำหนดใน vite.config.ts แล้ว)
CMD ["npm", "run", "dev", "--", "--host"]
