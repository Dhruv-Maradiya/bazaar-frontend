import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const PortfolioCard = () => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        maxWidth: 360, 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Icon */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: 40, 
          height: 40, 
          borderRadius: '5px', 
          backgroundColor: '#e0f2fe', 
          marginRight: '10px'
        }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            fill="currentColor" 
            className="bi bi-bar-chart-fill" 
            viewBox="0 0 16 16"
          >
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V6z"/>
          </svg> 
        </Box>
        {/* Text */}
        <Typography 
          variant="body1" 
          component="div"
          sx={{ fontWeight: 500 }}
        >
          Create a portfolio to view your investments in one place
        </Typography>
      </Box>

      {/* Button */}
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ 
            textTransform: 'none',
            borderRadius: '4px',
            padding: '12px 16px'
          }}
        >
          <span style={{ marginRight: '5px' }}>+</span> 
          New Portfolio
        </Button>
      </Box>
    </Card>
  );
};

export default PortfolioCard; 