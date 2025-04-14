import { addBreadcrumb } from '../breadcrumbs.js';

export function trackConsole() {
  ['log', 'warn', 'error', 'info'].forEach((method) => {
    const original = console[method];

    console[method] = function (...args) {
      try {
        // Format each argument: stringify objects, keep strings and numbers clean
        const formattedArgs = args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return '[Circular Object]';
            }
          }
          return String(arg);
        });

        // Add breadcrumb with better formatting
        addBreadcrumb({
          type: 'console',
          category: method,
          message: formattedArgs.join(' '),
          timestamp: new Date().toISOString(),
        });
      } catch (breadcrumbError) {
        // If breadcrumb recording fails, still show original log
        original.call(console, 'Breadcrumb error:', breadcrumbError);
      }

      // Always call the original console method
      original.apply(console, args);
    };
  });
}