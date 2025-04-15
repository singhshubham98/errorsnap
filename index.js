import { config } from './config.js';
import { addBreadcrumb } from './breadcrumbs.js';
import { manualNotify } from './handlers.js';
import { globalErrorHandler, unhandledRejectionHandler } from './handlers.js';

import { trackClicks } from './plugins/clickTracker.js';
import { trackNavigation } from './plugins/navigationTracker.js';
import { trackFetch } from './plugins/fetchTracker.js';
import { trackConsole } from './plugins/consoleTracker.js';

function init(options = {}, globalObject=window) {
  if (options.endpoint) config.endpoint = options.endpoint;
  if (options.maxBreadcrumbs) config.maxBreadcrumbs = options.maxBreadcrumbs;
  if (options.env) config.env = options.env;

  // ✅ Attach global error handlers
  if(options.env !== 'DEVELOPMENT') {
    globalObject.addEventListener("error", globalErrorHandler);
    globalObject.addEventListener("unhandledrejection", unhandledRejectionHandler);
  }
  
  trackClicks();
  trackNavigation();
  trackFetch();
  trackConsole(options.consoleTypes || ['log', 'warn', 'error', 'info']);

  addBreadcrumb({ type: 'init', message: 'BugSnap initialized' });
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
