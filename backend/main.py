from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.v1 import auth
from api.v1 import remove_bg
from api.v1 import upload
from api.v1 import image 

app = FastAPI(
    title="Images Studio API",
    description="API FastAPI kết nối Supabase",
    version="1.0.0"
)

# Cho phép truy cập từ frontend vercel
origins = [
    "https://images-studio.vercel.app",
    "https://images-studio-b75hsejxc-khanhphans-projects.vercel.app",  # domain frontend
    "http://localhost:3000",             # khi dev local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Danh sách domain được phép
    allow_credentials=True,
    allow_methods=["*"],          # Cho phép tất cả method: GET, POST, PUT, DELETE...
    allow_headers=["*"],          # Cho phép tất cả header
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Đăng ký router
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(remove_bg.router, prefix="/api/v1", tags=["Remove BG"])
app.include_router(upload.router, prefix="/api/v1", tags=["Upload"])
app.include_router(image.router, prefix="/api/v1/image", tags=["Image Generation"])

@app.get("/")
def read_root():
    return {"message": "FastAPI + Supabase đang chạy!"}
