import { config } from './config.js';
import { getBreadcrumbs } from './breadcrumbs.js';
import { sanitize, getContext } from './utils.js';

export function reportError(errorData) {
  const payload = sanitize({
    breadcrumbs: getBreadcrumbs(),
    context: getContext(config.user, errorData.errorEvent, errorData.type),
    type: errorData.type
  });

  const data = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(config.endpoint, data);
  } else {
    fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    }).catch(console.error);
  }
}
