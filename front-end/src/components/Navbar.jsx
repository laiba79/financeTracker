import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Dashboard,
  AccountBalanceWallet,
  Category,
  Receipt,
  Person,
  Settings,
  Logout,
  Notifications,
  Menu as MenuIcon,
  Assessment,
  Download,
  Security
} from "@mui/icons-material";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Budget limit reached for Food category", type: "warning" },
    { id: 2, message: "Monthly report is ready", type: "info" }
  ]);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleUserMenuClose();
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Dashboard /> },
    { path: "/transactions", label: "Transactions", icon: <Receipt /> },
    { path: "/categories", label: "Categories", icon: <Category /> },
    { path: "/budgets", label: "Budgets", icon: <AccountBalanceWallet /> },
    { path: "/reports", label: "Reports", icon: <Assessment /> },
  ];

  const userMenuItems = [
    { label: "Profile", icon: <Person />, action: () => navigate("/profile") },
    { label: "Settings", icon: <Settings />, action: () => navigate("/settings") },
    { label: "Export Data", icon: <Download />, action: () => console.log("Export data") },
    { label: "Privacy", icon: <Security />, action: () => navigate("/privacy") },
    { label: "Logout", icon: <Logout />, action: handleLogout },
  ];

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, pt: 2 }}>
      {/* User Info in Drawer */}
      {user && (
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" noWrap>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Items */}
      <List sx={{ pt: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white'
                }
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Theme Toggle in Drawer */}
      <ListItemButton onClick={toggleTheme} sx={{ mx: 1, borderRadius: 1 }}>
        <ListItemIcon>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </ListItemIcon>
        <ListItemText primary={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`} />
      </ListItemButton>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={2} sx={{ background: 'linear-gradient(45deg, #4CAF50, #2196F3)' }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && user && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: isMobile ? 1 : 0,
              cursor: "pointer",
              fontWeight: 'bold',
              mr: 4
            }}
            onClick={() => navigate("/")}
          >
            💰 Finance Tracker
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: location.pathname === item.path ? "rgba(255,255,255,0.2)" : "transparent",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile || !user ? 1 : 0 }} />

          {/* Right Side Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={notifications.length} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Menu */}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                {/* User Menu Dropdown */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      boxShadow: 3
                    }
                  }}
                >
                  {/* User Info Header */}
                  <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  {/* Menu Items */}
                  {userMenuItems.map((item, index) => [
                    item.label === "Logout" && <Divider key={`divider-${index}`} sx={{ my: 1 }} />,
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        item.action();
                        handleUserMenuClose();
                      }}
                      sx={{
                        gap: 2,
                        color: item.label === "Logout" ? "error.main" : "inherit"
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </MenuItem>
                  ].filter(Boolean))}
                </Menu>
              </>
            ) : (
              /* Guest Navigation */
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/login")}
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/register")}
                  variant="contained"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}