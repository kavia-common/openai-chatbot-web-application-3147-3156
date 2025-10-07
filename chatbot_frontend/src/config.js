export const CONFIG = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || (window.__APP_CONFIG__ && window.__APP_CONFIG__.API_BASE_URL) || 'http://localhost:8000',
  REQUEST_TIMEOUT_MS: 30000,
  SUPPORTS_HISTORY: true,
  HISTORY_LIMIT: 10,
};
export default CONFIG;
