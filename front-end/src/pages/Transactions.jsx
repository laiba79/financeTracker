import { useEffect, useMemo, useState } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/transactionService";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import TransactionForm from "../components/TransactionForm";
import Loader from "../components/Loader";

/**
 * Transactions: add, edit, delete; search + filters (category, method, date range)
 * + CSV export of current view.
 */
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // edit dialog
  const [editing, setEditing] = useState(null);

  const loadData = () => {
    setLoading(true);
    getTransactions()
      .then((res) => setTransactions(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (form) => {
    await addTransaction(form);
    loadData();
  };

  const handleUpdateTransaction = async (data) => {
    await updateTransaction(editing._id, data);
    setEditing(null);
    loadData();
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQ =
        !q ||
        t.description?.toLowerCase().includes(q.toLowerCase()) ||
        t.category?.toLowerCase().includes(q.toLowerCase()) ||
        String(t.amount).includes(q);
      const matchesCat = !category || t.category === category;
      const matchesMethod = !paymentMethod || t.paymentMethod === paymentMethod;
      const d = new Date(t.date);
      const after = !dateFrom || d >= new Date(dateFrom);
      const before = !dateTo || d <= new Date(dateTo);
      return matchesQ && matchesCat && matchesMethod && after && before;
    });
  }, [transactions, q, category, paymentMethod, dateFrom, dateTo]);

  const exportCsv = () => {
    const header = ["Type", "Category", "Amount", "Date", "PaymentMethod", "Currency", "Description"];
    const rows = filtered.map((t) => [
      t.type,
      t.category,
      t.amount,
      new Date(t.date).toISOString().split("T")[0],
      t.paymentMethod,
      t.currency || "USD",
      t.description || "",
    ]);
    const csv =
      [header, ...rows].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Transactions</Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ width: "100%", maxWidth: 800 }}>
          <TextField
            fullWidth
            placeholder="Search by keyword, amount, or category"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <TextField type="date" label="From" InputLabelProps={{ shrink: true }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <TextField type="date" label="To" InputLabelProps={{ shrink: true }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Select displayEmpty value={category} onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value=""><em>All Categories</em></MenuItem>
            {[...new Set(transactions.map((t) => t.category))].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
          <Select displayEmpty value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <MenuItem value=""><em>All Methods</em></MenuItem>
            {[...new Set(transactions.map((t) => t.paymentMethod))].map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={exportCsv}>Export CSV</Button>
        </Stack>
      </Stack>

      {/* Reusable form to add */}
      <Box mb={3}>
        <TransactionForm onSubmit={handleAddTransaction} />
      </Box>

      {loading ? (
        <Loader type="skeleton-list" />
      ) : (
        <List>
          {filtered.map((t) => (
            <ListItem
              key={t._id}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton edge="end" onClick={() => setEditing(t)}><EditIcon /></IconButton>
                  <IconButton edge="end" onClick={() => deleteTransaction(t._id).then(loadData)}><DeleteIcon /></IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={`${t.type} • ${t.category} • $${t.amount}`}
                secondary={`${new Date(t.date).toLocaleDateString()} • ${t.paymentMethod} ${t.description ? " — " + t.description : ""}`}
              />
            </ListItem>
          ))}
          {filtered.length === 0 && <Typography color="text.secondary">No transactions match your filters.</Typography>}
        </List>
      )}

      {/* Edit dialog reusing TransactionForm */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="md">
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {editing && <TransactionForm onSubmit={handleUpdateTransaction} initialData={editing} mode="edit" />}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}