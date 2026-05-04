from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .auth import CurrentUser
from .database import Base, engine, get_db
from .models import Message
from .schemas import ChatRequest, ChatResponse, MessageResponse, UserInfo

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini Chatbot Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_answer(message: str) -> str:
    text = message.strip()
    if "xin chao" in text.lower() or "hello" in text.lower():
        return "Xin chao! Minh la chatbot demo cua bai lab. Ban can minh ho tro gi?"
    return f"Bot da nhan: {text}"


@app.get("/")
def root():
    return {"message": "Mini Chatbot Lab API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/auth/me", response_model=UserInfo)
def me(user: UserInfo = CurrentUser):
    return user


@app.post("/chat", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    user: UserInfo = CurrentUser,
    db: Session = Depends(get_db),
):
    answer = build_answer(payload.message)
    message = Message(user_id=user.uid, question=payload.message.strip(), answer=answer)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@app.get("/messages", response_model=list[MessageResponse])
def messages(user: UserInfo = CurrentUser, db: Session = Depends(get_db)):
    return (
        db.query(Message)
        .filter(Message.user_id == user.uid)
        .order_by(Message.created_at.desc())
        .limit(50)
        .all()
    )
