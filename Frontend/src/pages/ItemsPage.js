import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Chip,
  Tooltip,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/itemService";
import { createBooking } from "../services/bookingService";

const ITEMS_PER_PAGE = 8;

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({
    description: "",
    contentSummary: "",
    storageDetails: "",
    storageLocation: "",
    quantity: 1,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: dayjs(),
    endDate: dayjs().add(7, "day"),
    quantity: 1,
    purpose: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to load items:", error);
      setError("Failed to load items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value);
  }, []);

  const handleCreate = async () => {
    if (!newItem.description || !newItem.contentSummary) {
      setError("Description and Content Summary are required.");
      return;
    }

    try {
      setLoading(true);
      const created = await createItem(newItem);
      setItems((prev) => [...prev, created]);
      setNewItem({
        description: "",
        contentSummary: "",
        storageDetails: "",
        storageLocation: "",
        quantity: 1,
      });
      setCreateDialogOpen(false);
      setSuccessMessage("Item created successfully!");
    } catch (err) {
      console.error("Item creation failed", err);
      setError("Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem.description || !selectedItem.contentSummary) {
      setError("Description and Content Summary are required.");
      return;
    }

    try {
      setLoading(true);
      const updated = await updateItem(selectedItem._id, selectedItem);
      setItems((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      setUpdateMode(false);
      setSelectedItem(null);
      setSuccessMessage("Item updated successfully!");
    } catch (err) {
      console.error("Item update failed", err);
      setError("Failed to update item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteItem(selectedItem._id);
      setItems((prev) => prev.filter((item) => item._id !== selectedItem._id));
      setSelectedItem(null);
      setDeleteDialogOpen(false);
      setSuccessMessage("Item deleted successfully!");
    } catch (err) {
      console.error("Item deletion failed", err);
      setError("Failed to delete item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingDetails.purpose) {
      setError("Purpose is required for booking.");
      return;
    }

    if (
      bookingDetails.quantity < 1 ||
      bookingDetails.quantity > bookingItem.quantity
    ) {
      setError(`Quantity must be between 1 and ${bookingItem.quantity}.`);
      return;
    }

    try {
      setLoading(true);

      // Prepare booking data
      const bookingData = {
        itemId: bookingItem._id,
        startDate: bookingDetails.startDate.toISOString(),
        endDate: bookingDetails.endDate.toISOString(),
        quantity: bookingDetails.quantity,
        purpose: bookingDetails.purpose,
      };

      // Call the booking service
      await createBooking(bookingData);

      setBookingDialogOpen(false);
      setBookingItem(null);
      setSuccessMessage(
        `Successfully booked ${bookingDetails.quantity} ${bookingItem.description}(s)!`
      );

      // Reset booking details
      setBookingDetails({
        startDate: dayjs(),
        endDate: dayjs().add(7, "day"),
        quantity: 1,
        purpose: "",
      });
    } catch (err) {
      console.error("Item booking failed", err);
      setError("Failed to book item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openBookingDialog = (item) => {
    setBookingItem(item);
    setBookingDetails({
      ...bookingDetails,
      quantity: 1,
    });
    setBookingDialogOpen(true);
  };

  const transformItemForDisplay = useCallback((item) => {
    return {
      _id: item._id,
      description: item.name,
      contentSummary: item.description,
      storageDetails: item.tags?.join(", ") || "",
      storageLocation: item.location || "",
      quantity: item.quantity || 1,
      categoryId: item.categoryId,
      isActive: item.isActive,
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    [filteredItems]
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 5 }} className="fade-in">
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontFamily: '"Roboto Slab", serif',
            background:
              "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: { xs: 2, md: 0 },
          }}
        >
          Storage Items
        </Typography>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            placeholder="Search items..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "var(--border-radius-sm)" },
            }}
            sx={{ width: { xs: "100%", md: "250px" } }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setCreateDialogOpen(true)}
            disabled={loading}
            sx={{
              whiteSpace: "nowrap",
              boxShadow: "var(--box-shadow-sm)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "var(--box-shadow)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Add Item
          </Button>
        </Box>
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

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
          {paginatedItems.length === 0 ? (
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
                {searchQuery ? "No matching items found" : "No items available"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {searchQuery
                  ? "Try a different search term"
                  : "Add your first item to get started"}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3} className="slide-up">
              {paginatedItems.map((item) => {
                const displayItem = transformItemForDisplay(item);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
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
                        border:
                          selectedItem?._id === item._id
                            ? "2px solid var(--primary-color)"
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
                          {displayItem.contentSummary}
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
                          {displayItem.description}
                        </Typography>

                        {displayItem.storageLocation && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <LocationOnIcon
                              fontSize="small"
                              color="action"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {displayItem.storageLocation}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <InventoryIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 0.5 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {displayItem.quantity}
                          </Typography>
                        </Box>

                        {displayItem.storageDetails && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {displayItem.storageDetails
                              .split(",")
                              .map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag.trim()}
                                  size="small"
                                  sx={{
                                    backgroundColor: "var(--background-dark)",
                                    fontSize: "0.7rem",
                                  }}
                                />
                              ))}
                          </Box>
                        )}
                      </CardContent>

                      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                        <Tooltip title="Book">
                          <IconButton
                            size="small"
                            onClick={() => openBookingDialog(displayItem)}
                            color="secondary"
                            disabled={displayItem.quantity < 1}
                          >
                            <BookmarkAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedItem(displayItem);
                              setUpdateMode(true);
                            }}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedItem(displayItem);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                siblingCount={1}
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Add New Item
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Content Summary"
              fullWidth
              margin="normal"
              value={newItem.contentSummary}
              onChange={(e) =>
                setNewItem({ ...newItem, contentSummary: e.target.value })
              }
              required
              autoFocus
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              required
            />
            <TextField
              label="Storage Location"
              fullWidth
              margin="normal"
              value={newItem.storageLocation}
              onChange={(e) =>
                setNewItem({ ...newItem, storageLocation: e.target.value })
              }
            />
            <TextField
              label="Storage Details (comma separated tags)"
              fullWidth
              margin="normal"
              value={newItem.storageDetails}
              onChange={(e) =>
                setNewItem({ ...newItem, storageDetails: e.target.value })
              }
              helperText="Enter tags separated by commas"
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateMode}
        onClose={() => setUpdateMode(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Edit Item
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                label="Content Summary"
                fullWidth
                margin="normal"
                value={selectedItem.contentSummary}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    contentSummary: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Storage Location"
                fullWidth
                margin="normal"
                value={selectedItem.storageLocation}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    storageLocation: e.target.value,
                  })
                }
              />
              <TextField
                label="Storage Details (comma separated tags)"
                fullWidth
                margin="normal"
                value={selectedItem.storageDetails}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    storageDetails: e.target.value,
                  })
                }
                helperText="Enter tags separated by commas"
              />
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                value={selectedItem.quantity}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    quantity: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateMode(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedItem?.contentSummary}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Book Item
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {bookingItem && (
              <Box component="form" sx={{ mt: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {bookingItem.contentSummary}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {bookingItem.description}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Booking Period
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <DatePicker
                      label="Start Date"
                      value={bookingDetails.startDate}
                      onChange={(newValue) => {
                        setBookingDetails({
                          ...bookingDetails,
                          startDate: newValue,
                        });
                      }}
                      slotProps={{
                        textField: { fullWidth: true, margin: "dense" },
                      }}
                      disablePast
                    />
                    <DatePicker
                      label="End Date"
                      value={bookingDetails.endDate}
                      onChange={(newValue) => {
                        setBookingDetails({
                          ...bookingDetails,
                          endDate: newValue,
                        });
                      }}
                      slotProps={{
                        textField: { fullWidth: true, margin: "dense" },
                      }}
                      minDate={bookingDetails.startDate}
                    />
                  </Box>
                </Box>

                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={bookingDetails.quantity}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      quantity: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: bookingItem.quantity,
                    },
                  }}
                  helperText={`Available: ${bookingItem.quantity}`}
                />

                <TextField
                  label="Purpose"
                  fullWidth
                  margin="normal"
                  value={bookingDetails.purpose}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      purpose: e.target.value,
                    })
                  }
                  required
                  multiline
                  rows={3}
                  placeholder="Explain why you need this item"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleBooking}
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Book Item"}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Container>
  );
};

export default React.memo(ItemsPage);
