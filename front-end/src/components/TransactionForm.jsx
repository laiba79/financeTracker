import { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Box, 
  FormControl,
  InputLabel,
  Typography,
  Chip,
  Autocomplete,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  InputAdornment
} from "@mui/material";
import { 
  Add, 
  Remove, 
  CalendarToday, 
  AccountBalance,
  Receipt,
  Repeat
} from "@mui/icons-material";
import { getCategories } from "../services/categoryService";

export default function TransactionForm({ onSubmit, initialData = null, mode = "add" }) {
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    paymentMethod: "",
    description: "",
    currency: "USD",
    location: "",
    tags: [],
    isRecurring: false,
    recurringFrequency: "monthly",
    recurringEndDate: "",
    attachments: []
  });

  const [categories, setCategories] = useState([]);
  const [paymentMethods] = useState([
    "Cash", "Credit Card", "Debit Card", "Bank Transfer", 
    "PayPal", "Digital Wallet", "Cryptocurrency", "Check"
  ]);
  const [commonTags] = useState([
    "Business", "Personal", "Tax Deductible", "Emergency", 
    "Investment", "Gift", "Travel", "Health", "Education"
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load categories
    getCategories()
      .then(res => {
        const filtered = res.data.filter(cat => cat.type === form.type);
        setCategories(filtered);
      })
      .catch(err => console.error("Error loading categories:", err));

    // Set initial data if editing
    if (initialData) {
      setForm(prevForm => ({ ...prevForm, ...initialData }));
    }
  }, [form.type, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Filter categories when type changes
    if (name === 'type') {
      getCategories()
        .then(res => {
          const filtered = res.data.filter(cat => cat.type === value);
          setCategories(filtered);
        });
      setForm(prev => ({ ...prev, category: "" })); // Reset category
    }
  };

  const handleTagsChange = (event, newValue) => {
    setForm(prev => ({ ...prev, tags: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.category) newErrors.category = "Category is required";
    if (!form.amount || form.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.paymentMethod) newErrors.paymentMethod = "Payment method is required";
    
    if (form.isRecurring) {
      if (!form.recurringEndDate) {
        newErrors.recurringEndDate = "End date is required for recurring transactions";
      } else if (new Date(form.recurringEndDate) <= new Date(form.date)) {
        newErrors.recurringEndDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submissionData = {
        ...form,
        amount: parseFloat(form.amount)
      };
      
      await onSubmit(submissionData);
      
      // Reset form only if adding new transaction
      if (mode === "add") {
        setForm({
          type: "expense",
          category: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          paymentMethod: "",
          description: "",
          currency: "USD",
          location: "",
          tags: [],
          isRecurring: false,
          recurringFrequency: "monthly",
          recurringEndDate: "",
          attachments: []
        });
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', PKR: '₨', INR: '₹' };
    return `${symbols[form.currency] || '$'}${amount}`;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" color="primary" gutterBottom>
        {mode === "add" ? "Add New Transaction" : "Edit Transaction"}
      </Typography>

      <Grid container spacing={3}>
        {/* Transaction Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Transaction Type</InputLabel>
            <Select 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              label="Transaction Type"
              startAdornment={
                <InputAdornment position="start">
                  {form.type === "income" ? <Add color="success" /> : <Remove color="error" />}
                </InputAdornment>
              }
            >
              <MenuItem value="income">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Add color="success" />
                  Income
                </Box>
              </MenuItem>
              <MenuItem value="expense">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Remove color="error" />
                  Expense
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Currency */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select name="currency" value={form.currency} onChange={handleChange} label="Currency">
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="PKR">PKR (₨)</MenuItem>
              <MenuItem value="INR">INR (₹)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Category */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              label="Category"
            >
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
        </Grid>

        {/* Amount */}
        <Grid item xs={12} sm={6}>
          <TextField 
            name="amount" 
            type="number" 
            label="Amount" 
            value={form.amount} 
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount || (form.amount ? `${formatCurrency(form.amount)}` : '')}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{form.currency}</InputAdornment>
            }}
          />
        </Grid>

        {/* Date */}
        <Grid item xs={12} sm={6}>
          <TextField 
            name="date" 
            type="date" 
            label="Date"
            value={form.date} 
            onChange={handleChange} 
            error={!!errors.date}
            helperText={errors.date}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={paymentMethods}
            value={form.paymentMethod}
            onChange={(event, newValue) => {
              setForm(prev => ({ ...prev, paymentMethod: newValue || "" }));
            }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Payment Method"
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12} sm={6}>
          <TextField 
            name="location" 
            label="Location (optional)" 
            value={form.location} 
            onChange={handleChange}
            fullWidth
            placeholder="Store, restaurant, ATM..."
          />
        </Grid>

        {/* Tags */}
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={commonTags}
            value={form.tags}
            onChange={handleTagsChange}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags (optional)"
                placeholder="Add tags to categorize your transaction"
              />
            )}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField 
            name="description" 
            label="Description" 
            value={form.description} 
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            placeholder="Add notes about this transaction..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Receipt />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Recurring Transaction */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isRecurring}
                onChange={handleChange}
                name="isRecurring"
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Repeat />
                Make this a recurring transaction
              </Box>
            }
          />
        </Grid>

        {/* Recurring Options */}
        {form.isRecurring && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select 
                  name="recurringFrequency" 
                  value={form.recurringFrequency} 
                  onChange={handleChange}
                  label="Frequency"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="recurringEndDate" 
                type="date" 
                label="End Date"
                value={form.recurringEndDate} 
                onChange={handleChange} 
                error={!!errors.recurringEndDate}
                helperText={errors.recurringEndDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                This transaction will repeat {form.recurringFrequency} until {form.recurringEndDate || 'end date not set'}.
              </Alert>
            </Grid>
          </>
        )}

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
            disabled={loading}
            sx={{ 
              mt: 2,
              py: 1.5,
              background: form.type === 'income' 
                ? 'linear-gradient(45deg, #4CAF50, #66BB6A)' 
                : 'linear-gradient(45deg, #F44336, #EF5350)'
            }}
          >
            {loading ? "Saving..." : mode === "add" ? "Add Transaction" : "Update Transaction"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}