import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { formatCurr, formatPercent } from "@/utils/format-number";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red } from "@mui/material/colors";
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

  return stocksArray.map((stock, index) => (
    <Box
      key={stock.symbol}
      sx={{
        borderBottom: (theme) =>
          index + 1 !== stocks.length
            ? `1px solid ${theme.palette.divider}`
            : null,
        padding: "12px 0",
        display: "flex",
        alignItems: "center",
        flexDirection: {
          xs: 'row',  // Keep it in a row for mobile
          sm: 'row'   // Maintain row layout for larger screens
        },
        justifyContent: "space-between", // Distribute space between items
      }}
    >
      <Box
        sx={{
          flex: 0.4,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          width: '100%', // Make it responsive
          justifyContent: "space-between", // Ensure space between items
        }}
        onClick={() => {
          router.push(`/stocks/${stock.id}`);
        }}
      >
        <Chip
          label={stock.symbol}
          size="small"
          sx={{
            backgroundColor: "#76b82a",
            color: (theme) => theme.palette.common.white,
            borderRadius: 1,
            display: {
              xs: 'none',
            }
          }}
        />
        <Typography
          sx={{
            fontSize: {
              xs: "0.875rem"
            },
            whiteSpace: 'nowrap' // Prevent text from wrapping
          }}
          variant="subtitle1"
        >
          {stock.name}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 0.2,
          display: 'flex',
          justifyContent: 'flex-end', // Align price to the right
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: {
              xs: 900,
              lg: 800
            },
            fontSize: {
              xs: "0.875rem",
            },
            marginLeft: {
              xs: "1rem",
            }
          }}
        >
          {formatCurr(stock.price)}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 0.2,
          display: 'flex',
          justifyContent: 'flex-end', // Align change to the right
        }}
      >
        <Typography
          sx={{
            color: (theme) =>
              stock.change > 0
                ? theme.palette.mode === "dark"
                  ? green[500]
                  : green[600]
                : theme.palette.mode === "dark"
                  ? red[400]
                  : red[600],
            fontSize: {
              xs: "0.875rem"
            },
            marginLeft: {
              xs: "2rem",
            }
          }}
        >
          {stock.change > 0 ? "+" : ""}
          {formatCurr(stock.change)}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 0.1,
          display: "flex",
          alignItems: "center",
          backgroundColor: stock.change > 0 ? green[50] : red[50],
          borderRadius: 1,
          padding: "4px 8px",
          marginLeft: {
            xs: "1rem",
          }
        }}
      >
        {stock.change > 0 ? (
          <ArrowUpwardIcon
            color="success"
            fontSize="small"
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: "0.875rem"
              },
            }}
          />
        ) : (
          <ArrowDownwardIcon
            color="error"
            fontSize="small"
            sx={{
              fontWeight: 500,
              fontSize: {
                xs: "0.875rem"
              },
            }}
          />
        )}
        <Typography
          sx={{
            color: stock.change > 0 ? green[700] : red[700],
            fontWeight: 500,
            fontSize: {
              xs: "0.875rem"
            },
          }}
        >
          {formatPercent(stock.changePercent)}
        </Typography>
      </Box>
    </Box>
  ));
};

export default memo(StockList);
