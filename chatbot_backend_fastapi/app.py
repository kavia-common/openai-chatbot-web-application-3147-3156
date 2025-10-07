import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI app with metadata for API docs
app = FastAPI(
    title="Chatbot Backend (FastAPI)",
    description="A minimal FastAPI backend exposing a POST /messages endpoint and CORS enabled for a local React frontend.",
    version="0.2.0",
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


def _get_openai_client():
    """
    Internal helper to create an OpenAI client using env var OPENAI_API_KEY.
    Returns None if key is not available.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    try:
        # openai>=1.0 style client
        from openai import OpenAI  # lazy import so app starts even if not installed yet
        client = OpenAI(api_key=api_key, timeout=20.0)  # 20s timeout as required
        return client
    except Exception:
        # If import fails or any client construction error, treat as unavailable
        return None


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
        503: {"description": "Upstream model service not available or failed.", "content": {"application/json": {}}},
    },
)
def post_message(payload: MessageRequest) -> MessageResponse:
    """
    Chat messages endpoint.

    Parameters:
        payload: MessageRequest
            - message: the user's text message; must be non-empty after trimming whitespace.

    Returns:
        MessageResponse: {"reply": "<assistant reply text>"}

    Raises:
        HTTPException 400 if message is empty or whitespace only.
        HTTPException 503 if OpenAI API key is missing or the OpenAI call fails.
    """
    # Basic validation: non-empty after trimming
    msg = (payload.message or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Prepare OpenAI client
    client = _get_openai_client()
    if client is None:
        # Key missing or client unavailable
        raise HTTPException(
            status_code=503,
            detail={"message": "OpenAI is not configured. Set OPENAI_API_KEY in the environment."},
        )

    # Minimal, non-streaming chat: system + user messages
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": msg},
    ]

    try:
        # Use Chat Completions API (openai>=1.0 style)
        # Default to a safe, widely available model name; can be customized via env if desired.
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        result = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
        )

        # Extract text safely
        choice = (result.choices or [None])[0]
        reply_text = (choice and choice.message and choice.message.content) or ""
        reply_text = reply_text.strip()

        if not reply_text:
            # Upstream returned no content; return 503
            raise HTTPException(
                status_code=503,
                detail={"message": "OpenAI response was empty."},
            )

        return MessageResponse(reply=reply_text)

    except HTTPException:
        # Re-raise our own explicit HTTPExceptions
        raise
    except Exception as e:
        # On any OpenAI/network failure, return 503 per requirements
        raise HTTPException(
            status_code=503,
            detail={"message": f"Failed to get response from OpenAI: {str(e)}"},
        )
