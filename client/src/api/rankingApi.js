const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const rankingApi = {
  getAll: (hsKind) => {
    const query = hsKind ? `?hsKind=${encodeURIComponent(hsKind)}` : '';
    return request(`/rankings${query}`);
  },
};
