import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const PortfolioCard = () => {
  const theme = useTheme(); // For adapting to light and dark mode

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        maxWidth: '300px', // Smaller width for the card
        padding: '1rem', // Reduce padding to match a more compact design
        borderRadius: '1rem', // Rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Softer shadow
        bgcolor: 'background.paper', // Adapts to dark mode
        transition: '0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)', // Slightly stronger shadow on hover
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Icon */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '2.5rem', // Smaller icon container
            height: '2.5rem', 
            borderRadius: '0.5rem', // Rounded icon background
            backgroundColor: theme.palette.mode === 'dark' ? '#004c8c' : '#e0f2fe', // Dark/light mode adaptive color
            marginRight: '1rem'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" // Smaller icon
            height="16" 
            fill="currentColor" 
            className="bi bi-bar-chart-fill" 
            viewBox="0 0 16 16"
          >
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V6z"/>
          </svg> 
        </Box>
        {/* Text */}
        <Typography 
          variant="body2" // Slightly smaller text size
          component="div"
          sx={{ 
            fontWeight: 500, 
            color: 'text.primary' // Adapts to dark mode
          }}
        >
          Create a portfolio to view your investments in one place
        </Typography>
      </Box>

      {/* Button */}
      <Box sx={{ mt: 1.5 }}> {/* Reduced margin-top */}
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth
          sx={{ 
            textTransform: 'none',
            borderRadius: '2rem', // More rounded button
            padding: '0.75rem 1rem', // Adjusted padding for smaller size
            fontSize: '0.875rem', // Slightly smaller font size for button text
            borderWidth: '1.5px', // Adjusted border size
            backgroundColor: 'transparent', // Transparent background
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 255, 0.05)', // Subtle hover background
              borderColor: 'primary.main',
            }
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>+</span> 
          New Portfolio
        </Button>
      </Box>
    </Card>
  );
};

export default PortfolioCard;
