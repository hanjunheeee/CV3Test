export function log(message, ...args) {
  console.log(`[crawler] ${message}`, ...args);
}

export function logError(message, ...args) {
  console.error(`[crawler] ${message}`, ...args);
}
