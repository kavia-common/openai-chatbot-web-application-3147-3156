/**
 * Simple REST API client to communicate with chatbot_backend.
 * The base URL is provided via environment variable REACT_APP_BACKEND_URL.
 * Ensure this is set in .env for deployments.
 */

const BASE_URL_RAW = (process.env.REACT_APP_BACKEND_URL || '').trim();
if (!BASE_URL_RAW) {
  // Fail fast with a clear message to help developers configure the environment.
  throw new Error(
    "Missing REACT_APP_BACKEND_URL. Set it in chatbot_frontend/.env (e.g., REACT_APP_BACKEND_URL=http://localhost:8000)"
  );
}
// Normalize to avoid double slashes when joining paths
const BASE_URL = BASE_URL_RAW.replace(/\/+$/, '');

/**
 * INTERNAL helper to handle fetch with JSON and improved error surface.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  };

  let res;
  try {
    res = await fetch(url, init);
  } catch (networkErr) {
    // Network-level error (CORS, DNS, connection refused, etc.)
    const message = networkErr?.message || 'Network error';
    throw new Error(`Network error contacting backend: ${message}`);
  }

  // Try to parse JSON first to extract meaningful error details from backend
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    // Attempt to parse JSON error shape from FastAPI if available; fallback to text
    if (contentType.includes('application/json')) {
      const errJson = await res.json().catch(() => ({}));
      const detail = errJson?.detail || JSON.stringify(errJson) || 'Unknown error';
      throw new Error(`HTTP ${res.status}: ${detail}`);
    } else {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text || 'Unknown error'}`);
    }
  }

  // Success path: parse JSON, fallback to empty object
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => ({}))
    : {};
  return data;
}

// PUBLIC_INTERFACE
export async function sendMessage(message) {
  /** Sends the user's message to the backend and returns the parsed JSON response.
   * Expected backend route: POST /api/chat
   * Payload: { message: string }
   * Response: { reply: string, used_model?: string }
   */
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}
