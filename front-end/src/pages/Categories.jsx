import { useEffect, useState } from "react";
import { getCategories, addCategory, deleteCategory } from "../services/categoryService";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Categories: add custom categories + color/icon meta for nicer UI.
 * (Back-end can ignore unknown fields safely.)
 */
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "expense",
    description: "",
    color: "#4CAF50",
    icon: "Category",
  });

  const loadData = () =>
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addCategory(form);
      setForm({
        name: "",
        type: "expense",
        description: "",
        color: "#4CAF50",
        icon: "Category",
      });
      loadData();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      loadData();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Categories
      </Typography>

      <Box
        component="form"
        onSubmit={handleAdd}
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          mb: 3,
        }}
      >
        <TextField name="name" label="Category Name" value={form.name} onChange={handleChange} required />
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select name="type" value={form.type} onChange={handleChange} label="Type">
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <TextField name="description" label="Description" value={form.description} onChange={handleChange} />
        <TextField name="color" type="color" label="Color" value={form.color} onChange={handleChange} />
        <TextField
          name="icon"
          label="Icon (name)"
          value={form.icon}
          onChange={handleChange}
          placeholder="e.g. Savings, Fastfood, Commute"
        />
        <Button variant="contained" type="submit">
          Add Category
        </Button>
      </Box>

      <List>
        {categories.map((c) => (
          <ListItem
            key={c._id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(c._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" sx={{ bgcolor: (c.color || "#e0e0e0"), color: "#000" }} label=" " />
                  <Typography variant="subtitle1">{c.name}</Typography>
                  <Chip size="small" variant="outlined" label={c.type} />
                </Stack>
              }
              secondary={`${c.description || ""}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}