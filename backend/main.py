from fastapi import FastAPI
from api.v1 import auth

app = FastAPI(
    title="Images Studio API",
    description="API FastAPI kết nối Supabase",
    version="1.0.0"
)

# Include router
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "FastAPI + Supabase đang chạy!"}
