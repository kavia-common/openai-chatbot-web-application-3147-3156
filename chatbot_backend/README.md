# Chatbot Backend (FastAPI)

A lightweight FastAPI service that exposes a chat endpoint and proxies requests to OpenAI's API.

Features:
- POST /api/chat accepts a message and optional conversation and returns the assistant reply.
- CORS enabled for frontend integration.
- Conversation context support with a configurable history window.
- OpenAPI docs at /docs and OpenAPI JSON at /openapi.json.

## Requirements

- Python 3.10+
- Environment variable: `OPENAI_API_KEY` (required)
- Optional environment variables:
  - `FRONTEND_ORIGIN` (default: `*`) — origin allowed for CORS (e.g., `http://localhost:3000`)
  - `OPENAI_DEFAULT_MODEL` (default: `gpt-3.5-turbo`)

## Setup

1. Create and activate a virtual environment (recommended).
2. Install dependencies:

```
pip install -r requirements.txt
```

3. Create `.env` (or set env vars in your shell). See `.env.example` for reference.

4. Run the server (development):

```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- http://localhost:8000/
- http://localhost:8000/docs
- http://localhost:8000/openapi.json

## Endpoint

- POST `/api/chat`
  - Request JSON:
    ```
    {
      "message": "Hello",
      "conversation": [
        { "role": "assistant", "content": "Hi! How can I help?" },
        { "role": "user", "content": "Tell me a joke." }
      ],
      "model": "gpt-3.5-turbo",
      "max_history": 8
    }
    ```
  - Response JSON:
    ```
    {
      "reply": "...",
      "used_model": "gpt-3.5-turbo"
    }
    ```

Errors:
- 400 if the input message is empty.
- 500 if `OPENAI_API_KEY` is missing or on upstream errors.

## Environment Variables

See `.env.example`:

- `OPENAI_API_KEY` — REQUIRED. Your OpenAI API key.
- `FRONTEND_ORIGIN` — Optional. Set to your frontend origin (e.g., `http://localhost:3000`) for strict CORS.
- `OPENAI_DEFAULT_MODEL` — Optional override of the default model.

## Frontend Integration

The React frontend expects:
- Base URL: `REACT_APP_BACKEND_URL` (e.g., `http://localhost:8000`)
- Endpoint: `POST ${REACT_APP_BACKEND_URL}/api/chat`
- Request: `{ "message": "..." }`
- Response: `{ "reply": "..." }`

Ensure CORS allows the frontend origin via `FRONTEND_ORIGIN`.

## Production Notes

- Run with a production ASGI server (e.g., uvicorn with workers or gunicorn with uvicorn workers).
- Set restrictive CORS via `FRONTEND_ORIGIN`.
- Never hardcode API keys. Use environment variables or a secure secret manager.
