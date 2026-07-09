import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Override the default transformRequest to handle FormData
apiClient.defaults.transformRequest = [(data, headers) => {
  if (data instanceof FormData) {
    delete headers['Content-Type'];
    return data;
  }
  return data;
}, ...axios.defaults.transformRequest];

export const withAuth = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

export const unwrapApiError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request failed';
  }

  return error?.message || 'Request failed';
};
