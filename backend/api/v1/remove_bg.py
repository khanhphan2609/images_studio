from fastapi import APIRouter
from pydantic import BaseModel
from rembg import remove
from io import BytesIO
import base64
from PIL import Image

router = APIRouter()

class ImageRequest(BaseModel):
    image: str  # Base64 encoded image

@router.post("/remove-bg")
def remove_background(data: ImageRequest):
    try:
        # Giải mã base64 -> ảnh gốc
        image_data = base64.b64decode(data.image.split(",")[1])
        input_image = Image.open(BytesIO(image_data))

        # Xoá nền bằng thư viện rembg
        output = remove(input_image)

        # Convert ảnh đã xoá nền về base64
        buffer = BytesIO()
        output.save(buffer, format="PNG")
        base64_output = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return {"image": f"data:image/png;base64,{base64_output}"}
    except Exception as e:
        return {"error": str(e)}
