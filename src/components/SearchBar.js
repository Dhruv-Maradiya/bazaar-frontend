import React from 'react';
import { Box, TextField, InputAdornment, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        margin: '2% auto', // Margin in percentage
        width: '100%', // Full width of the container
      }}
    >
      <FormControl
        variant="outlined"
        sx={{ width: '50%', transition: '0.3s ease-in-out' }} // Added transition for smooth effect
      >
        <TextField
          variant="outlined"
          placeholder="Search stocks, ETFs, indices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          size="medium" // 'medium' size for the input
          sx={{
            bgcolor: 'background.default', // Adapts to dark mode
            borderRadius: '2rem', // Rounded corners using rem
            transition: '0.3s ease', // Smooth transition for shadow effect
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', // Subtle shadow effect on hover
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '2rem', // Rounded corners using rem
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)', // Softer border color for dark mode
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 255, 0.7)', // Lighter blue for hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(0, 0, 255, 0.7)', // Lighter blue when focused
              },
            },
            '& input': {
              paddingLeft: '2rem', // Space for the icon using rem
              color: 'text.primary', // Text color adapts to dark mode
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </Box>
  );
};

export default SearchBar;
