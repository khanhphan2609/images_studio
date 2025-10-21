from fastapi import APIRouter
from models.user import User, UserCreate
from services.user_service import get_users, create_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.get("/users", response_model=list[User])
def api_get_users():
    return get_users()

@router.post("/users", response_model=User)
def api_create_user(user: UserCreate):
    return create_user(user)
