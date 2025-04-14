import { addBreadcrumb } from '../breadcrumbs.js';

export function trackNavigation() {
  let lastUrl = location.href;
  const recordNav = (from, to) => {
    addBreadcrumb({
      type: 'navigation',
      message: `from: ${from} to: ${to}`,
    });
  };

  const patchHistoryMethod = (method) => {
    const original = history[method];
    history[method] = function (...args) {
      const url = args[2] ? String(args[2]) : location.href;
      recordNav(lastUrl, url);
      lastUrl = url;
      return original.apply(this, args);
    };
  };

  ['pushState', 'replaceState'].forEach(patchHistoryMethod);

  window.addEventListener('popstate', () => {
    const url = location.href;
    recordNav(lastUrl, url);
    lastUrl = url;
  });
}
