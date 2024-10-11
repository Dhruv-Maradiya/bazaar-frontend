import Search from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

const Searchbar = ({ value: search, onChange: setSearch }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search for stocks, ETFs & more"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search
                sx={{
                  color: (theme) => theme.palette.text.primary,
                }}
              />
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
        maxWidth: 600,
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
  );
};

export default Searchbar;
