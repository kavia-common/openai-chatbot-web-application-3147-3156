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
  const endpointCandidates = ['/chat', '/messages'];
  let lastError;
  for (let i = 0; i < endpointCandidates.length; i++) {
    const path = endpointCandidates[i];
    const url = `${base}${path}`;
    const payload = CONFIG.SUPPORTS_HISTORY ? { message, history } : { message };
    try {
      const resp = await withTimeout(fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }), CONFIG.REQUEST_TIMEOUT_MS, controller);
      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      const data = await resp.json();
      const reply = (data && (data.reply || (data.message && data.message.content))) || '';
      if (!reply) throw new Error('Malformed response');
      return { ok: true, reply, data };
    } catch (e) {
      lastError = e;
      await sleep(400); // simple backoff before next candidate/ retry
    }
  }
  return { ok: false, error: lastError ? lastError.message : 'Unknown error' };
}
