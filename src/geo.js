// geo.js — the browser's Geolocation API wrapped in a promise.

/**
 * Ask the browser where the user is.
 * Rejects if the user says no, the device can't tell, or it takes too long.
 * @returns {Promise<{lat: number, lon: number}>}
 */
export function getPosition(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout, maximumAge: 10 * 60 * 1000, enableHighAccuracy: false },
    );
  });
}
