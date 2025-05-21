import { config } from './config.js';
import { addBreadcrumb } from './breadcrumbs.js';
import { globalErrorHandler, unhandledRejectionHandler, manualNotify } from './handlers.js';

import { trackClicks } from './plugins/clickTracker.js';
import { trackNavigation } from './plugins/navigationTracker.js';
import { trackFetch } from './plugins/fetchTracker.js';
import { trackConsole } from './plugins/consoleTracker.js';
import { flushStoredErrors, startStorageQueueFlusher } from './plugins/storageQueue.js';

function init(options = {}, globalObject=window) {
  if (options.endpoint) config.endpoint = options.endpoint;
  if (options.maxBreadcrumbs) config.maxBreadcrumbs = options.maxBreadcrumbs;
  if (options.env) config.env = options.env;
  if(options.interval) config.interval = options.interval;

  addBreadcrumb({ type: 'init', message: 'BugSnap initialized' });

  // ✅ Attach global error handlers
  if(options.env !== 'DEVELOPMENT') {
    globalObject.addEventListener("error", globalErrorHandler);
    globalObject.addEventListener("unhandledrejection", unhandledRejectionHandler);
    globalObject.addEventListener('beforeunload', () => {
      flushStoredErrors(); // flush unsent data on tab close
    });
  }

  // plugins
  trackClicks();
  trackNavigation();
  trackFetch();
  trackConsole(options.consoleTypes || ['log', 'warn', 'error', 'info']);
  startStorageQueueFlusher(); // Start flusher here
}

function setUser(userInfo) {
  config.user = userInfo;
}

export default {
  init,
  setUser,
  notify: manualNotify,
  addBreadcrumb,
};
