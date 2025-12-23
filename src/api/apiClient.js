const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('rb_token');
}

export async function post(path, body, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function get(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'GET', headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export default { post, get };
