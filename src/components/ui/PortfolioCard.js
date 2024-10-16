import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const PortfolioCard = () => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: "300px",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        bgcolor: "background.paper",
        transition: "0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.5rem",
            backgroundColor:
              theme.palette.mode === "dark" ? "#004c8c" : "#e0f2fe",
            marginRight: "1rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-bar-chart-fill"
            viewBox="0 0 16 16"
          >
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V6z" />
          </svg>
        </Box>
        {/* Text */}
        <Typography
          variant="body2"
          component="div"
          sx={{
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          Create a portfolio to view your investments in one place
        </Typography>
      </Box>

      <Box sx={{ mt: 1.5 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            textTransform: "none",
            borderRadius: "2rem",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            borderWidth: "1.5px",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 255, 0.05)",
              borderColor: "primary.main",
            },
          }}
        >
          <span style={{ marginRight: "0.5rem" }}>+</span>
          New Portfolio
        </Button>
      </Box>
    </Card>
  );
};

export default PortfolioCard;
