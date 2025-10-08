# Chatbot Frontend (React) — Ocean Professional Theme

A modern, minimalist React web application for chatting with an AI assistant.  
It features a top navigation bar, a scrollable chat window with message bubbles, and a fixed input field at the bottom. The frontend communicates with the chatbot_backend via HTTP REST.

## Features
- Ocean Professional design: blue primary, amber accents, subtle gradients, rounded corners, soft shadows.
- Responsive layout with sticky top navigation and bottom input bar.
- Accessible components with keyboard-friendly input and aria roles.
- Simple REST client with environment-based backend URL.

## Configure
1) Copy `.env.example` to `.env` and set the backend URL:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```
Expected backend endpoint:
- POST `${REACT_APP_BACKEND_URL}/api/chat`
- Request: `{ "message": "..." }`
- Response: `{ "reply": "...", "used_model": "..."? }`

2) Start the backend first (in a separate terminal):
```
cd ../chatbot_backend
pip install -r requirements.txt
# Copy .env.example to .env and set OPENAI_API_KEY (and optionally FRONTEND_ORIGIN)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Note: The backend requires `OPENAI_API_KEY` set in its environment. Do not put OpenAI keys in the frontend.

3) Run the frontend dev server:
```
npm install
npm start
```

## Scripts
- `npm start` — start development server
- `npm test` — run tests
- `npm run build` — production build

## Folder Structure
- `src/components/TopNav.jsx` — top navigation bar
- `src/components/ChatMessage.jsx` — message bubble
- `src/components/ChatInput.jsx` — bottom input
- `src/services/api.js` — REST API client
- `src/App.js` — main layout and chat logic
- `src/App.css` — theme and component styles

## Security Notes
- Never store or reference your OpenAI API key in the frontend. The frontend is public and all variables prefixed with `REACT_APP_` are exposed to the browser.
- The backend handles all communication with OpenAI and requires `OPENAI_API_KEY` in its own environment.
- The Ocean Professional theme is already applied across components and styles.
