import { useEffect, useMemo, useState } from "react";
import { getBudgets, addBudget, deleteBudget } from "../services/budgetService";
import { getTransactions } from "../services/transactionService";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BudgetForm from "../components/BudgetForm";
import Loader from "../components/Loader";

/**
 * Budgets page: create budgets, show progress vs spend, warning chips,
 * export CSV.
 */
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [b, t] = await Promise.all([getBudgets(), getTransactions()]);
      setBudgets(b.data || []);
      setTxns(t.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBudget = async (form) => {
    await addBudget(form);
    await loadData();
  };

  // compute spend by category and month/year
  const progress = useMemo(() => {
    const byCatMonth = {};
    txns.forEach((t) => {
      if (t.type !== "expense") return;
      const d = new Date(t.date);
      const key = `${t.category}|${d.getMonth() + 1}|${d.getFullYear()}`;
      byCatMonth[key] = (byCatMonth[key] || 0) + Number(t.amount || 0);
    });
    return byCatMonth;
  }, [txns]);

  const exportCsv = () => {
    const header = [
      "Category",
      "Type",
      "Amount",
      "Month",
      "Year",
      "Currency",
      "AlertThreshold",
      "Description",
    ];
    const rows = budgets.map((b) => [
      b.category || "All",
      b.type || "monthly",
      b.amount,
      b.month || "",
      b.year || "",
      b.currency || "USD",
      b.alertThreshold ?? 80,
      b.description || "",
    ]);
    const csv =
      [header, ...rows].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "budgets.csv";
    a.click();
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Budgets</Typography>
        <Button onClick={exportCsv} variant="outlined">Export CSV</Button>
      </Stack>

      <Box mb={3}>
        <BudgetForm onSubmit={handleAddBudget} />
      </Box>

      {loading ? (
        <Loader type="skeleton-list" />
      ) : budgets.length === 0 ? (
        <Typography color="text.secondary">No budgets yet.</Typography>
      ) : (
        <List>
          {budgets.map((b) => {
            const key =
              b.type === "monthly"
                ? `${b.category}|${b.month}|${b.year}`
                : ""; // extend for yearly/custom as needed
            const spent = key ? progress[key] || 0 : 0;
            const pct = b.amount ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
            const near = pct >= (b.alertThreshold ?? 80) && pct < 100;
            const over = pct >= 100;

            return (
              <ListItem
                key={b._id}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteBudget(b._id).then(loadData)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">
                        {b.category || "All Categories"} — {b.currency || "USD"} {b.amount}
                      </Typography>
                      {near && <Chip size="small" color="warning" label="Nearing limit" />}
                      {over && <Chip size="small" color="error" label="Exceeded" />}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {b.type === "monthly"
                          ? `Month: ${b.month}, Year: ${b.year}`
                          : b.type === "yearly"
                          ? `Year: ${b.year}`
                          : "Custom period"}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 6 }} />
                        <Typography variant="caption" color="text.secondary">
                          Spent {b.currency || "USD"} {spent} of {b.currency || "USD"} {b.amount} ({pct}%)
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}