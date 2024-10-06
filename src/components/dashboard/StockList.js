import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { compose } from "@reduxjs/toolkit";
import { firestoreConnect } from "react-redux-firebase";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useSelector } from "react-redux";
import { formatCurr } from "@/utils/format-number";
import { green, red } from "@mui/material/colors";
import { useRouter } from "next/router";

const StockList = () => {
  const stocks = useSelector((state) => state.firestore.data.dashboardStocks);
  const router = useRouter();

  if (!stocks) return null;

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
      }}
    >
      <Box
        sx={{
          flex: 0.4,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
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
          }}
        />
        <Typography variant="subtitle1">{stock.name}</Typography>
      </Box>
      <Box
        sx={{
          flex: 0.2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 800,
          }}
        >
          {formatCurr(stock.price)}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 0.2,
        }}
      >
        <Typography
          sx={{
            color: stock.change > 0 ? green[700] : red[700],
            fontWeight: 500,
          }}
        >
          {stock.change > 0 ? "+" : "-"}
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
        }}
      >
        {stock.change > 0 ? (
          <ArrowUpwardIcon
            color="success"
            fontSize="small"
            sx={{
              fontWeight: 600,
            }}
          />
        ) : (
          <ArrowDownwardIcon
            color="error"
            fontSize="small"
            sx={{
              fontWeight: 500,
            }}
          />
        )}
        <Typography
          sx={{
            color: stock.change > 0 ? green[700] : red[700],
            fontWeight: 500,
          }}
        >
          {stock.changePercent.toFixed(2)}%
        </Typography>
      </Box>
    </Box>
  ));
};

export default compose(
  firestoreConnect((props) => {
    return [
      {
        collection: "stocks",
        limit: 10,
        orderBy: ["symbol"],
        where: props.searchSymbols
          ? ["symbol", "in", props.searchSymbols]
          : null,
        startAt: props.startAt?.symbol,
        storeAs: "dashboardStocks",
      },
    ];
  })
)(StockList);
