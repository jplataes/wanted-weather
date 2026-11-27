// storage.js — safe wrappers around the browser's storage.
// Private windows or blocked storage can throw: the app must keep working without it.

function wrap(getArea) {
  return {
    get(key, fallback = null) {
      try {
        const raw = getArea().getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        getArea().setItem(key, JSON.stringify(value));
      } catch {
        /* storage unavailable: ignore */
      }
    },
  };
}

export const local = wrap(() => window.localStorage);
export const session = wrap(() => window.sessionStorage);

const LAST_KEY = 'ww.last';

/** Remember the last successful result so the next visit shows something instantly. */
export function saveLastResult(data, place) {
  local.set(LAST_KEY, { data, place, savedAt: Date.now() });
}

/** @returns {{data: object, place: object, savedAt: number} | null} */
export function loadLastResult() {
  const last = local.get(LAST_KEY);
  return last && last.data && last.place ? last : null;
}
