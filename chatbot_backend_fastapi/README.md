# Chatbot Backend (FastAPI)

A minimal FastAPI backend that supports CORS for a React frontend and exposes:
- GET /health
- POST /messages

It accepts a JSON payload `{"message": string}` and returns `{"reply": string}`.
The `/messages` endpoint uses the OpenAI Chat Completions API (non‑streaming) with a system prompt:
"You are a helpful assistant."

## Requirements

- Python 3.9+ recommended
- See `requirements.txt` for Python dependencies:
  - fastapi==0.110.0
  - uvicorn[standard]==0.29.0
  - openai>=1.40.0

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

3) Set your OpenAI API key in the shell environment (do NOT hardcode it):

   macOS/Linux:
   ```
   export OPENAI_API_KEY="sk-...your-key..."
   ```

   Windows (PowerShell):
   ```
   setx OPENAI_API_KEY "sk-...your-key..."
   # restart terminal or `powershell` for changes to take effect in a new session
   ```

   Optional: choose model (default is `gpt-4o-mini`)
   ```
   export OPENAI_MODEL="gpt-4o-mini"
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
  - 503 if OpenAI is not configured or the call fails:
    ```
    { "error": { "message": "..." } }
    ```
  - Success Response: `{"reply": "<assistant reply text>"}`

## Example curl

```
curl -s -X POST http://localhost:8000/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello there"}'
```

Expected output:
```
{"reply":"Hello! How can I help you today?"}
```

## Data Models

- MessageRequest { message: str }
- MessageResponse { reply: str }

These are defined in `app.py`.

## Notes

- The server reads `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) from the shell environment.
- Timeout for the upstream OpenAI call is set to ~20 seconds.
- If your frontend payloads change (e.g., you add `history`), update the Pydantic models and handler in `app.py` accordingly to keep the contract aligned with the frontend.
- Default CORS origin is `http://localhost:3000`. Adjust `origins` in `app.py` if needed for other environments.
