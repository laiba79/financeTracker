import API from "./api";

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const refreshToken = () => API.post("/auth/refresh-token");

// Profile
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const updateProfilePicture = (formData) =>
  API.put("/auth/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// Password reset via OTP
export const requestPasswordReset = (email) =>
  API.post("/auth/password-reset/request", { email });
export const verifyOTP = (email, code) =>
  API.post("/auth/password-reset/verify", { email, code });
export const resetPassword = (email, newPassword) =>
  API.post("/auth/password-reset/confirm", { email, newPassword });

// Two-Factor Authentication (2FA)
export const enable2FA = () => API.post("/auth/2fa/enable");
export const verify2FA = (code) => API.post("/auth/2fa/verify", { code });

// Currency preference
export const updatePreferredCurrency = (currency) =>
  API.put("/auth/preferred-currency", { currency });