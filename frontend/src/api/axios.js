import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Response interceptor to unwrap common error shapes
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Keep the error shape used by the app
    return Promise.reject(err);
  }
);

export default api;
