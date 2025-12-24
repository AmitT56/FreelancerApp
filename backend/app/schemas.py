from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Authentication schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Client schemas
class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    notes: Optional[str] = None
    requested_start: Optional[datetime] = None
    requested_duration_minutes: Optional[int] = 60


class ClientOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


class EventOut(BaseModel):
    id: int
    client_id: int
    title: str
    start: datetime
    end: datetime
    all_day: bool

    class Config:
        orm_mode = True