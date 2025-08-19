import { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography,
  Chip,
  Alert
} from "@mui/material";
import { getCategories } from "../services/categoryService";

export default function BudgetForm({ onSubmit, initialData = null, mode = "add" }) {
  const [form, setForm] = useState({ 
    category: "", 
    amount: "", 
    month: "", 
    year: "", 
    type: "monthly", // monthly, yearly, custom
    currency: "USD",
    description: "",
    alertThreshold: 80 // Alert when 80% of budget is reached
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load categories for dropdown
    getCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error loading categories:", err));

    // Set current month and year as defaults
    const now = new Date();
    setForm(prev => ({
      ...prev,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      ...(initialData || {}) // Override with initial data if editing
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.category) newErrors.category = "Category is required";
    if (!form.amount || form.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (form.type === "monthly" && (!form.month || form.month < 1 || form.month > 12)) {
      newErrors.month = "Valid month is required";
    }
    if (!form.year || form.year < 2020) newErrors.year = "Valid year is required";
    if (form.alertThreshold < 0 || form.alertThreshold > 100) {
      newErrors.alertThreshold = "Alert threshold must be between 0-100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(form);
      
      // Reset form only if adding new budget
      if (mode === "add") {
        const now = new Date();
        setForm({ 
          category: "", 
          amount: "", 
          month: now.getMonth() + 1, 
          year: now.getFullYear(),
          type: "monthly",
          currency: "USD",
          description: "",
          alertThreshold: 80
        });
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const selectedMonth = form.month ? new Date(2024, form.month - 1).toLocaleString('default', { month: 'long' }) : '';

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h6" color="primary">
        {mode === "add" ? "Create New Budget" : "Edit Budget"}
      </Typography>

      {/* Budget Type */}
      <FormControl error={!!errors.type}>
        <InputLabel>Budget Type</InputLabel>
        <Select name="type" value={form.type} onChange={handleChange} label="Budget Type">
          <MenuItem value="monthly">Monthly Budget</MenuItem>
          <MenuItem value="yearly">Yearly Budget</MenuItem>
          <MenuItem value="custom">Custom Period</MenuItem>
        </Select>
      </FormControl>

      {/* Category Selection */}
      <FormControl error={!!errors.category}>
        <InputLabel>Category</InputLabel>
        <Select name="category" value={form.category} onChange={handleChange} label="Category">
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat.name}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {cat.name}
                <Chip 
                  label={cat.type} 
                  size="small" 
                  color={cat.type === 'income' ? 'success' : 'error'}
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
        {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
      </FormControl>

      {/* Amount and Currency */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
        <TextField 
          name="amount" 
          type="number" 
          label="Budget Amount" 
          value={form.amount} 
          onChange={handleChange}
          error={!!errors.amount}
          helperText={errors.amount}
          inputProps={{ min: 0, step: 0.01 }}
        />
        <FormControl>
          <InputLabel>Currency</InputLabel>
          <Select name="currency" value={form.currency} onChange={handleChange} label="Currency">
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="EUR">EUR (€)</MenuItem>
            <MenuItem value="GBP">GBP (£)</MenuItem>
            <MenuItem value="PKR">PKR (₨)</MenuItem>
            <MenuItem value="INR">INR (₹)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Time Period */}
      {form.type === "monthly" && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField 
            name="month" 
            type="number" 
            label="Month" 
            value={form.month} 
            onChange={handleChange}
            error={!!errors.month}
            helperText={errors.month || `Selected: ${selectedMonth}`}
            inputProps={{ min: 1, max: 12 }}
          />
          <TextField 
            name="year" 
            type="number" 
            label="Year" 
            value={form.year} 
            onChange={handleChange}
            error={!!errors.year}
            helperText={errors.year}
            inputProps={{ min: 2020, max: 2030 }}
          />
        </Box>
      )}

      {form.type === "yearly" && (
        <TextField 
          name="year" 
          type="number" 
          label="Year" 
          value={form.year} 
          onChange={handleChange}
          error={!!errors.year}
          helperText={errors.year}
        />
      )}

      {/* Alert Threshold */}
      <TextField 
        name="alertThreshold" 
        type="number" 
        label="Alert Threshold (%)" 
        value={form.alertThreshold} 
        onChange={handleChange}
        error={!!errors.alertThreshold}
        helperText={errors.alertThreshold || "Get notified when spending reaches this percentage"}
        inputProps={{ min: 0, max: 100 }}
      />

      {/* Description */}
      <TextField 
        name="description" 
        label="Description (optional)" 
        value={form.description} 
        onChange={handleChange}
        multiline
        rows={2}
        placeholder="Add notes about this budget..."
      />

      {/* Current Budget Info */}
      {form.category && form.amount && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="body2">
            Setting {form.type} budget of {form.currency} {form.amount} for{" "}
            {form.category === "" ? "all categories" : form.category}
            {form.type === "monthly" && ` in ${selectedMonth} ${form.year}`}
            {form.type === "yearly" && ` for ${form.year}`}
          </Typography>
        </Alert>
      )}

      <Button 
        type="submit" 
        variant="contained" 
        size="large"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Saving..." : mode === "add" ? "Create Budget" : "Update Budget"}
      </Button>
    </Box>
  );
}