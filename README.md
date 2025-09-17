# Vite + Tailwind v4.1 + Docker Template

Ship fast with a clean, professional DX: **Vite (React + TS)**, **Tailwind CSS v4.1** (no config by default, `@import "tailwindcss"`), and **Docker** for dev & prod.

---

## ✨ Features

* **Tailwind v4.1** via `@tailwindcss/vite` (no `tailwind.config.js` required by default)
* **Vite React + TypeScript** baseline
* **Dockerized** workflows: hot-reload dev & Nginx prod
* Batteries-included **scripts** for build, analyze, monitor, and container operations

---

## 📦 Prerequisites

* Node.js **>= 20** (LTS)
* Docker & Docker Compose v2

---

## 🗂️ Project Structure (target)

```
vite-tailwind-v4-docker/
├─ docker/
│  ├─ dev.Dockerfile
│  └─ prod.Dockerfile
├─ docker-compose.dev.yml
├─ docker-compose.prod.yml
├─ .dockerignore
├─ index.html
├─ package.json
├─ vite.config.ts
└─ src/
   ├─ style.css        # @import "tailwindcss"; (v4.1)
   ├─ main.tsx
   └─ App.tsx
```

---

## 🚀 Quick Start

1. Install deps

```bash
npm i
```

2. Dev (host-accessible)

```bash
npm run dev:host
# http://localhost:5173
```

3. Build optimized bundle → `dist/`

```bash
npm run dist:build
```

4. Preview production build

```bash
npm run dist:serve
# http://localhost:4173
```

---

## 🎨 Tailwind v4.1 Setup

Tailwind v4.1 uses a simplified flow:

* Install: `tailwindcss` + `@tailwindcss/vite`
* Add the Vite plugin in **`vite.config.ts`**
* Import Tailwind in CSS: `@import "tailwindcss";`

**vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
})
```

**src/style.css**

```css
@import "tailwindcss";
```

### Optional: Theme variables (v4 syntax)

Add custom tokens inline via `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.72 0.11 178);
  --spacing-7: 1.75rem;
}
/* Use: bg-brand-500, p-7 */
```

### Optional: Source scanning (when files live outside defaults)

If components live outside `src/`, add `@source`:

```css
@import "tailwindcss";
@source "./src/**/*.{ts,tsx,html}";
@source "./playground/**/*.{ts,tsx}";
@source not "./legacy/**";
/* Inline safelist: */
/* @source inline(text-3xl md:grid lg:place-items-center) */
```

---

## 🧩 Example React files

**src/App.tsx**

```tsx
export default function App() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="px-6 py-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold">Tailwind v4.1 + Vite + Docker</h1>
        <p className="text-gray-600">ship fast. look clean. stay zen.</p>
      </div>
    </div>
  );
}
```

**src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)
```

---

## 🐳 Docker

### Dev Dockerfile — `docker/dev.Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### Dev Compose — `docker-compose.dev.yml`

```yaml
version: "3.9"
services:
  web:
    build:
      context: .
      dockerfile: docker/dev.Dockerfile
    container_name: vite_tailwind_v4_dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: npm run dev -- --host
```

### Prod Dockerfile — `docker/prod.Dockerfile`

```dockerfile
# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- run ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA fallback (optional):
# RUN sed -i 's|try_files $uri $uri/ =404;|try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Prod Compose — `docker-compose.prod.yml`

```yaml
version: "3.9"
services:
  web:
    build:
      context: .
      dockerfile: docker/prod.Dockerfile
    container_name: vite_tailwind_v4_prod
    ports:
      - "8080:80"
    restart: unless-stopped
