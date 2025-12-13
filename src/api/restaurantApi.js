import api from './apiClient';

export async function getPendingRestaurants() {
  return api.get('/api/restaurants/pending');
}

export async function approveRestaurant(id) {
  return api.post(`/api/restaurants/${id}/approve`, JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
}

export default { getPendingRestaurants, approveRestaurant };
