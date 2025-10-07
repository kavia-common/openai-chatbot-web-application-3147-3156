import { CONFIG } from '../config';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withTimeout(promise, ms, controller) {
  const timeout = new Promise((_, reject) => setTimeout(() => {
    controller && controller.abort();
    reject(new Error('Request timed out'));
  }, ms));
  return Promise.race([promise, timeout]);
}

// PUBLIC_INTERFACE
export async function getHealth() {
  /** Check backend health endpoint. Returns { ok: boolean, error?: string } */
  const controller = new AbortController();
  const url = `${CONFIG.API_BASE_URL.replace(/\/$/, '')}/health`;
  try {
    const resp = await withTimeout(fetch(url, { signal: controller.signal }), CONFIG.REQUEST_TIMEOUT_MS, controller);
    if (!resp.ok) throw new Error(`Health check failed: ${resp.status}`);
    return await resp.json().catch(() => ({ ok: true }));
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// PUBLIC_INTERFACE
export async function sendMessage({ message, history = [] }) {
  /** Send a chat message to the backend with optional history; returns { ok, reply, data?, error? } */
  const controller = new AbortController();
  const base = CONFIG.API_BASE_URL.replace(/\/$/, '');
  // Switch to primary /chat endpoint (legacy /messages still supported on backend)
  const url = `${base}/chat`;
  const payload = CONFIG.SUPPORTS_HISTORY ? { message, history } : { message };

  // Single-attempt send to the /chat endpoint; retain timeout and defensive parsing
  try {
    const resp = await withTimeout(fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }), CONFIG.REQUEST_TIMEOUT_MS, controller);

    if (!resp.ok) throw new Error(`API error ${resp.status}`);
    const data = await resp.json();
    // Defensive parsing remains: prefer data.reply, fallback to data.message.content if provided
    const reply = (data && (data.reply || (data.message && data.message.content))) || '';
    if (!reply) throw new Error('Malformed response');
    return { ok: true, reply, data };
  } catch (e) {
    // small delay for any UI consistency with previous retry pacing
    await sleep(100);
    return { ok: false, error: e.message || 'Unknown error' };
  }
}
