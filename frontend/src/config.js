export const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, '');
export const getToken = () => localStorage.getItem('token');
// Backward compatibility fallback for any legacy reference
export const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;