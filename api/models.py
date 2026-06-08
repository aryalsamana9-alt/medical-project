from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    date_of_birth: str  # ISO format date string
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class FormSubmitRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=1000)


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    date_of_birth: str


class TokenResponse(BaseModel):
    token: str
    user: UserResponse


class FormSubmissionResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    submitted_at: str