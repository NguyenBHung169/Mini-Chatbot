from datetime import datetime
from pydantic import BaseModel, Field


class UserInfo(BaseModel):
    uid: str
    email: str | None = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    id: int
    question: str
    answer: str
    created_at: datetime


class MessageResponse(BaseModel):
    id: int
    question: str
    answer: str
    created_at: datetime

    model_config = {"from_attributes": True}
