// export const getAuthStatus = () => {
//   const token = localStorage.getItem('jwtToken');
//   const expiryDate = localStorage.getItem('jwtTokenExpiration');
//   console.log("is Authenticated", token, expiryDate);
//   if (!token || !expiryDate) {
//     return { isAuthenticated: false, token: null, expiryDate: null };
//   }
//
//   const isExpired = new Date(expiryDate) < new Date();
//   return { isAuthenticated: !isExpired, token, expiryDate };
// };

export const getAuthStatus = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwtToken');
    const expiryDate = localStorage.getItem('jwtTokenExpiration');
    console.log("is Authenticated", token, expiryDate);
    if (!token || !expiryDate) {
      return { isAuthenticated: false };
    }
    return { isAuthenticated: true };
  }
  return { isAuthenticated: false };
};

export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('jwtTokenExpiration');
  window.location.reload();
};

export const login = (token: string, expiryDate: string) => {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('jwtTokenExpiration', expiryDate);
  window.location.reload();
  window.location.href = '/';
};