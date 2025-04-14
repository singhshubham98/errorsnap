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
      message: `Request: [${method}] ${url}`,
      data: {
        url,
        method,
        timestamp: new Date().toISOString(),
      },
    });

    try {
      const response = await originalFetch.apply(this, args);
      const duration = (performance.now() - startTime).toFixed(2); // ⏱️ Calculate duration

      // Record the response
      addBreadcrumb({
        type: 'fetch',
        category: 'response',
        message: `Response: [${method}] ${url} - Status: ${response.status} - Duration: ${duration}ms`,
        data: {
          url,
          method,
          status: response.status,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      });

      return response;
    } catch (error) {
      const duration = (performance.now() - startTime).toFixed(2); // ⏱️ Duration even in error

      // Record the error
      addBreadcrumb({
        type: 'fetch',
        category: 'error',
        message: `Fetch error: [${method}] ${url} - ${error.message} - Duration: ${duration}ms`,
        data: {
          url,
          method,
          error: error.message,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      });

      throw error;
    }
  };
}
