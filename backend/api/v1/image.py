# backend/app/api/v1/image.py
import os
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from google.genai import types
from io import BytesIO
import base64
from PIL import Image

router = APIRouter()

# Khởi tạo client GenAI, tự lấy GEMINI_API_KEY từ biến môi trường
client = genai.Client()

class ImageGenRequest(BaseModel):
    prompt: str

@router.post("/generate-image")
def generate_image(data: ImageGenRequest):
    try:
        response = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=data.prompt,
            config=types.GenerateImagesConfig(
            )
        )

        # Lấy ảnh đầu tiên làm demo, convert sang base64
        pil_image = response.generated_images[0].image
        buffer = BytesIO()
        pil_image.save(buffer, format="PNG")
        img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return {"image": f"data:image/png;base64,{img_base64}"}

    except Exception as e:
        return {"error": str(e)}
