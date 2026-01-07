const STORAGE_KEY = 'directional-auth-token';
let runtimeToken: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const readStoredToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStoredToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
};

export const tokenStorage = {
  save(token: string) {
    runtimeToken = token;
    writeStoredToken(token);
    notify();
  },
  load(): string | null {
    if (runtimeToken) return runtimeToken;
    const stored = readStoredToken();
    runtimeToken = stored;
    return stored;
  },
  clear() {
    runtimeToken = null;
    writeStoredToken(null);
    notify();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
