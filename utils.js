const errorMessage = (errorEvent, type) => {
  if(type === "unhandledrejection") {
    return errorEvent.reason && errorEvent.reason.message ? errorEvent.reason.message : "Unknown error";
  }
  return errorEvent.error ? errorEvent.error.message : "Unknown error";
}

const stackTrace = (errorEvent, type) => {
  if(type === "unhandledrejection") {
    return errorEvent.reason && errorEvent.reason.stack ? errorEvent.reason.stack : "No stack trace";
  }
  return errorEvent.error && errorEvent.error.stack ? errorEvent.error.stack : "No stack trace";
}

export function sanitize(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return obj;
    }
}
  
export function getContext(user, errorEvent, type) {
  return {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userInfo: user,
    errorMessage: errorMessage(errorEvent, type),
    simplifiedStackTrace: stackTrace(errorEvent, type),
    userAgent: navigator.userAgent,
    browserInfo: getBrowserInfo(),
    operatingSystem: getOperatingSystem(),
  };
}

// Function to get browser details
export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserInfo = "Unknown";

  if (userAgent.indexOf("Chrome") !== -1) {
    browserInfo = "Google Chrome";
  } else if (userAgent.indexOf("Safari") !== -1) {
    browserInfo = "Safari";
  } else if (userAgent.indexOf("Firefox") !== -1) {
    browserInfo = "Mozilla Firefox";
  } else if (userAgent.indexOf("Edge") !== -1) {
    browserInfo = "Microsoft Edge";
  } else if (
    userAgent.indexOf("MSIE") !== -1 ||
    userAgent.indexOf("Trident") !== -1
  ) {
    browserInfo = "Internet Explorer";
  }

  return browserInfo;
}

// Function to get operating system details
export function getOperatingSystem() {
  const userAgent = navigator.userAgent;
  let osInfo = "Unknown";

  if (userAgent.indexOf("Win") !== -1) {
    osInfo = "Windows";
  } else if (userAgent.indexOf("Mac") !== -1) {
    osInfo = "MacOS";
  } else if (userAgent.indexOf("Linux") !== -1) {
    osInfo = "Linux";
  } else if (userAgent.indexOf("Android") !== -1) {
    osInfo = "Android";
  } else if (userAgent.indexOf("iOS") !== -1) {
    osInfo = "iOS";
  }
  return osInfo;
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
  