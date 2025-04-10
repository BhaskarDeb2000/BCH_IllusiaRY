import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";
import "./Dashboard.css";
import axios from "axios";
import StorageIcon from "@mui/icons-material/Storage";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DashboardFeatureCard from "../components/DashboardFeatureCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // In a real app, fetch from real API with token auth
        // For now, we'll just use the data from localStorage or fetch from mock endpoint
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          // Fetch from mock API
          const response = await axios.get(
            "http://localhost:8000/api/auth/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserData(response.data.user);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <Container maxWidth="lg" className="dashboard-container">
      <Box mt={5} className="fade-in">
        <Typography variant="h3" className="dashboard-heading" gutterBottom>
          Welcome to Illusia ry
        </Typography>
        <Typography
          variant="subtitle1"
          className="dashboard-subheading"
          gutterBottom
        >
          Browse storage items, make bookings, and manage your reservations.
        </Typography>

        {/* User Profile Section */}
        <Paper elevation={3} className="profile-paper" sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, color: "var(--text-primary)" }}
          >
            User Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {loading ? (
            <Box className="loading-container">
              <CircularProgress sx={{ color: "var(--primary-color)" }} />
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              sx={{ borderRadius: "var(--border-radius)" }}
            >
              {error}
            </Alert>
          ) : userData ? (
            <Grid container spacing={2} alignItems="center" className="fade-in">
              <Grid item>
                <Avatar
                  className="profile-avatar"
                  sx={{ width: 80, height: 80 }}
                >
                  {userData.name?.charAt(0) || "U"}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                >
                  {userData.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--text-secondary)" }}
                >
                  {userData.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", opacity: 0.7 }}
                >
                  Role: {userData.role || "User"}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Alert
              severity="info"
              sx={{ borderRadius: "var(--border-radius)" }}
            >
              No user data available
            </Alert>
          )}
        </Paper>

        <Box className="card-grid">
          <DashboardFeatureCard
            icon={<StorageIcon />}
            title="Browse Items"
            description="View all available storage items and check their availability status"
            linkTo="/dashboard/items"
            color="primary"
          />

          <DashboardFeatureCard
            icon={<BookmarkAddIcon />}
            title="Make a Booking"
            description="Add items to your cart and select dates for your reservation"
            linkTo="/dashboard/cart"
            color="secondary"
          />

          <DashboardFeatureCard
            icon={<BookmarksIcon />}
            title="My Bookings"
            description="View and manage your existing reservations and rental history"
            linkTo="/dashboard/my-bookings"
            color="accent"
          />
        </Box>

        <Outlet />
      </Box>
    </Container>
  );
}
