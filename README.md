# 🔐 ImageStudio WebAuthn Authentication

Hệ thống đăng ký và đăng nhập **sinh trắc học (WebAuthn)** sử dụng **FastAPI (backend)** và **Next.js (frontend)**.  
Dự án này minh họa cách tích hợp xác thực bằng **vân tay / Face ID / Windows Hello** trong ứng dụng web hiện đại.

---

## 🧩 Cấu trúc thư mục

images_studio/
│
├── backend/
│   ├── app/
│   │   ├── api/                # Định nghĩa các router
│   │   │   ├── v1/
│   │   │   │   └── auth.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── core/               # Cấu hình chính, settings, security
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── models/             # SQLAlchemy / Pydantic models
│   │   │   └── user.py
│   │   │
│   │   ├── services/           # Logic nghiệp vụ
│   │   │   └── user_service.py
│   │   │
│   │   ├── db/                 # DB session, engine
│   │   │   └── engine.py
│   │   │
│   │   └── main.py             # Entry point FastAPI app
│   │
│   ├── requirements.txt
│   ├── .env
│   └── alembic/                # Nếu dùng Alembic để migration DB
│
├── frontend/
│   ├── public/                 # Hình ảnh, favicon, robots.txt
│   ├── src/
│   │   ├── assets/             # CSS, images, fonts
│   │   ├── components/         # Reusable React components
│   │   ├── app/                # Pages của Next.js
│   │   │   ├── auth/           # Auth routes (Next.js)
│   │   │   │   ├── layout.tsx           
│   │   │   │   └── page.tsx    
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React context / global state
│   │   ├── services/           # Gọi API backend (axios/fetch)
│   │   ├── utils/              # Hàm tiện ích
│   │   └── styles/             # CSS
│   │
│   ├── .env.local
│   ├── .eslintrc.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.congig.mjs
│   └── tsconfig.json
├── .gitignore
└── README.md

---

## ⚙️ Cài đặt môi trường

### 🖥 Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate     # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
🚀 Chạy server
uvicorn main:app --reload
Server sẽ chạy tại:
👉 http://localhost:8000
Kiểm tra API docs tại:
📘 http://localhost:8000/docs

💻 Frontend (Next.js)
cd frontend
npm install
npm run dev
Frontend sẽ chạy tại:
👉 http://localhost:3000