import api from './apiClient';

export async function register(formData) {
  return api.post('/api/auth/register', formData);
}

export async function login(payload) {
  const body = JSON.stringify(payload);
  return api.post('/api/auth/login', body, { headers: { 'Content-Type': 'application/json' } });
}

export default { register, login };
