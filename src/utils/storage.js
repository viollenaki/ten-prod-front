// SSR-safe localStorage helper
export function getItem(key, fallback = null) {
  try {
    if (typeof window === 'undefined') return fallback;
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeItem(key) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch {}
}
