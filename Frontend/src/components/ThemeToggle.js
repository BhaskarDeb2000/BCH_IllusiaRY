import React, { useContext } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        mx: 1,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Tooltip
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <IconButton
          onClick={toggleDarkMode}
          color="inherit"
          aria-label="toggle dark/light mode"
          sx={{
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: darkMode ? "rotate(180deg)" : "rotate(0deg)",
            background: darkMode
              ? "rgba(149, 55, 199, 0.15)"
              : "rgba(149, 55, 199, 0.08)",
            "&:hover": {
              background: darkMode
                ? "rgba(149, 55, 199, 0.25)"
                : "rgba(149, 55, 199, 0.15)",
              transform: darkMode
                ? "rotate(180deg) scale(1.1)"
                : "rotate(0deg) scale(1.1)",
            },
            width: 40,
            height: 40,
            border: darkMode
              ? "1px solid rgba(179, 92, 222, 0.3)"
              : "1px solid rgba(149, 55, 199, 0.2)",
          }}
        >
          {darkMode ? (
            <Brightness7Icon
              sx={{
                color: "#ffffff",
                transition: "all 0.3s ease",
                animation: "pulse 1.5s infinite alternate",
                "@keyframes pulse": {
                  "0%": { opacity: 0.7 },
                  "100%": { opacity: 1 },
                },
              }}
            />
          ) : (
            <Brightness4Icon
              sx={{
                color: "#44195b",
                transition: "all 0.3s ease",
              }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggle;
