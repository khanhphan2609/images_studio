from db.engine import supabase
from models.user import User, UserCreate
from fastapi import HTTPException

def get_users() -> list[User]:
    try:
        response = supabase.table("users").select("*").execute()
        if response.data is None:
            return []
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def create_user(user: UserCreate) -> User:
    try:
        response = supabase.table("users").insert({
            "username": user.username
        }).execute()

        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Không thể tạo user")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
