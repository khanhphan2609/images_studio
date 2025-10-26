from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import os
from datetime import datetime

router = APIRouter()

# Thư mục lưu file upload
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        # 🔹 Lấy tên gốc & định dạng file
        ext = file.filename.split(".")[-1]
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.{ext}"

        # 🔹 Đường dẫn file lưu
        file_path = os.path.join(UPLOAD_DIR, filename)

        # 🔹 Ghi file vào thư mục uploads
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # 🔹 URL truy cập file
        base_url = os.getenv("BASE_URL", "http://localhost:8000")
        file_url = f"{base_url}/uploads/{filename}"

        return JSONResponse({"url": file_url})

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
