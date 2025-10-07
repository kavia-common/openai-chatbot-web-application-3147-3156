# Chatbot Backend (FastAPI)

A minimal FastAPI backend that supports CORS for a React frontend and exposes:
- GET /health
- POST /messages

It accepts a JSON payload `{"message": string}` and returns `{"reply": string}` with a simple echo-style response.

## Requirements

- Python 3.9+ recommended
- See `requirements.txt` for Python dependencies:
  - fastapi==0.110.0
  - uvicorn[standard]==0.29.0

## Setup

1) Create and activate a virtual environment (recommended):

   macOS/Linux:
   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   Windows (PowerShell):
   ```
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2) Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Run

From this directory:
```
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

- The API will be available at http://localhost:8000
- Interactive docs at http://localhost:8000/docs
- CORS is enabled for http://localhost:3000 by default so the React app can call it locally.

## Endpoints

- GET `/health`
  - Response: `{"status": "ok"}`

- POST `/messages`
  - Request: `{"message": "Hello there"}`  
  - 400 if message is empty or only whitespace: `{"detail": "Message cannot be empty"}`
  - Response: `{"reply": "You said: Hello there"}`

## Data Models

- MessageRequest { message: str }
- MessageResponse { reply: str }

These are defined in `app.py`.

## Notes

- If your frontend payloads change (e.g., you add `history`), update the Pydantic models and handler in `app.py` accordingly to keep the contract aligned with the frontend.
- Default CORS origin is `http://localhost:3000`. Adjust `origins` in `app.py` if needed for other environments.
