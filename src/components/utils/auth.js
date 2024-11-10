// utils/auth.js
export const setToken = (token) => {
  localStorage.setItem("token", token); // Store token in localStorage
};

export const getToken = () => {
  return localStorage.getItem("token"); // Retrieve token from localStorage
};

export const removeToken = () => {
  localStorage.removeItem("token"); // Remove token from localStorage
};
