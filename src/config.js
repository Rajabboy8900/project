export const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (window.location.protocol === 'https:' ? '' : `http://${window.location.hostname}:5000`);
