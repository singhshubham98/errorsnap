import { reportError } from './reporter.js';

export function globalErrorHandler(errorEvent) {
  reportError({
    type: 'error',
    errorEvent
  });
}

export function unhandledRejectionHandler(errorEvent) {
  reportError({
    type: 'unhandledrejection',
    errorEvent
  });
}

export function manualNotify(error, metadata = {}) {
  reportError({
    type: 'manual',
    message: error.message,
    stack: error.stack,
    metadata,
  });
}