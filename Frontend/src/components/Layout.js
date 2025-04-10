import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "../contexts/ThemeContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const isLoggedIn = !!localStorage.getItem("token");

  // Handle scroll effect for AppBar
  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    handleProfileMenuClose();
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon /> },
    { name: "Items", path: "/dashboard/items", icon: <StorageOutlinedIcon /> },
    {
      name: "My Bookings",
      path: "/dashboard/my-bookings",
      icon: <BookmarkBorderOutlinedIcon />,
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          background:
            "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mb: 1,
            bgcolor: "white",
            color: "var(--primary-color)",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {user?.name?.charAt(0) || "I"}
        </Avatar>
        <Typography
          variant="subtitle1"
          sx={{ color: "white", fontWeight: 600 }}
        >
          {user?.name || "Guest User"}
        </Typography>
        {user?.email && (
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            {user.email}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => navigate(item.path)}
            sx={{
              py: 1.5,
              bgcolor:
                location.pathname === item.path
                  ? "rgba(0, 0, 0, 0.04)"
                  : "transparent",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "var(--primary-color)" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontFamily: '"Roboto Slab", serif',
              }}
            />
          </ListItem>
        ))}
        {isLoggedIn && (
          <ListItem button onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: "var(--error-color)" }}>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  // Don't show layout on login or register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return children;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: darkMode ? "transparent" : "white",
          boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
          color: "var(--text-primary)",
          transition: "all 0.3s ease",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          background: darkMode
            ? scrolled
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(18, 18, 18, 0.95)"
            : scrolled
            ? "rgba(255, 255, 255, 0.8)"
            : "white",
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "none",
        }}
        elevation={scrolled ? 4 : 0}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {isMobile && isLoggedIn && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "rotate(180deg)" },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontFamily: '"Roboto Slab", serif',
                background: darkMode
                  ? "linear-gradient(90deg, #c278e6, #65d8d1)"
                  : "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                letterSpacing: "-0.5px",
              }}
              onClick={() => navigate("/")}
            >
              Illusia ry
            </Typography>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {!isMobile && isLoggedIn && (
              <Box sx={{ display: "flex", gap: { sm: 1, md: 2 } }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color:
                        location.pathname === item.path
                          ? "var(--primary-color)"
                          : "var(--text-secondary)",
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontFamily: '"Roboto Slab", serif',
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                      padding: { sm: "6px 10px", md: "8px 16px" },
                      fontSize: { sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}

            {isLoggedIn ? (
              <Box sx={{ ml: 2 }}>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "var(--primary-color)",
                      width: 36,
                      height: 36,
                      transition: "all 0.3s ease",
                      border: "2px solid white",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {user?.name?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      width: 200,
                      mt: 1.5,
                      borderRadius: "var(--border-radius)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleProfileMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <DashboardOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleProfileMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <SettingsOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutOutlinedIcon
                        fontSize="small"
                        sx={{ color: "var(--error-color)" }}
                      />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{
                    mr: 1.5,
                    borderRadius: "var(--border-radius)",
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    "&:hover": {
                      borderColor: "var(--secondary-color)",
                      bgcolor: "rgba(58, 107, 192, 0.08)",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                  sx={{
                    borderRadius: "var(--border-radius)",
                    bgcolor: "var(--primary-color)",
                    "&:hover": { bgcolor: "var(--secondary-color)" },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Responsive drawer for mobile */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            borderRadius: "0 16px 16px 0",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "var(--background-light)",
          transition: "all 0.3s ease",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            bgcolor: "transparent",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Container>
      </Box>

      {/* Simple Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          bgcolor: darkMode ? "#352042" : "#44195b",
          color: "#ffffff",
          borderTop: darkMode
            ? "1px solid rgba(179, 92, 222, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
          © {new Date().getFullYear()} Illusia ry. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
