from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str

class UserCreate(BaseModel):
    username: str
