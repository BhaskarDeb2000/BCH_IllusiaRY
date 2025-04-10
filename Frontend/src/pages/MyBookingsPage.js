import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InventoryIcon from "@mui/icons-material/Inventory";
import CancelIcon from "@mui/icons-material/Cancel";
import { format } from "date-fns";
import { getUserBookings, cancelBooking } from "../services/bookingService";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch user bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      const updatedBooking = await cancelBooking(selectedBooking._id);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id ? updatedBooking : booking
        )
      );
      setSelectedBooking(null);
      setCancelDialogOpen(false);
      setSuccessMessage("Booking cancelled successfully!");
    } catch (err) {
      console.error("Booking cancellation failed", err);
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Group bookings by status for better organization
  const groupedBookings = useMemo(() => {
    const active = [];
    const past = [];
    const cancelled = [];

    const now = new Date();

    bookings.forEach((booking) => {
      const endDate = new Date(booking.endDate);

      if (booking.status === "cancelled") {
        cancelled.push(booking);
      } else if (endDate < now) {
        past.push(booking);
      } else {
        active.push(booking);
      }
    });

    return { active, past, cancelled };
  }, [bookings]);

  const renderBookingCard = (booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const isCancelled = booking.status === "cancelled";
    const isPast = new Date(booking.endDate) < new Date();

    return (
      <Grid item xs={12} sm={6} md={4} key={booking._id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "var(--box-shadow-hover)",
            },
            opacity: isCancelled || isPast ? 0.7 : 1,
            border: isCancelled
              ? "1px solid #ffcdd2"
              : isPast
              ? "1px solid #e0e0e0"
              : "none",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "var(--primary-dark)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.4em",
                maxHeight: "2.8em",
              }}
            >
              {booking.item.contentSummary}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 2,
              }}
            >
              {booking.item.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarTodayIcon
                fontSize="small"
                color="action"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="body2" color="text.secondary">
                {format(startDate, "MMM d, yyyy")} -{" "}
                {format(endDate, "MMM d, yyyy")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InventoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Quantity: {booking.quantity}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={
                  isCancelled ? "Cancelled" : isPast ? "Completed" : "Active"
                }
                size="small"
                color={isCancelled ? "error" : isPast ? "default" : "success"}
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
            {!isCancelled && !isPast && (
              <Tooltip title="Cancel Booking">
                <Button
                  size="small"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setCancelDialogOpen(true);
                  }}
                >
                  Cancel
                </Button>
              </Tooltip>
            )}
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 5 }} className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontFamily: '"Roboto Slab", serif',
            background:
              "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Bookings
        </Typography>
      </Box>

      {successMessage && (
        <Fade in={!!successMessage}>
          <Alert
            severity="success"
            sx={{
              mb: 2,
              boxShadow: "var(--box-shadow-sm)",
              borderRadius: "var(--border-radius-sm)",
            }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        </Fade>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            boxShadow: "var(--box-shadow-sm)",
            borderRadius: "var(--border-radius-sm)",
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && bookings.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "var(--border-radius)",
            backgroundColor: "var(--background-white)",
            boxShadow: "var(--box-shadow-sm)",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You haven't booked any items yet
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Active Bookings */}
          {groupedBookings.active.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 2, color: "var(--primary-dark)" }}
              >
                Active Bookings
              </Typography>
              <Grid container spacing={3} className="slide-up">
                {groupedBookings.active.map(renderBookingCard)}
              </Grid>
            </Box>
          )}

          {/* Past Bookings */}
          {groupedBookings.past.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 2, color: "var(--primary-dark)" }}
              >
                Past Bookings
              </Typography>
              <Grid container spacing={3} className="slide-up">
                {groupedBookings.past.map(renderBookingCard)}
              </Grid>
            </Box>
          )}

          {/* Cancelled Bookings */}
          {groupedBookings.cancelled.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 2, color: "var(--primary-dark)" }}
              >
                Cancelled Bookings
              </Typography>
              <Grid container spacing={3} className="slide-up">
                {groupedBookings.cancelled.map(renderBookingCard)}
              </Grid>
            </Box>
          )}
        </>
      )}

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your booking for "
            {selectedBooking?.item.contentSummary}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            No, Keep It
          </Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Yes, Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookingsPage;
