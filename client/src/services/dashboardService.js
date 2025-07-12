const API_BASE = 'http://localhost:5000/api/needy';

export const getProfile = async (token) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};

export const updateProfile = async (data, token) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const searchDonors = async (searchQuery, region, token) => {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ searchQuery, region })
  });
  return res.json();
};

export const changePassword = async (passwordData, token) => {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  });
  return res.json();
};
