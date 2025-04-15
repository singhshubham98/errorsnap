import { addBreadcrumb } from '../breadcrumbs.js';

export function trackFetch() {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const url = args[0];
    const options = args[1] || {};
    const method = options.method || 'GET';
    const startTime = performance.now(); // ⏱️ Start timing

    // Record the request
    addBreadcrumb({
      type: 'fetch',
      category: 'request',
      data: {
        url,
        method,
      },
    });

    try {
      const response = await originalFetch.apply(this, args);
      const duration = (performance.now() - startTime).toFixed(2); // ⏱️ Calculate duration

      // Record the response
      addBreadcrumb({
        type: 'fetch',
        category: 'response',
        data: {
          url,
          method,
          status: response.status,
          duration: `${duration}ms`,
        },
      });

      return response;
    } catch (error) {
      const duration = (performance.now() - startTime).toFixed(2); // ⏱️ Duration even in error

      // Record the error
      addBreadcrumb({
        type: 'fetch',
        category: 'error',
        data: {
          url,
          method,
          error: error.message,
          duration: `${duration}ms`,
        },
      });

      throw error;
    }
  };
}
