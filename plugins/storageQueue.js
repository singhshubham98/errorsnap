import { config } from "../config.js";
import { generateUUID, getBrowserAndSystemInfo } from "../utils.js";

const STORAGE_KEY = 'errorsnap_logs';
const LAST_SENT_KEY = 'errorsnap_last_sent';
const SEND_INTERVAL = config.interval * 1000 || 60000; // Default 60 sec

function hashError(error) {
  return `${error.context?.errorMessage}-${error.context?.url}-${error.context?.simplifiedStackTrace || ''}`;
}

export function saveErrorToStorage(error) {
  const { logs } = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"logs":[],"browserAndSystemInfo":{}}');
  const errorHash = hashError(error);
  // Check if the same hash already exists in storage
  const existingLog = logs.find(log => hashError(log) === errorHash);

  if (existingLog) {
    // If exists, increment its count safely
    existingLog.count = (existingLog.count || 1) + 1;
    existingLog.timestamp = new Date().toISOString(); // Optionally update timestamp
  } else {
    // If not, add a new log entry
    logs.push({
      ...error,
      count: 1,
      id: generateUUID(),
      timestamp: new Date().toISOString()
    });
  }

  // Save updated logs and system info to storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    logs,
    browserAndSystemInfo: getBrowserAndSystemInfo(config.user)
  }));
}

export async function flushStoredErrors() {
  const lastSent = parseInt(localStorage.getItem(LAST_SENT_KEY), 10) || 0;
  const now = Date.now();

  if (now - lastSent < SEND_INTERVAL) return;

  const {logs, browserAndSystemInfo} = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!logs.length) return;

  try {
    const payload = JSON.stringify({ logs, browserAndSystemInfo});

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
  