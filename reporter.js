import { getBreadcrumbs } from './breadcrumbs.js';
import { sanitize, getContext } from './utils.js';
import { saveErrorToStorage } from './plugins/storageQueue.js';

export function reportError(errorData) {
  const payload = sanitize({
    breadcrumbs: getBreadcrumbs(),
    context: getContext(errorData.errorEvent, errorData.type),
    type: errorData.type
  });

  saveErrorToStorage(payload);
}
