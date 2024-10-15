import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { formatCurr, formatPercent } from "@/utils/format-number";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red, grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { memo } from "react";

const StockList = ({ searchSymbols }) => {
  const stocks = useSelector((state) => state.firestore.data.dashboardStocks);
  const router = useRouter();

  if (!stocks || (searchSymbols && searchSymbols.length === 0))
    return (
      <Box
        sx={{
          display: "flex",
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">No stocks found</Typography>
      </Box>
    );

  const stocksArray = Object.values(stocks).map((stock) => ({
    ...stock,
    change: stock.price - stock.open,
    changePercent: ((stock.price - stock.open) / stock.open) * 100,
  }));

  return stocksArray.map((stock) => (
    <Box
      key={stock.symbol}
      sx={{
        borderBottom: `1px solid ${grey[300]}`,
        padding: "12px 0",
        display: "flex",
        alignItems: "center",
        flexDirection: "row", // Always horizontal layout
        justifyContent: "space-between", // Space between items
        '&:hover': {
          backgroundColor: grey[50],
        },
      }}
    >
      {/* Stock symbol and name displayed on all screens */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          router.push(`/stocks/${stock.id}`);
        }}
      >
        {/* Display Chip only on larger screens */}
        <Chip
          label={stock.symbol}
          size="small"
          sx={{
            backgroundColor: "#76b82a",
            color: "white",
            borderRadius: 1,
            marginRight: 1,
            display: { xs: "none", sm: "flex" }, // Hide on mobile
          }}
        />
        <Typography variant="subtitle1" fontWeight="bold">{stock.name}</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: '0.9rem', // Smaller font size for mobile
              sm: '1.2rem', // Original font size for larger screens
            },
            color: 'black',
          }}
        >
          {formatCurr(stock.price)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Typography
          sx={{
            color: stock.change > 0 ? green[700] : red[700],
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {stock.change > 0 ? "+" : ""}
          {formatCurr(stock.change)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: stock.change > 0 ? green[50] : red[50],
          borderRadius: 1,
          padding: "4px 8px",
        }}
      >
        {stock.change > 0 ? (
          <ArrowUpwardIcon
            color="success"
            fontSize="small"
            sx={{ marginRight: '4px' }}
          />
        ) : (
          <ArrowDownwardIcon
            color="error"
            fontSize="small"
            sx={{ marginRight: '4px' }}
          />
        )}
        <Typography
          sx={{
            color: stock.change > 0 ? green[700] : red[700],
            fontWeight: 500,
          }}
        >
          {formatPercent(stock.changePercent)}
        </Typography>
      </Box>
    </Box>
  ));
};

export default memo(StockList);
