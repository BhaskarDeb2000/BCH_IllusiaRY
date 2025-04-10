import React, { useState, useContext } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { loginUser, setAuthToken } from "../services/authService";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AuthContext } from "../App";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });

      // Store token and user data in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Set auth token for future API requests
      setAuthToken(res.data.token);

      // Update authentication context
      setAuthState({
        isAuthenticated: true,
        user: res.data.user,
        loading: false,
      });

      navigate("/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xs" className="login-container">
      <Paper elevation={4} className="login-paper slide-up">
        <Box mb={3} sx={{ textAlign: "center" }}>
          <Typography variant="h4" className="login-title">
            Welcome Back
          </Typography>
          <Typography variant="body2" className="login-subtitle">
            Sign in to continue to Illusia ry
          </Typography>
        </Box>

        {serverError && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: "var(--border-radius)" }}
          >
            {serverError}
          </Alert>
        )}

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            required
            type="email"
            className="login-form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: "var(--border-radius)" },
            }}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            required
            className="login-form-field"
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "var(--border-radius)" },
            }}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Box className="register-link">
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
