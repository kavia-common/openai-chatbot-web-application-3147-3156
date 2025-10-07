# Chatbot Frontend (React)

This is a simple React UI for a chatbot that connects to a backend via REST.

Environment config:
- REACT_APP_API_BASE_URL: Base URL for the backend (default http://localhost:8000). Create a `.env.development` file to override.

Development:
- Start frontend preview (port 3000). Ensure backend is running and CORS allows http://localhost:3000.

Endpoints assumed:
- POST /chat with JSON { message, history? } (primary)
- Response JSON contains either `reply` or `message.content`.
- Note: The backend may also expose POST /messages as a legacy alias to /chat for backward compatibility.

Verification / Troubleshooting:
- Backend base URL defaults to http://localhost:8000 (see src/config.js).
- To override, create `.env.development` with:
  ```
  REACT_APP_API_BASE_URL=http://localhost:8000
  ```
- Test the backend directly (primary endpoint):
  ```
  curl -i -X POST http://localhost:8000/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"hello"}'
  ```
  If this returns 404, restart the backend from its directory with:
  `uvicorn app:app --host 0.0.0.0 --port 8000 --reload`

Theme:
- Ocean Professional colors and light/dark toggle in the navbar.
