import os
from functools import lru_cache
from fastapi import Depends, HTTPException, Request, status
from firebase_admin import auth as firebase_auth, credentials, initialize_app, get_app
from firebase_admin.exceptions import FirebaseError
from .schemas import UserInfo


@lru_cache
def init_firebase() -> bool:
    service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if not service_account:
        return False

    try:
        get_app()
        return True
    except ValueError:
        cred = credentials.Certificate(service_account)
        initialize_app(cred)
        return True


def get_current_user(request: Request) -> UserInfo:
    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Firebase bearer token",
        )

    if not init_firebase():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Backend chua cau hinh FIREBASE_SERVICE_ACCOUNT de verify token",
        )

    token = authorization.removeprefix("Bearer ").strip()
    try:
        decoded = firebase_auth.verify_id_token(token)
    except FirebaseError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token khong hop le",
        ) from exc

    return UserInfo(uid=decoded["uid"], email=decoded.get("email"))


CurrentUser = Depends(get_current_user)
