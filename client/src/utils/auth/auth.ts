/**
 * Returns JWT stored in browser storage
 * @returns {string} JWT
 */
export function authToken(): string | null {
  if (localStorage.getItem('token') !== null) {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Removes JWT token from browser storage
 */
export function clearToken() {
  localStorage.removeItem('token');
}
