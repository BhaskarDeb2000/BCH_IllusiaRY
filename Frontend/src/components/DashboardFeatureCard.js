import React from "react";
import { Card, CardActionArea, Typography, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Enhanced feature card component for the dashboard
 * with improved visibility and accessibility
 */
const DashboardFeatureCard = ({
  icon,
  title,
  description,
  linkTo,
  color = "primary",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (linkTo) {
      navigate(linkTo);
    }
  };

  const handleKeyDown = (event) => {
    // Navigate on Enter or Space key press
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const colorMap = {
    primary: "var(--primary-color)",
    secondary: "var(--secondary-color)",
    accent: "var(--accent-color)",
  };

  const iconColor = colorMap[color] || colorMap.primary;

  return (
    <Tooltip title={`Navigate to ${title}`} arrow enterDelay={500}>
      <Card
        className="dashboard-card fade-in"
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "visible",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            borderRadius: "inherit",
            margin: "-3px",
            background: `linear-gradient(45deg, ${iconColor}, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover::after": {
            opacity: 0.3,
          },
          "&:focus-within": {
            outline: `2px solid ${iconColor}`,
            outlineOffset: "2px",
          },
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={`${title}: ${description}`}
      >
        <CardActionArea
          onClick={handleClick}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "100%",
            p: 3,
            "&:focus": {
              backgroundColor: "rgba(149, 55, 199, 0.08)",
            },
          }}
        >
          <Box
            className="card-icon-wrapper"
            sx={{
              background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}10)`,
              boxShadow: `0 8px 20px ${iconColor}15`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ".dashboard-card:hover &": {
                transform: "scale(1.1)",
                boxShadow: `0 10px 25px ${iconColor}25`,
              },
            }}
          >
            {React.cloneElement(icon, {
              sx: {
                fontSize: 32,
                color: iconColor,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "transform 0.3s ease",
                ".dashboard-card:hover &": {
                  transform: "scale(1.1) rotate(5deg)",
                },
              },
            })}
          </Box>
          <Typography
            variant="h6"
            className="card-title"
            sx={{
              color: "var(--text-primary)",
              position: "relative",
              fontWeight: 600,
              mt: 2,
              "&::after": {
                content: '""',
                position: "absolute",
                height: "2px",
                width: "40px",
                background: iconColor,
                bottom: "-6px",
                left: "0",
                borderRadius: "2px",
                opacity: 0.7,
                transition: "width 0.3s ease",
              },
              ".dashboard-card:hover &::after": {
                width: "80px",
              },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            className="card-text"
            sx={{
              mt: 2,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
};

export default DashboardFeatureCard;
