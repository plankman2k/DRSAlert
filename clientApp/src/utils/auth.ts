// src/utils/auth.ts
export const getAuthStatus = () => {
  const token = localStorage.getItem('jwtToken');
  const expiryDate = localStorage.getItem('jwtTokenExpiration');

  if (!token || !expiryDate) {
    return { isAuthenticated: false, token: null, expiryDate: null };
  }

  const isExpired = new Date(expiryDate) < new Date();
  return { isAuthenticated: !isExpired, token, expiryDate };
};