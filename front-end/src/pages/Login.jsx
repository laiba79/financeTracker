import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  Link as MuiLink,
} from "@mui/material";

/**
 * Login with optional 2FA step + "Forgot password" (OTP email).
 */
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [needOtp, setNeedOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, requestPasswordReset, verifyOtpAndReset } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Phase 1: normal login
      const res = await API.post("/auth/login", { email: form.email, password: form.password });
      const data = res.data || {};
      // If backend indicates OTP required for 2FA
      if (data.requireOtp) {
        setNeedOtp(true);
      } else {
        login({ name: data.name, email: data.email, preferredCurrency: data.preferredCurrency, twoFAEnabled: data.twoFAEnabled, profilePicture: data.profilePicture }, data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/auth/2fa/verify", { email: form.email, otp: form.otp });
      const data = res.data || {};
      login({ name: data.name, email: data.email, preferredCurrency: data.preferredCurrency, twoFAEnabled: data.twoFAEnabled, profilePicture: data.profilePicture }, data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email for OTP:");
    if (!email) return;
    try {
      await requestPasswordReset(email);
      const otp = prompt("Enter the OTP sent to your email:");
      if (!otp) return;
      const newPassword = prompt("Enter your new password:");
      if (!newPassword) return;
      await verifyOtpAndReset({ email, otp, newPassword });
      alert("Password reset successful. Please log in with your new password.");
    } catch (e) {
      alert("Failed to reset password.");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 420, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        {needOtp ? "Two-Factor Verification" : "Login"}
      </Typography>

      {!needOtp ? (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth name="email" label="Email" margin="normal" value={form.email} onChange={handleChange} />
          <TextField fullWidth type="password" name="password" label="Password" margin="normal" value={form.password} onChange={handleChange} />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleVerifyOtp}>
          <Typography variant="body2" color="text.secondary">
            Enter the 6-digit code from your authenticator / email / SMS.
          </Typography>
          <TextField fullWidth name="otp" label="OTP" margin="normal" value={form.otp} onChange={handleChange} />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} disabled={submitting}>
            {submitting ? "Verifying..." : "Verify & Continue"}
          </Button>
        </Box>
      )}

      <Stack direction="row" justifyContent="space-between" mt={2}>
        <MuiLink component="button" onClick={() => navigate("/register")}>
          Create account
        </MuiLink>
        <MuiLink component="button" onClick={handleForgotPassword}>
          Forgot password?
        </MuiLink>
      </Stack>
    </Paper>
  );
}