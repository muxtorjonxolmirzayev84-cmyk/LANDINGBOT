import { initData } from './telegram.js';

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
        'ngrok-skip-browser-warning': '1',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error("Internet aloqasini tekshiring"), { status: 0 });
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || (res.status >= 500 ? "Server bilan aloqa yo'q. Birozdan so'ng urinib ko'ring." : `Xatolik (${res.status})`);
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data;
}

export const api = {
  products: () => request('/api/client/products'),
  config: () => request('/api/client/config'),
  me: () => request('/api/client/me'),
  orders: () => request('/api/client/orders'),
  createOrder: (payload) => request('/api/client/orders', { method: 'POST', body: payload }),
};
