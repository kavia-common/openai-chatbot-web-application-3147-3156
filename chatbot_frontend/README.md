# Chatbot Frontend (React) — Ocean Professional Theme

A modern, minimalist React web application for chatting with an AI assistant.  
It features a top navigation bar, a scrollable chat window with message bubbles, and a fixed input field at the bottom. The frontend communicates with the chatbot_backend via HTTP REST.

## Features
- Ocean Professional design: blue primary, amber accents, subtle gradients, rounded corners, soft shadows.
- Responsive layout with sticky top navigation and bottom input bar.
- Accessible components with keyboard-friendly input and aria roles.
- Simple REST client with environment-based backend URL.

## Configure
1. Copy `.env.example` to `.env` and set the backend URL:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```
Expected backend endpoint:
- POST `${REACT_APP_BACKEND_URL}/api/chat`
- Request: `{ "message": "..." }`
- Response: `{ "reply": "..." }`

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

No additional dependencies required beyond React and react-scripts.
