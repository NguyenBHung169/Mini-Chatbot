# Mini Chatbot Lab

Ung dung nho gom frontend va backend rieng biet, co Firebase Authentication va luu lich su chat vao SQLite.

## Cau truc

```text
mini_chatbot_lab/
|-- frontend/
|   |-- index.html
|   |-- styles.css
|   |-- app.js
|   |-- firebase-config.js.example
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- auth.py
|   |   |-- database.py
|   |   |-- models.py
|   |   |-- schemas.py
|   |-- requirements.txt
|-- README.md
|-- .gitignore
```

## Cai dat backend

```powershell
cd C:\Users\hungd\projects\mini_chatbot_lab\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Neu muon backend verify Firebase ID token that su, tao service account trong Firebase Console va dat bien moi truong:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT="C:\duong\dan\service-account.json"
```

## Chay backend

```powershell
cd C:\Users\hungd\projects\mini_chatbot_lab\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

API co cac endpoint:

- `GET /`
- `GET /health`
- `GET /auth/me`
- `POST /chat`
- `GET /messages`

## Cai dat Firebase frontend

1. Vao Firebase Console, tao project.
2. Bat Authentication bang Email/Password.
3. Tao Web App va copy firebase config.
4. Copy file mau:

```powershell
cd C:\Users\hungd\projects\mini_chatbot_lab\frontend
copy firebase-config.js.example firebase-config.js
```

5. Dien thong tin Firebase vao `frontend/firebase-config.js`.

## Chay frontend

Co the mo truc tiep file:

```text
C:\Users\hungd\projects\mini_chatbot_lab\frontend\index.html
```

Hoac chay server tinh:

```powershell
cd C:\Users\hungd\projects\mini_chatbot_lab\frontend
node server.cjs
```

Sau do mo `http://localhost:5173`.

## Cach demo

1. Chay backend tai `http://localhost:8000`.
2. Chay frontend.
3. Dang ky/dang nhap bang email va password Firebase.
4. Gui tin nhan trong khung chatbot.
5. Tin nhan va cau tra loi duoc luu trong database SQLite tai `backend/chatbot.db`.

## Quay lai project cu

Project cu van giu nguyen tai:

```text
C:\Users\hungd\projects\Smart_Travel_System_Food_Recommend
```

