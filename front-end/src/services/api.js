import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach token for every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  // Optional: send refresh token if stored
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    req.headers["x-refresh-token"] = refreshToken;
  }

  return req;
});

// Handle errors globally (optional)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired or invalid — logout user
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;