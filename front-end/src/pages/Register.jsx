import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Avatar } from "@mui/material";

/**
 * Register with preferred currency & profile picture.
 */
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", preferredCurrency: "USD", profilePicture: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      const data = res.data;
      login({ name: data.name, email: data.email, preferredCurrency: data.preferredCurrency, twoFAEnabled: data.twoFAEnabled, profilePicture: data.profilePicture }, data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 520, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="name" label="Name" value={form.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="email" label="Email" value={form.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="password" name="password" label="Password" value={form.password} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Preferred Currency</InputLabel>
              <Select name="preferredCurrency" label="Preferred Currency" value={form.preferredCurrency} onChange={handleChange}>
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
                <MenuItem value="PKR">PKR (₨)</MenuItem>
                <MenuItem value="INR">INR (₹)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="profilePicture" label="Profile Picture URL (optional)" value={form.profilePicture} onChange={handleChange} />
          </Grid>
          {form.profilePicture && (
            <Grid item xs={12}>
              <Avatar src={form.profilePicture} sx={{ width: 56, height: 56, mx: "auto" }} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 1 }}>
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}