```

### .dockerignore

```
node_modules
dist
.git
.gitignore
docker-compose*.yml
docker
npm-debug.log*
*.local
```

---

## 🧰 package.json — Scripts (copy into your `package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:host": "vite --host",
    "preview": "vite preview --port 4173 --strictPort",
    "build": "tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",

    "analyze": "npx vite-bundle-visualizer",
    "clean": "rimraf dist .turbo .parcel-cache .cache && rimraf build-js",

    "ts:emit": "tsc -p tsconfig.build.json --outDir build-js",

    "docker:dev:build": "docker compose -f docker-compose.dev.yml build",
    "docker:dev:up": "docker compose -f docker-compose.dev.yml up --build",
    "docker:dev:up:d": "docker compose -f docker-compose.dev.yml up --build -d",
    "docker:dev:down": "docker compose -f docker-compose.dev.yml down",
    "docker:dev:logs": "docker compose -f docker-compose.dev.yml logs -f --tail=200",
    "docker:dev:sh": "docker exec -it vite_tailwind_v4_dev sh",

    "docker:prod:build": "docker compose -f docker-compose.prod.yml build",
    "docker:prod:up": "docker compose -f docker-compose.prod.yml up --build -d",
    "docker:prod:down": "docker compose -f docker-compose.prod.yml down",
    "docker:prod:logs": "docker compose -f docker-compose.prod.yml logs -f --tail=200",
    "docker:prod:sh": "docker exec -it vite_tailwind_v4_prod sh",

    "docker:ps": "docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'",
    "docker:stats": "docker stats --no-stream",
    "docker:top:dev": "docker top vite_tailwind_v4_dev || true",
    "docker:top:prod": "docker top vite_tailwind_v4_prod || true",
    "docker:prune": "docker system prune -f --volumes",

    "health:dev": "npx http-server ./ -p 0 >/dev/null 2>&1 || exit 0 && curl -fsS http://localhost:5173 || exit 1",
    "port:kill": "kill-port 5173 4173",
    "open:dev": "npx open-cli http://localhost:5173",
    "open:prod": "npx open-cli http://localhost:8080",

    "dist:build": "npm run clean && npm run build",
    "dist:serve": "vite preview --port 4173 --strictPort"
  }
}
```

### Dev Dependencies (recommended)

```bash
npm i -D eslint prettier typescript rimraf kill-port vite-bundle-visualizer \
       @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Optional** `tsconfig.build.json` for JS emission:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "jsx": "react-jsx",
    "outDir": "build-js",
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src"]
}
```

---

## ✅ Test Playbook (Step-by-Step)

Use this to validate dev → build → preview → docker → analyze → edge cases.

### 0) Pre-flight

```bash
npm i
npm run typecheck
npm run lint
```

* **Pass**: proceed; **Fail**: fix TS/ESLint errors first

### 1) Dev Smoke (Hot Reload + Tailwind)

```bash
npm run dev:host
# open http://localhost:5173
```

* Edit `src/App.tsx` → browser updates instantly (HMR)
* Add `bg-red-500 hover:bg-red-600 md:bg-emerald-500 text-white p-6 rounded-xl`
* Optional Dark test: add `dark:bg-slate-900 dark:text-slate-100` and toggle OS dark mode
* Theme test: in `src/style.css` add `@theme { --color-brand-500: oklch(0.72 0.11 178) }`, then use `bg-brand-500`
* External sources: if components live outside `src/`, add `@source` lines

### 2) Dist Build & Preview

```bash
npm run dist:build
npm run dist:serve
# http://localhost:4173
```

* Expect `dist/` with hashed assets under `assets/`
* App should behave like dev but minified & optimized

### 3) Docker Dev (HMR in container)

```bash
npm run docker:dev:up
# http://localhost:5173
npm run docker:dev:logs
npm run docker:dev:sh   # optional shell access
```

* Edit `src/App.tsx` → hot reload works inside container
* If port conflict: `npm run port:kill` then retry

### 4) Docker Prod (Nginx serving dist)

```bash
npm run docker:prod:up
# http://localhost:8080
npm run docker:prod:logs
npm run docker:ps && npm run docker:stats
```

* Deep-link test: visit `http://localhost:8080/some/deep/link`

  * If 404, enable SPA fallback (edit `prod.Dockerfile`, rebuild)

### 5) Bundle Analysis

```bash
npm run analyze
```

* Inspect interactive report; keep main chunk lean (e.g., <200KB gz as a baseline)

### 6) TypeScript Emission (optional)

```bash
npm run ts:emit
# check build-js/
```

### 7) Clean Exit

```bash
npm run docker:dev:down
npm run docker:prod:down
npm run clean
```

---

## 🔧 Troubleshooting

* **Port already in use** → `npm run port:kill`
* **Windows file watching flaky** → `CHOKIDAR_USEPOLLING=true` already set in dev compose
* **Tailwind classes missing** → verify `@source` paths & class names
* **Node version mismatch** → use Node 20 LTS locally; Docker uses `node:20-alpine`
* **Deep links 404 in prod** → enable SPA fallback in Nginx (see prod Dockerfile)

---

## 🧠 Notes

* `dist/` is the production artifact; Docker prod copies it into Nginx’s `/usr/share/nginx/html`.
* For subpath deployments (e.g., CDN prefix), set `base` in `vite.config.ts` and rebuild.
* Consider CI (GitHub Actions) to automate: `typecheck → lint → build → analyze`.

---

Happy shipping! 🛳️💨
