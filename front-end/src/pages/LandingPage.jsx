import { Box, Typography, Button, Grid, Paper, Stack, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import LockIcon from "@mui/icons-material/Lock";

/**
 * Landing with feature bullets incl. PWA/Offline/2FA/Multi-currency
 */
export default function LandingPage() {
  return (
    <Box sx={{ textAlign: "center", py: 6, background: "linear-gradient(135deg, #4CAF50, #81C784)" }}>
      {/* Hero */}
      <Typography variant="h2" fontWeight="bold" color="white" gutterBottom>
        Finance Tracker
      </Typography>
      <Typography variant="h6" color="white" sx={{ mb: 4, maxWidth: 700, mx: "auto" }}>
        Track income & expenses, set budgets and goals, and get clear insights.
        Works on any device — even offline — with optional 2FA security.
      </Typography>
      <Box sx={{ mb: 6 }}>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/register"
          sx={{ mr: 2, bgcolor: "#fff", color: "#4CAF50", "&:hover": { bgcolor: "#f1f1f1" } }}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/login"
          sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#f1f1f1" } }}
        >
          Login
        </Button>
      </Box>

      {/* Quick badges */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 6, flexWrap: "wrap" }}>
        <Chip icon={<DownloadDoneIcon />} label="PWA Ready" />
        <Chip icon={<OfflineBoltIcon />} label="Offline Mode" />
        <Chip icon={<LockIcon />} label="2FA Support" />
        <Chip label="Multi-currency" />
        <Chip label="Dark/Light" />
      </Stack>

      {/* Features */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 4 }}>
              <SavingsIcon sx={{ fontSize: 50, color: "#4CAF50" }} />
              <Typography variant="h6" mt={2}>
                Track Income & Expenses
              </Typography>
              <Typography variant="body2" mt={1}>
                Log transactions quickly. Support for recurring items & tags.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 4 }}>
              <BarChartIcon sx={{ fontSize: 50, color: "#4CAF50" }} />
              <Typography variant="h6" mt={2}>
                Visual Reports
              </Typography>
              <Typography variant="body2" mt={1}>
                Understand your habits with monthly & yearly charts.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 4 }}>
              <CategoryIcon sx={{ fontSize: 50, color: "#4CAF50" }} />
              <Typography variant="h6" mt={2}>
                Budgets & Goals
              </Typography>
              <Typography variant="body2" mt={1}>
                Set limits by category and get warned when you’re close.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}