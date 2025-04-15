import { config } from "../config.js";

const STORAGE_KEY = 'errorsnap_logs';
const LAST_SENT_KEY = 'errorsnap_last_sent';
const SEND_INTERVAL = config.interval * 1000; // 60 seconds

export function saveErrorToStorage(error) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    stored.push({ ...error, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}
  
export async function flushStoredErrors() {
    const lastSent = parseInt(localStorage.getItem(LAST_SENT_KEY), 10) || 0;
    const now = Date.now();

    if (now - lastSent < SEND_INTERVAL) return;
  
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!stored.length) return;
  
    try {
      const payload = JSON.stringify({ logs: stored });
  
      // Try sendBeacon if available
      const success = navigator.sendBeacon(config.endpoint, payload);
  
      if (success) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(LAST_SENT_KEY, now.toString());
      } else {
        // Fallback to fetch if beacon fails
        return fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        }).then(() => {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(LAST_SENT_KEY, now.toString());
        });
      }
    } catch (err) {
      console.warn('errorsnap: beacon/fetch failed, will retry later.');
    }
}
  
export function startStorageQueueFlusher() {
    flushStoredErrors(); // Try on load
    setInterval(flushStoredErrors, 15 * 1000); // check every 15 sec
}
  