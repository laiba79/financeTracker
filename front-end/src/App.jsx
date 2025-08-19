import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CustomThemeProvider } from "./context/ThemeContext";
import Footer from "./components/footer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import LandingPage from "./pages/LandingPage";
import { CssBaseline, Container } from "@mui/material";
import "./App.css"; // Import global styles

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <CssBaseline />
          <Navbar />
          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;