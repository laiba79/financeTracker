import { Box, Typography, Grid, Link, IconButton, Divider } from "@mui/material";
import { 
  GitHub, 
  LinkedIn, 
  Email, 
  Phone, 
  LocationOn,
  Download,
  Security,
  Help
} from "@mui/icons-material";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const handleExportData = () => {
    // This would trigger data export functionality
    console.log("Export data functionality");
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        backgroundColor: "primary.main",
        color: "white",
        pt: 4,
        pb: 2,
      }}
    >
      <Grid container spacing={4} sx={{ px: 4, maxWidth: 1200, mx: 'auto' }}>
        {/* Company Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Finance Tracker
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Take control of your finances with smart budgeting, 
            expense tracking, and insightful reports.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              sx={{ color: 'white' }}
              href="https://github.com/yourusername"
              target="_blank"
            >
              <GitHub />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ color: 'white' }}
              href="https://linkedin.com/in/yourusername"
              target="_blank"
            >
              <LinkedIn />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ color: 'white' }}
              href="mailto:contact@financetracker.com"
            >
              <Email />
            </IconButton>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link href="/dashboard" color="inherit" underline="hover">
              Dashboard
            </Link>
            <Link href="/transactions" color="inherit" underline="hover">
              Transactions
            </Link>
            <Link href="/budgets" color="inherit" underline="hover">
              Budgets
            </Link>
            <Link href="/categories" color="inherit" underline="hover">
              Categories
            </Link>
          </Box>
        </Grid>

        {/* Features */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              • Expense Tracking
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              • Budget Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              • Visual Reports
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              • Multi-Currency
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              • Data Export
            </Typography>
          </Box>
        </Grid>

        {/* Support */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom>
            Support
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Help fontSize="small" />
              Help Center
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Security fontSize="small" />
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              onClick={handleExportData}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Download fontSize="small" />
              Export Data
            </Link>
          </Box>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              <Typography variant="body2">
                support@financetracker.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" />
              <Typography variant="body2">
                +92 300 1234567
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" />
              <Typography variant="body2">
                Lahore, Punjab, Pakistan
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mx: 4, my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Bottom Footer */}
      <Box sx={{ textAlign: "center", px: 4 }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © {currentYear} Finance Tracker | All Rights Reserved | 
          Made with ❤️ for better financial management
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, mt: 0.5, display: 'block' }}>
          Version 2.1.0 | Last Updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}