/**
 * Simple REST API client to communicate with chatbot_backend.
 * The base URL is provided via environment variable REACT_APP_BACKEND_URL.
 * Ensure this is set in .env for deployments.
 */

const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * INTERNAL helper to handle fetch with JSON.
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
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  const data = await res.json().catch(() => ({}));
  return data;
}

// PUBLIC_INTERFACE
export async function sendMessage(message) {
  /** Sends the user's message to the backend and returns the parsed JSON response.
   * Expected backend route: POST /api/chat
   * Payload: { message: string }
   * Response: { reply: string }
   */
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}
