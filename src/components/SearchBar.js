import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
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
        alignItems: 'center',
        maxWidth: 500,
        margin: '16px auto',
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ bgcolor: 'background.paper' }}
      />
      <IconButton onClick={handleSearch} color="primary">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
