import React, { createContext, useState, useEffect } from "react";

// Create a ThemeContext
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  isDarkModeTransitioning: false,
});

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  // Get theme preference from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check for user's preferred color scheme if no saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }

    // Use system preference as fallback
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // Add transition state
  const [isDarkModeTransitioning, setIsDarkModeTransitioning] = useState(false);

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setIsDarkModeTransitioning(true);

    // Small delay to allow transition to complete
    setTimeout(() => {
      setDarkMode(!darkMode);
    }, 50);

    // Reset transition state after transition completes
    setTimeout(() => {
      setIsDarkModeTransitioning(false);
    }, 500);
  };

  // Update localStorage and document attributes when theme changes
  useEffect(() => {
    const newTheme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);

    // Add or remove dark-mode class from document body
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only change if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleDarkMode, isDarkModeTransitioning }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
