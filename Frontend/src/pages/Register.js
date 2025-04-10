import React, { useState, useContext } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { registerUser, setAuthToken } from "../services/authService";
import { AuthContext } from "../App";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      const res = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setAuthToken(res.data.token);

        setAuthState({
          isAuthenticated: true,
          user: res.data.user,
          loading: false,
        });

        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" className="register-container">
      <Paper elevation={4} className="register-paper slide-up">
        <Box mt={4} mb={2}>
          <Typography variant="h4" align="center" className="register-title">
            Create Account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            className="register-subtitle"
          >
            Join the Illusia ry booking system
          </Typography>
        </Box>

        {serverError && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "var(--border-radius)" }}
          >
            {serverError}
          </Alert>
        )}

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            required
            {...register("firstName", { required: "First name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--border-radius)",
              },
            }}
          />

          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            required
            {...register("lastName", { required: "Last name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--border-radius)",
              },
            }}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            required
            type="email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--border-radius)",
              },
            }}
          />

          <TextField
            label="Password"
            fullWidth
            margin="normal"
            required
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--border-radius)",
              },
            }}
          />

          <TextField
            label="Confirm Password"
            fullWidth
            margin="normal"
            required
            type="password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "var(--border-radius)",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, borderRadius: "var(--border-radius)" }}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <Box mt={3} textAlign="center" mb={2}>
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ mt: 1 }}
            >
              Already have an account? Login here
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
