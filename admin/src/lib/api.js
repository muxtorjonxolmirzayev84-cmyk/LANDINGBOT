const TOKEN_KEY = 'pizza_admin_token';
let unauthorizedHandler = () => {};

export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`/api/admin${path}`, { method, headers, body: payload });
  } catch {
    throw new Error("Server bilan aloqa yo'q. Backend ishlayaptimi?");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401 && path !== '/login') {
    clearToken();
    unauthorizedHandler();
  }
  if (!res.ok) {
    throw new Error(data?.error || (res.status >= 500 ? "Server bilan aloqa yo'q. Backend ishlayaptimi?" : `Xatolik: ${res.status}`));
  }
  return data;
}

export const adminApi = {
  login: (password) => request('/login', { method: 'POST', body: { password } }),
  orders: () => request('/orders'),
  setOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),
  products: () => request('/products'),
  createProduct: (data) => request('/products', { method: 'POST', body: data }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  upload: (file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/upload', { method: 'POST', form });
  },
};
