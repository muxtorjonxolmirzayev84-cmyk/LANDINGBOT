import { tg, isTelegram, versionAtLeast } from './telegram.js';

export const local = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
};

const useCloud = () => isTelegram && versionAtLeast('6.9') && tg?.CloudStorage;

/** Telegram CloudStorage (barcha qurilmalarda saqlanadi), bo'lmasa localStorage */
export function cloudGet(key) {
  return new Promise((resolve) => {
    const fallback = () => resolve(local.get(key));
    if (!useCloud()) return fallback();
    const timer = setTimeout(fallback, 1500);
    try {
      tg.CloudStorage.getItem(key, (err, value) => {
        clearTimeout(timer);
        resolve(err ? local.get(key) : value || local.get(key));
      });
    } catch {
      clearTimeout(timer);
      fallback();
    }
  });
}

export function cloudSet(key, value) {
  local.set(key, value);
  if (!useCloud()) return;
  try {
    tg.CloudStorage.setItem(key, value, () => {});
  } catch {
    /* ignore */
  }
}
