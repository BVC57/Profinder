// 📁 client/src/pages/Register.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  InputAdornment,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PersonAdd as RegisterIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Logo from "../assets/logo.png";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openDialog, setOpenDialog] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      if (!value.includes(".com")) setEmailError("Invalid Gmail");
      else setEmailError("");
    }
    if (name === "password") {
      if (value.length < 4 || value.length > 8)
        setPasswordError("4 to 8 chars required");
      else setPasswordError("");
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await axios.post("/api/auth/send-otp", { email: form.email });
      showSuccessToast("OTP sent to email");
      setEmailSent(true);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await axios.post("/api/auth/verify-otp", { email: form.email, otp });
      showSuccessToast("Email verified");
      setEmailVerified(true);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!emailVerified || !agreeTerms || emailError || passwordError) {
      showErrorToast("Fix errors, verify email, and agree to terms");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/auth/register", form);
      showSuccessToast("Registered successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      sx={{
        minHeight: "90vh",
        flexDirection: { xs: "column-reverse", md: "row" },
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
          py: { xs: 6, md: 0 },
          width: { xs: "100%", md: "50%" },
        }}
      >
        <Box>
          <Typography variant={isMobile ? "h4" : "h2"} fontWeight="bold">
            Join ProFinder
          </Typography>
          <Typography variant={isMobile ? "body1" : "h5"} sx={{ opacity: 0.9 }}>
            Trusted professionals at your fingertips.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 450,
              mx: "auto",
              opacity: 0.85,
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            Whether you're a service provider or someone in need of help,
            ProFinder helps you connect quickly and safely.
          </Typography>
          <Box mt={4}>
            <img
              src={Logo}
              alt="ProFinder"
              style={{ width: "100%", maxWidth: 300, borderRadius: 10 }}
            />
          </Box>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
            <Box textAlign="center" mb={3}>
              <RegisterIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h5">Create Your Account</Typography>
              <Typography variant="body2">
                Start connecting with trusted professionals today
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!emailError}
              helperText={emailError}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <label
                      style={{
                        color: emailVerified ? "green" : "#1976d2", // default MUI blue
                        fontWeight: emailVerified ? 600 : 500,
                        cursor: emailVerified ? "default" : "pointer",
                      }}
                      onClick={!emailVerified ? handleSendOtp : undefined}
                    >
                      {emailVerified
                        ? "✔ Verified"
                        : emailSent
                          ? "Resend OTP"
                          : "Send OTP"}
                    </label>
                  </InputAdornment>
                ),
              }}
            />
            {emailSent && !emailVerified && (
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={handleVerifyOtp}
                        size="small"
                        disabled={!otp || loading}
                      >
                        Verify OTP
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!passwordError}
              helperText={passwordError}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading}
              />
              <Typography variant="body2" color="text.secondary">
                I agree to the{" "}
                <Link
                  component="button"
                  onClick={() => setOpenDialog("terms")}
                  sx={{ textDecoration: "underline" }}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  component="button"
                  onClick={() => setOpenDialog("privacy")}
                  sx={{ textDecoration: "underline" }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={
                loading ||
                !agreeTerms ||
                !emailVerified ||
                !form.name ||
                !!emailError ||
                !!passwordError ||
                !form.password
              }
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/login")}
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Grid>

      <Dialog
        open={openDialog === "terms"}
        onClose={() => setOpenDialog("")}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Terms & Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            Welcome to ProFinder!\n\nBy registering on our platform, you agree
            to abide by our terms and conditions...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog("")}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog === "privacy"}
        onClose={() => setOpenDialog("")}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            Privacy Policy for ProFinder\n\nWe value your privacy and ensure
            your data is protected...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog("")}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Register;
