// 📁 client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";
import Logo from "../assets/logo.png"; // Adjust if needed

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailError, setEmailError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const termsContent = `Welcome to ProFinder!\n\nBy registering on our platform, you agree to abide by our terms and conditions...`;
  const privacyContent = `Privacy Policy for ProFinder\n\nWe value your privacy and ensure your data is protected...`;


  useEffect(() => {
    if (form.email && !form.email.includes(".com")) {
      setEmailError("Email must include @gmail.com");
    } else {
      setEmailError("");
    }
  }, [form.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (emailError || !agreeTerms) {
      setMessage({ type: "error", text: "Please fix the errors before submitting." });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const res = await axios.post("/api/auth/login", form);
      login(res.data);
      localStorage.setItem("userId", res.data.user._id);
      setMessage({ type: "success", text: "Login successful!" });
      showSuccessToast("Login successful");
      setForm({ email: "", password: "" });

      let redirectPath = from;
      if (res.data.user.role === "superadmin") redirectPath = "/super-admin";
      else if (res.data.user.role === "admin") redirectPath = "/admin-dashboard";

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (err) {
      const errorText = err.response?.data?.message || "Invalid credentials.";
      setMessage({ type: "error", text: errorText });
      showErrorToast(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={0} sx={{ minHeight: "90vh", flexDirection: { xs: "column-reverse", md: "row" } }}>
      <Grid item xs={12} md={6} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", px: 3, py: { xs: 6, md: 0 }, width: { xs: "100%", md: "50%" } }}>
        <Box>
          <Typography variant={isMobile ? "h4" : "h2"} fontWeight="bold" gutterBottom>
            Welcome to ProFinder
          </Typography>
          <Typography variant={isMobile ? "body1" : "h5"} sx={{ opacity: 0.9, mb: 2 }}>
            Connecting you with trusted professionals globally.
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 450, mx: "auto", opacity: 0.85, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Whether you're looking for a developer, designer, or local expert — ProFinder helps you connect with verified professionals easily.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <img src={Logo} alt="ProFinder" style={{ width: "100%", maxWidth: 300, borderRadius: 10 }} />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 2, py: { xs: 5, md: 0 }, m: 3 }}>
        <Container maxWidth="sm">
          <Paper elevation={1} sx={{ p: { xs: 4, sm: 3 }, borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <LoginIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>Welcome Back</Typography>
              <Typography variant="body2" color="text.secondary">Sign in to your ProFinder account</Typography>
            </Box>

            {message.text && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} name="agreeTerms" color="primary" disabled={loading} sx={{ p: 0, mr: 1 }} />
              <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                I agree to the&nbsp;
                <Link component="button" onClick={() => setOpenDialog("terms")} sx={{ fontSize: "inherit", textDecoration: "underline" }}>Terms & Conditions</Link>
                &nbsp;and&nbsp;
                <Link component="button" onClick={() => setOpenDialog("privacy")} sx={{ fontSize: "inherit", textDecoration: "underline" }}>Privacy Policy</Link>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleLogin}
              disabled={loading || !form.email || !form.password || !agreeTerms || emailError}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <Link component="button" onClick={() => navigate("/forgot-password")} sx={{ textDecoration: "none" }}>
                  Forgot your password?
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Don’t have an account?{' '}
                <Link component="button" onClick={() => navigate("/register")} sx={{ fontWeight: 600, textDecoration: "none", color: "primary.main", '&:hover': { textDecoration: "underline" } }}>
                  Register
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Grid>

      {/* Dialogs */}
      <Dialog open={openDialog === "terms"} onClose={() => setOpenDialog("")} fullWidth maxWidth="sm">
        <DialogTitle>Terms & Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{termsContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog("")}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog === "privacy"} onClose={() => setOpenDialog("")} fullWidth maxWidth="sm">
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{privacyContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog("")}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Login;
