# Project Backend Setup

This project includes:
- Frontend: `./chatbot_frontend` (React)
- Backend: `./chatbot_backend` (FastAPI)

## Quick Start (Backend)

1) Navigate to backend folder:
```
cd openai-chatbot-web-application-3147-3156/chatbot_backend
```

2) Create a virtual environment (optional but recommended) and install dependencies:
```
pip install -r requirements.txt
```

3) Copy `.env.example` to `.env` and set the values:
```
cp .env.example .env
# Edit .env to set OPENAI_API_KEY and optionally FRONTEND_ORIGIN, OPENAI_DEFAULT_MODEL
```

4) Start the server:
```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

5) Configure the frontend:
- In `chatbot_frontend/.env`, set:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

6) Run the frontend dev server:
```
cd ../chatbot_frontend
npm start
```

Now the frontend will POST to `http://localhost:8000/api/chat`.

## Endpoint Summary

- POST /api/chat
- GET / (service info)
- Swagger UI: /docs
- OpenAPI JSON: /openapi.json
