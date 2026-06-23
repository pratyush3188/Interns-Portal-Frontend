import { useAuthStore, defaultProfiles } from '../store/useAuthStore';

const API_BASE_URL = "http://localhost:5000";

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const fetchOptions = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem("token", token);
  useAuthStore.getState().login(user);
};

