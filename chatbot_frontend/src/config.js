export const CONFIG = {
  // Resolve base URL with precedence: env var -> window override -> default
  // Default must be http://localhost:8000
  API_BASE_URL:
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
    (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.API_BASE_URL) ||
    'http://localhost:8000',
  REQUEST_TIMEOUT_MS: 30000,
  SUPPORTS_HISTORY: true,
  HISTORY_LIMIT: 10,
};
export default CONFIG;
