import { config } from './config.js';

const breadcrumbs = [];

export function addBreadcrumb({ type, category = 'ui', message, data = {} }) {
  breadcrumbs.push({
    type,
    category,
    message,
    data,
    timestamp: new Date().toISOString(),
  });

  if (breadcrumbs.length > config.maxBreadcrumbs) {
    breadcrumbs.shift();
  }
}

export function getBreadcrumbs() {
  return [...breadcrumbs];
}
