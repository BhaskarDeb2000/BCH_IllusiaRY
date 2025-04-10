import React, {
  lazy,
  Suspense,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import "./App.css";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { isAuthenticated, getCurrentUser } from "./services/authService";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";

// Create Authentication Context
export const AuthContext = createContext(null);

// Lazy load components for better performance
const Layout = lazy(() => import("./components/Layout"));
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

// App component with theme
function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const user = getCurrentUser();

      setAuthState({
        isAuthenticated: authenticated,
        user: user,
        loading: false,
      });
    };

    checkAuth();
  }, []);

  // Add fonts to the document
  React.useEffect(() => {
    // Add Lato font
    const latoLink = document.createElement("link");
    latoLink.rel = "stylesheet";
    latoLink.href =
      "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap";
    document.head.appendChild(latoLink);

    // Add Roboto Slab font
    const robotoSlabLink = document.createElement("link");
    robotoSlabLink.rel = "stylesheet";
    robotoSlabLink.href =
      "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700&display=swap";
    document.head.appendChild(robotoSlabLink);

    return () => {
      document.head.removeChild(latoLink);
      document.head.removeChild(robotoSlabLink);
    };
  }, []);

  if (authState.loading) {
    return <LoadingFallback />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        setAuthState,
      }}
    >
      <ThemeProvider>
        <ThemedApp authState={authState} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

// Component that applies MUI theming based on dark/light mode
const ThemedApp = ({ authState }) => {
  const { darkMode } = useContext(ThemeContext);

  // Create light theme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#9537c7", // Highlight 1
        light: "#b35cde",
        dark: "#44195b", // Dark
      },
      secondary: {
        main: "#3ec3ba", // Highlight 2
        light: "#65d8d1",
        dark: "#2d9990",
      },
      error: {
        main: "#e74c3c",
      },
      background: {
        default: "#ffffff", // Light neutral
        paper: "#ffffff", // Light neutral
      },
      text: {
        primary: "#2a2a2a", // Font basic
        secondary: "#4d4d4d",
      },
    },
    typography: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 600,
      },
      h2: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h3: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h4: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h5: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h6: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      button: {
        fontFamily: '"Lato", sans-serif',
        textTransform: "none",
        fontWeight: 500,
      },
      subtitle1: {
        fontFamily: '"Lato", sans-serif',
      },
      subtitle2: {
        fontFamily: '"Lato", sans-serif',
      },
      body1: {
        fontFamily: '"Lato", sans-serif',
      },
      body2: {
        fontFamily: '"Lato", sans-serif',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.2s ease-in-out",
          },
          containedPrimary: {
            background: "linear-gradient(45deg, #9537c7 30%, #b35cde 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #44195b 30%, #9537c7 90%)",
            },
          },
          containedSecondary: {
            background: "linear-gradient(45deg, #2d9990 30%, #3ec3ba 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #3ec3ba 30%, #65d8d1 90%)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
            transition:
              "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              borderColor: "rgba(149, 55, 199, 0.3)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            color: "#2a2a2a",
          },
        },
      },
    },
  });

  // Create dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#b35cde", // Lighter version of Highlight 1
        light: "#c278e6",
        dark: "#9537c7", // Highlight 1
      },
      secondary: {
        main: "#4fd9d0", // Lighter version of Highlight 2
        light: "#65d8d1",
        dark: "#3ec3ba", // Highlight 2
      },
      error: {
        main: "#ff6b6b",
      },
      background: {
        default: "#2a2a2a", // Based on Font basic but as background
        paper: "#352042", // Mix of Dark (#44195b) and background
      },
      text: {
        primary: "#ffffff", // Light neutral
        secondary: "#e0e0e0",
      },
    },
    typography: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 600,
      },
      h2: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h3: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h4: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h5: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      h6: {
        fontFamily: '"Roboto Slab", serif',
        fontWeight: 500,
      },
      button: {
        fontFamily: '"Lato", sans-serif',
        textTransform: "none",
        fontWeight: 500,
      },
      subtitle1: {
        fontFamily: '"Lato", sans-serif',
      },
      subtitle2: {
        fontFamily: '"Lato", sans-serif',
      },
      body1: {
        fontFamily: '"Lato", sans-serif',
      },
      body2: {
        fontFamily: '"Lato", sans-serif',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 15px rgba(69, 39, 89, 0.3)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.2s ease-in-out",
          },
          containedPrimary: {
            background: "linear-gradient(45deg, #9537c7 30%, #b35cde 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #44195b 30%, #9537c7 90%)",
            },
          },
          containedSecondary: {
            background: "linear-gradient(45deg, #2d9990 30%, #3ec3ba 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #3ec3ba 30%, #65d8d1 90%)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            backgroundImage: "none",
          },
          elevation1: {
            backgroundColor: "#352042", // Mix of Dark (#44195b) and background
          },
          elevation2: {
            backgroundColor: "#3a2548", // Slightly lighter
          },
          elevation3: {
            backgroundColor: "#3f2a4e", // Slightly lighter
          },
          elevation4: {
            backgroundColor: "#442f54", // Slightly lighter
          },
          elevation6: {
            backgroundColor: "#49345a", // Slightly lighter
          },
          elevation8: {
            backgroundColor: "#4e3960", // Slightly lighter
          },
          elevation12: {
            backgroundColor: "#533e66", // Slightly lighter
          },
          elevation16: {
            backgroundColor: "#58436c", // Slightly lighter
          },
          elevation24: {
            backgroundColor: "#5d4872", // Slightly lighter
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#352042", // Mix of Dark (#44195b) and background
            border: "1px solid rgba(149, 55, 199, 0.15)",
            transition:
              "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 45px rgba(68, 25, 91, 0.45)",
              borderColor: "rgba(149, 55, 199, 0.5)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(42, 42, 42, 0.9)",
            backdropFilter: "blur(10px)",
            color: "#ffffff",
            borderBottom: "1px solid rgba(149, 55, 199, 0.2)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#2a2a2a",
            borderRight: "1px solid rgba(149, 55, 199, 0.2)",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(149, 55, 199, 0.2)",
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: "#b35cde",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(149, 55, 199, 0.2)",
          },
          head: {
            backgroundColor: "#352042",
          },
        },
      },
    },
  });

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Suspense fallback={<LoadingFallback />}>
          <Layout>
            <AppRoutes />
          </Layout>
        </Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

export default App;
