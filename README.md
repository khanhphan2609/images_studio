# 🔐 ImageStudio WebAuthn Authentication

Hệ thống đăng ký và đăng nhập **sinh trắc học (WebAuthn)** sử dụng **FastAPI (backend)** và **Next.js (frontend)**.  
Dự án này minh họa cách tích hợp xác thực bằng **vân tay / Face ID / Windows Hello** trong ứng dụng web hiện đại.

---

## 🧩 Cấu trúc thư mục

images_studio/
├── backend/                              # 🚀 FastAPI server
│   ├── main.py                           # Entry chính của backend
│   ├── routes/
│   │   └── auth_routes.py                # Xử lý các API /api/auth/*
│   ├── utils/
│   │   ├── users.py                      # Đọc / ghi dữ liệu người dùng JSON
│   │   └── converts.py                   # Hàm encode/decode bytes → base64
│   ├── data/
│   │   └── users.json                    # Lưu tạm người dùng & credential
│   └── requirements.txt                  # Các thư viện Python cần thiết
│
└── frontend/                             # 💻 Next.js (App Router)
    ├── public/
    │
    ├── src/
    │   ├── app/                          # App Router chính của Next.js
    │   │   ├── favicon.ico               # Icon hiển thị trên trình duyệt
    │   │   ├── globals.css               # CSS toàn cục
    │   │   ├── layout.tsx                # Layout tổng cho toàn trang
    │   │   ├── page.tsx                  # Trang chủ (home)
    │   │   └── auth/                     # Nhóm trang xác thực
    │   │       ├── layout.tsx            # Layout cho nhóm /auth/*
    │   │       └── page.tsx              # Trang đăng nhập / đăng kí Passkey
    │   │
    │   ├── components/
    │   │   └──                # Các components
    │   │   │
    │   ├── lib/
    │   │   └── webauthn.ts               # Hàm gọi API backend + WebAuthn logic
    │   │
    │   └── utils/
    │       └── webauthn.ts               # Hàm helper WebAuthn client-side
    │
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    └── tsconfig.json


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