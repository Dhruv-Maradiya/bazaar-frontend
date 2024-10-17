import Search from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { Box, useTheme, useMediaQuery } from "@mui/system";

const Searchbar = ({ value: search, onChange: setSearch }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        marginTop: "80px",
        display: "flex",
        justifyContent: "center",
        padding: isSmallScreen ? "0 16px" : "0", // Add padding for small screens
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for stocks, ETFs & more"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: (theme) => theme.palette.text.primary }} />
              </InputAdornment>
            ),
          },
          htmlInput: {
            sx: {
              "&::placeholder": {
                color: (theme) => theme.palette.text.primary,
                opacity: 1,
              },
            },
          },
        }}
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 12,
          boxShadow: 2,
          maxWidth: isSmallScreen ? '100%' : 600,
          margin: "0 auto",
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
            borderRadius: 12,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
            border: "none",
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
            border: "none",
          },
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>
  );
};

export default Searchbar;