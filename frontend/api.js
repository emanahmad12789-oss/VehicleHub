// API_URL is empty in production (same-origin — frontend and backend served from same Vercel URL).
// For local development, set VITE_API_URL in frontend/.env to your local backend URL like http://localhost:5000
const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

export default API_URL;
