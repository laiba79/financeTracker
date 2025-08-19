import { useEffect, useMemo, useState } from "react";
import { getStats, getTransactions } from "../services/transactionService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

/**
 * Dashboard: glance cards + charts + recent transactions list
 */
export default function Dashboard() {
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    getStats().then((res) => setStats(res.data));
    getTransactions().then((res) => setTxns(res.data || []));
  }, []);

  const monthlyExpense = useMemo(() => {
    const arr = Array(12).fill(0);
    txns.forEach((t) => {
      const m = new Date(t.date).getMonth();
      if (t.type === "expense") arr[m] += Number(t.amount || 0);
    });
    return arr;
  }, [txns]);

  const monthlyIncome = useMemo(() => {
    const arr = Array(12).fill(0);
    txns.forEach((t) => {
      const m = new Date(t.date).getMonth();
      if (t.type === "income") arr[m] += Number(t.amount || 0);
    });
    return arr;
  }, [txns]);

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      { data: [stats.totalIncome, stats.totalExpense], backgroundColor: ["#4CAF50", "#F44336"] },
    ],
  };

  const barData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [{ label: "Monthly Expenses", data: monthlyExpense, backgroundColor: "#F44336" }],
  };

  const lineData = {
    labels: barData.labels,
    datasets: [
      { label: "Income", data: monthlyIncome, fill: false, tension: 0.3, borderColor: "#4CAF50" },
      { label: "Expense", data: monthlyExpense, fill: false, tension: 0.3, borderColor: "#EF5350" },
    ],
  };

  const recent = useMemo(
    () =>
      [...txns]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6),
    [txns]
  );

  return (
    <Box sx={{ mt: 4 }}>
      {/* KPIs */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#4CAF50", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4">${stats.totalIncome}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#F44336", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Total Expense</Typography>
              <Typography variant="h4">${stats.totalExpense}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#2196F3", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Balance</Typography>
              <Typography variant="h4">${stats.balance}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Income vs Expense</Typography>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Monthly Expenses</Typography>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Yearly Trend</Typography>
              <Line data={lineData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>Recent Transactions</Typography>
        <List dense>
          {recent.map((t) => (
            <ListItem key={t._id}>
              <ListItemText
                primary={`${t.type} • ${t.category} • $${t.amount}`}
                secondary={new Date(t.date).toLocaleDateString() + (t.description ? ` — ${t.description}` : "")}
              />
            </ListItem>
          ))}
          {recent.length === 0 && (
            <Typography color="text.secondary">No recent transactions.</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}