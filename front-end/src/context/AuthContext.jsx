import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import API from "../services/api";

/**
 * AuthContext: JWT auth + profile prefs + 2FA hooks + password reset via OTP
 * Works with your existing axios instance (services/api.js) and /auth/* endpoints.
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Persist preferred currency & profile picture locally for snappy UX
  const [preferredCurrency, setPreferredCurrency] = useState(
    localStorage.getItem("preferredCurrency") || "USD"
  );
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture") || ""
  );
  const [twoFAEnabled, setTwoFAEnabled] = useState(
    localStorage.getItem("twoFAEnabled") === "true" ? true : false
  );

  // Save auth token persistently
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Load profile on first mount if token exists
  useEffect(() => {
    const boot = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/auth/profile");
        const u = res.data || {};
        setUser(u);
        if (u.preferredCurrency) {
          setPreferredCurrency(u.preferredCurrency);
          localStorage.setItem("preferredCurrency", u.preferredCurrency);
        }
        if (u.profilePicture) {
          setProfilePicture(u.profilePicture);
          localStorage.setItem("profilePicture", u.profilePicture);
        }
        if (typeof u.twoFAEnabled === "boolean") {
          setTwoFAEnabled(u.twoFAEnabled);
          localStorage.setItem("twoFAEnabled", String(u.twoFAEnabled));
        }
      } catch {
        // invalid/expired token
        setUser(null);
        setToken("");
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [token]);

  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    if (userData?.preferredCurrency)
      localStorage.setItem("preferredCurrency", userData.preferredCurrency);
    if (userData?.profilePicture)
      localStorage.setItem("profilePicture", userData.profilePicture);
    if (typeof userData?.twoFAEnabled === "boolean")
      localStorage.setItem("twoFAEnabled", String(userData.twoFAEnabled));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    // keep currency/theme across sessions; remove 2FA interim secrets if any
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      // accepts: { name, email, password, preferredCurrency, profilePicture }
      const res = await API.put("/auth/profile", updates);
      const updated = res.data || {};
      setUser(updated);
      if (updated.preferredCurrency) {
        setPreferredCurrency(updated.preferredCurrency);
        localStorage.setItem("preferredCurrency", updated.preferredCurrency);
      }
      if (updated.profilePicture) {
        setProfilePicture(updated.profilePicture);
        localStorage.setItem("profilePicture", updated.profilePicture);
      }
      if (typeof updated.twoFAEnabled === "boolean") {
        setTwoFAEnabled(updated.twoFAEnabled);
        localStorage.setItem("twoFAEnabled", String(updated.twoFAEnabled));
      }
      return updated;
    },
    []
  );

  // OTP password reset (email-based)
  const requestPasswordReset = useCallback(async (email) => {
    // backend: POST /auth/password/request-otp { email }
    return API.post("/auth/password/request-otp", { email });
  }, []);

  const verifyOtpAndReset = useCallback(async ({ email, otp, newPassword }) => {
    // backend: POST /auth/password/verify-otp { email, otp, newPassword }
    return API.post("/auth/password/verify-otp", { email, otp, newPassword });
  }, []);

  // 2FA hooks (TOTP/SMS/email OTP – depends on backend)
  const enableTwoFA = useCallback(async () => {
    // backend: POST /auth/2fa/enable
    const res = await API.post("/auth/2fa/enable");
    setTwoFAEnabled(true);
    localStorage.setItem("twoFAEnabled", "true");
    return res.data; // e.g., QR or secret for TOTP
  }, []);

  const disableTwoFA = useCallback(async () => {
    // backend: POST /auth/2fa/disable
    await API.post("/auth/2fa/disable");
    setTwoFAEnabled(false);
    localStorage.setItem("twoFAEnabled", "false");
  }, []);

  // Multi-currency helpers
  const setCurrency = useCallback((code) => {
    setPreferredCurrency(code);
    localStorage.setItem("preferredCurrency", code);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      updateProfile,
      // password reset
      requestPasswordReset,
      verifyOtpAndReset,
      // 2FA
      twoFAEnabled,
      enableTwoFA,
      disableTwoFA,
      // currency
      preferredCurrency,
      setCurrency,
      profilePicture,
      setProfilePicture,
    }),
    [
      user,
      token,
      loading,
      login,
      logout,
      updateProfile,
      requestPasswordReset,
      verifyOtpAndReset,
      twoFAEnabled,
      enableTwoFA,
      disableTwoFA,
      preferredCurrency,
      setCurrency,
      profilePicture,
    ]
  );
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
