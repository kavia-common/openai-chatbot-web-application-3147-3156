from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI app with metadata for API docs
app = FastAPI(
    title="Chatbot Backend (FastAPI)",
    description="A minimal FastAPI backend exposing a POST /messages endpoint and CORS enabled for a local React frontend.",
    version="0.1.0",
    openapi_tags=[
        {"name": "Health", "description": "Liveness and readiness endpoints."},
        {"name": "Chat", "description": "Endpoints for chat message interaction."},
    ],
)

# CORS configuration
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # restrict to local frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageRequest(BaseModel):
    """Request schema for sending a chat message."""
    message: str = Field(..., description="The user's message text.")


class MessageResponse(BaseModel):
    """Response schema for the chatbot reply."""
    reply: str = Field(..., description="The assistant's reply text.")


# PUBLIC_INTERFACE
@app.get("/health", tags=["Health"], summary="Health check", description="Returns a simple status payload for liveness/readiness.")
def health():
    """
    Health check endpoint.
    Returns:
        JSON object: {"status": "ok"}
    """
    return {"status": "ok"}


# PUBLIC_INTERFACE
@app.post(
    "/messages",
    response_model=MessageResponse,
    tags=["Chat"],
    summary="Send a chat message",
    description="Accepts a JSON payload with {'message': string} and returns {'reply': string}.",
    responses={
        200: {"description": "Successful response with assistant reply."},
        400: {"description": "Validation error or empty message.", "content": {"application/json": {}}},
    },
)
def post_message(payload: MessageRequest) -> MessageResponse:
    """
    Chat messages endpoint.

    Parameters:
        payload: MessageRequest
            - message: the user's text message; must be non-empty after trimming whitespace.

    Returns:
        MessageResponse: {"reply": "You said: <message>"}

    Raises:
        HTTPException 400 if message is empty or whitespace only.
    """
    # Basic validation: non-empty after trimming
    msg = (payload.message or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Simple echo-like response
    reply_text = f"You said: {msg}"
    return MessageResponse(reply=reply_text)
